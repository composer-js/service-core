///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
import * as http from "http";
const passport = require("passport");
import * as path from "path";
import * as prom from "prom-client";
import "reflect-metadata";

import { Application, Response, Request, NextFunction, RequestHandler } from "express";
import ConnectionManager from "./database/ConnectionManager";
import { CorsOptions } from "cors";
import IndexRoute from "./routes/IndexRoute";
import { JWTStrategy, Options as JWTOptions } from "./passportjs/JWTStrategy";
import { Logger, UserUtils } from "@composer-js/core";
import ModelUtils from "./models/ModelUtils";
import OpenAPIRoute from "./routes/OpenAPIRoute";
import RouteScanner from "./RoutesScanner";
import { Connection, MongoRepository, Repository } from "typeorm";
import MetricsRoute from "./routes/MetricsRoute";
import * as Redis from "ioredis";
import ACLRouteMongo from "./security/ACLRouteMongo";
import ACLRouteSQL from "./security/ACLRouteSQL";
import { default as AccessControlListSQL } from "./security/AccessControlListSQL";
import { default as AccessControlListMongo } from "./security/AccessControlListMongo";
import ACLUtils from "./security/ACLUtils";
import ObjectFactory from "./ObjectFactory";
import RouteUtils from "./express/RouteUtils";
import { Server as WebSocketServer } from "ws";
import addWebSocket from "./express/WebSocket";

/**
 * Provides an HTTP server utilizing ExpressJS and PassportJS. The server automatically registers all routes, and
 * establishes database connections for all configured data stores. Additionally provides automatic authentication
 * handling using JSON Web Token (JWT) via PassportJS. When provided an OpenAPI specificatiion object the server will
 * also automatically serve this specification via the `GET /openapi.json` route.
 * 
 * Routes are defined by creating any class definition using the various decorators found in `RouteDecorators` and
 * saving these files in the `routes` subfolder. Upon server start, the `routes` folder is scanned for any class
 * that has been decorated with `@Route` and is automatically loaded and registered with Express. Similarly, if the
 * class is decorated with the `@Model` decorator the resulting route object will have the associated data model
 * definition object injected into the constructor.
 *
 * By default all registered endpoints that do not explicit have an `@Auth` decorator have the `JWT` authentication
 * strategy applied. This allows users to be implicitly authenticated without requiring additional configuration.
 * Once authenticated, the provided `request` argument will have the `user` property available containing information
 * about the authenticated user. If the `user` property is `undefined` then no user has been authenticated or the
 * authentication attempt failed.
 * 
 * The following is an example of a simple route class.
 * 
```javascript
import { DefaultBehaviors, RouteDecorators } from "@acceleratxr/service_core";
import { Get, Route } = RouteDecorators;

@Route("/hello")
class TestRoute extends ModelRoute {
    constructor(model: any) {
        super(model);
    }

    @Get()
    count(req: any, res: any, next: Function): any {
        return res.send("Hello World!");
    }
}

export default TestRoute;
 * ```
 * 
 * The following is an example of a route class that is bound to a data model providing basic CRUDS operations.
 * 
 * ```javascript
import { DefaultBehaviors, ModelDecorators, ModelRoute, RouteDecorators } from "@acceleratxr/service_core";
import { After, Before, Delete, Get, Post, Put, Route, Validate } = RouteDecorators;
import { Model } = ModelDecorators;
import { marshall } = DefaultBehaviors;

@Model("Item")
@Route("/items")
class ItemRoute extends ModelRoute {
    constructor(model: any) {
      super(model);
  }

  @Get()
  @Before(super.count)
  @After(marshall)
  count(req: any, res: any, next: Function): any {
      return next();
  }

  @Post()
  @Before([super.create])
  @After([this.prepare, marshall])
  create(req: any, res: any, next: Function): any {
      return next();
  }

  @Delete(":id")
  @Before([super.delete])
  delete(req: any, res: any, next: Function): any {
      return next();
  }

  @Get()
  @Before([super.findAll])
  @After(this.prepareAndSend)
  findAll(req: any, res: any, next: Function): any {
      return next();
  }

  @Get(":id")
  @Before([super.findById])
  @After([this.prepare, marshall])
  findById(req: any, res: any, next: Function): any {
      return next();
  }

  @Put(":id")
  @Before([super.update])
  @After([this.prepare, marshall])
  update(req: any, res: any, next: Function): any {
      return next();
  }
}

export default ItemRoute;
```
 *
 * @author Jean-Philippe Steinmetz
 */
class Server {
    /** The repository to the access control lists. */
    protected readonly aclRepo?: Repository<AccessControlListSQL> | MongoRepository<AccessControlListMongo>;
    /** The OpenAPI specification object to use to construct the server with. */
    protected readonly apiSpec?: any;
    /** The underlying ExpressJS application that provides HTTP processing services. */
    protected app: Application;
    /** The base file system path that will be searched for models and routes. */
    protected readonly basePath: string;
    /** The global object containing configuration information to use. */
    protected readonly config?: any;
    /** The logging utility to use when outputing to console/file. */
    protected readonly logger: any;
    /** The object factory to use when injecting dependencies. */
    protected readonly objectFactory: ObjectFactory;
    /** The port that the server is listening on. */
    public readonly port: number;
    /** The underlying HTTP server instance. */
    protected server?: http.Server;
    /** The underlying WebSocket server instance. */
    protected wss?: WebSocketServer;

    ///////////////////////////////////////////////////////////////////////////
    // METRICS VARIABLES
    ///////////////////////////////////////////////////////////////////////////
    protected static metricRequestPath: prom.Histogram<string> = new prom.Histogram({
        name: "request_path",
        help: "A histogram of the number of handled requests by the requested path.",
        labelNames: ["path"],
    });
    protected static metricRequestStatus: prom.Histogram<string> = new prom.Histogram({
        name: "request_status",
        help: "A histogram of the resulting status code of handled requests by the requested path.",
        labelNames: ["path", "code"],
    });
    protected static metricRequestTime: prom.Summary<string> = new prom.Summary({
        name: "request_time",
        help: "A histogram of the response time of handled requests by the requested path.",
        labelNames: ["path"],
    });
    protected static metricCompletedRequests: prom.Counter<string> = new prom.Counter({
        name: "num_completed_requests",
        help: "The total number of successfully completed requests.",
    });
    protected static metricFailedRequests: prom.Counter<string> = new prom.Counter({
        name: "num_failed_requests",
        help: "The total number of failed requests.",
    });
    protected static metricTotalRequests: prom.Counter<string> = new prom.Counter({
        name: "num_total_requests",
        help: "The total number of requests processed.",
    });

    /**
     * Creates a new instance of Server with the specified defaults.
     *
     * @param {any} config The nconf-compatible configuration object to initialize the server with.
     * @param {any} apiSpec The optional OpenAPI specification object to initialize the server with.
     * @param {string} basePath The base file system path that models and routes will be searched from.
     * @param {Logger} logger The logging utility to use for outputing to console/file.
     * @param objectFactory The object factory to use for automatic dependency injection (IOC).
     */
    constructor(
        config: any,
        apiSpec?: any,
        basePath: string = ".",
        logger: any = Logger(),
        objectFactory?: ObjectFactory
    ) {
        this.app = express();
        this.config = config;
        this.apiSpec = apiSpec;
        this.basePath = basePath;
        this.logger = logger;
        this.objectFactory = objectFactory ? objectFactory : new ObjectFactory(config, logger);
        this.port = config.get("port") ? config.get("port") : 3000;
    }

    /**
     * Returns the express app.
     */
    public getApplication(): Application {
        return this.app;
    }

    /**
     * Returns the http server.
     */
    public getServer(): http.Server | undefined {
        return this.server;
    }

    /**
     * Returns `true` if the server is running, otherwise `false`.
     */
    public isRunning(): boolean {
        return this.server ? this.server.listening : false;
    }

    /**
     * Injects all known dependencies into the given object based on the property decorators.
     *
     * @param clazz The class type of the object to inject.
     * @param obj The object whose dependencies will be injected.
     */
    protected injectProperties(clazz: any, obj: any): Promise<void> {
        // Set the cache TTL if set on the model
        if (clazz.modelClass && clazz.modelClass.cacheTTL) {
            obj.cacheTTL = clazz.modelClass.cacheTTL;
        }

        // Set the trackChanges if set on the model
        if (clazz.modelClass && clazz.modelClass.trackChanges) {
            obj.trackChanges = clazz.modelClass.trackChanges;
        }

        // Initialize the object with the ObjectFactory
        return this.objectFactory.initialize(obj);
    }

    /**
     * Intantiates the given route class definition into an object that can be registered to Express.
     *
     * @param classDef The class definition of the route to instantiate.
     * @returns A new instance of the provided class definition that implements the Route interface.
     */
    protected async instantiateRoute(classDef: any): Promise<any> {
        const obj: any = new classDef();
        Object.defineProperty(obj, "class", {
            enumerable: true,
            writable: false,
            value: classDef,
        });
        await this.injectProperties(classDef, obj);
        return obj;
    }

    /**
     * Starts an HTTP listen server based on the provided configuration and OpenAPI specification.
     */
    public start(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.logger.info("Starting server...");

            // Express configuration
            this.app = express();
            this.server = http.createServer(this.app);
            this.wss = new WebSocketServer({
                server: this.server,
            });
            this.app = addWebSocket(this.app, this.wss);
            this.app.use(express.static(path.join(__dirname, "public")));
            this.app.use(express.json());
            this.app.use(express.urlencoded({ extended: false, type: "application/x-www-form-urlencoded" }));
            this.app.use(cookieParser(this.config.get("cookie_secret")));
            this.app.use(passport.initialize());
            this.app.use(passport.session());

            // cors
            const corsOptions: CorsOptions = {
                origin: this.config.get("cors:origins"),
                credentials: true,
                methods: "GET,HEAD,OPTIONS,PUT,POST,DELETE",
                allowedHeaders: ["Accept", "Authorization", "Content-Type", "Origin", "X-Requested-With"],
                preflightContinue: false,
                optionsSuccessStatus: 204,
            };
            this.app.use(cors(corsOptions));

            // passport (authentication) setup
            passport.deserializeUser((profile: any, done: any) => {
                done(null, profile);
            });
            passport.serializeUser((profile: any, done: any) => {
                done(null, profile);
            });
            if (this.config.get("auth:strategy") === "JWTStrategy") {
                const jwtOptions: JWTOptions = new JWTOptions();
                jwtOptions.headerScheme = "(jwt|bearer)";
                jwtOptions.config = this.config.get("auth");
                passport.use("jwt", new JWTStrategy(jwtOptions));
            }

            // Set x-powered-by header
            this.app.use((req: Request, res: Response, next: NextFunction) => {
                res.setHeader("x-powered-by", "AcceleratXR");
                return next();
            });

            // Load all models
            this.logger.info("Loading data models...");
            const models: any = await ModelUtils.loadModels(path.join(this.basePath, "models"));

            // Initiate all database connections
            this.logger.info("Initializing database connection(s)...");
            const datastores: any = this.config.get("datastores");
            // If ACL has been configured we need to make sure the proper models are configured and loaded
            if (datastores.acl) {
                if (datastores.acl.type === "mongodb") {
                    models[AccessControlListMongo.name] = AccessControlListMongo;
                } else {
                    models[AccessControlListSQL.name] = AccessControlListSQL;
                }
            }
            await ConnectionManager.connect(datastores, models);

            // Initialize ACL utility
            ACLUtils.init(this.config);

            const allRoutes: Array<any> = [];

            // Register the index route
            const index: IndexRoute = new IndexRoute(this.config);
            allRoutes.push(index);
            RouteUtils.registerRoute(this.app, index);

            // Register the ACLs route if configured
            const aclConn: any = ConnectionManager.connections.get("acl");
            if (aclConn instanceof Connection) {
                if (aclConn.driver.constructor.name === "MongoDriver") {
                    const aclRoute: ACLRouteMongo = await this.instantiateRoute(ACLRouteMongo);
                    RouteUtils.registerRoute(this.app, aclRoute);
                    allRoutes.push(aclRoute);
                } else {
                    const aclRoute: ACLRouteSQL = await this.instantiateRoute(ACLRouteSQL);
                    RouteUtils.registerRoute(this.app, aclRoute);
                    allRoutes.push(aclRoute);
                }
            }

            // Register the OpenAPI route if a spec has been provided
            if (this.apiSpec) {
                const oasRoute: OpenAPIRoute = new OpenAPIRoute(this.apiSpec);
                RouteUtils.registerRoute(this.app, oasRoute);
                allRoutes.push(oasRoute);
            }

            // Register the metrics route
            const metricsRoute: MetricsRoute = new MetricsRoute(this.config);
            RouteUtils.registerRoute(this.app, metricsRoute);

            // Perform automatic discovery of all other routes
            this.logger.info("Scanning for routes...");
            try {
                const routeScanner: RouteScanner = new RouteScanner(path.join(this.basePath, "routes"));
                const routes: any[] = await routeScanner.scan();
                for (const clazz of routes) {
                    const route: any = await this.instantiateRoute(clazz);
                    RouteUtils.registerRoute(this.app, route);
                    allRoutes.push(route);
                }
            } catch (err) {
                reject("Failed to scan for routes.\n" + err);
                return;
            }

            // Error handling. NOTE: Must be defined last.
            this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
                if (err) {
                    this.logger.error(err);
                    if (typeof err === "string") {
                        res.status(500).header("Content-Type", "application/json").send(JSON.stringify(err));
                    } else {
                        if (!err.status && !err.status) {
                            err.status = 500;
                        }
                        // leverage NODE_ENV or another config?
                        if (err.stack && process.env.NODE_ENV === "production") {
                            err.stack = undefined;
                        }
                        res.status(err.status)
                            .header("Content-Type", "application/json")
                            .send(JSON.stringify(err, Object.getOwnPropertyNames(err)));
                    }

                    Server.metricFailedRequests.inc(1);
                }

                Server.metricRequestPath.labels(req.path).observe(1);
                Server.metricRequestStatus.labels(req.path, String(res.status)).observe(1);
            });

            // Initialize the HTTP listen server
            this.server.listen(this.port, "0.0.0.0", () => {
                this.logger.info("Listening on port " + this.port + "...");
                resolve();
            });
        });
    }

    /**
     * Stops the HTTP listen server.
     */
    public stop(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.server && this.wss) {
                this.logger.info("Stopping server...");
                this.wss.close(async (err: any) => {
                    if (err) {
                        reject(err);
                    } else if (this.server) {
                        this.server.close(async (err: any) => {
                            this.logger.info("Closing database connections...");
                            await ConnectionManager.disconnect();

                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    }
                });

                setTimeout(() => {
                    reject("Failed to shut down server.");
                }, 30000);
            } else {
                resolve();
            }
        });
    }

    /**
     * Restarts the HTTP listen server using the provided configuration and OpenAPI specification.
     */
    public async restart(): Promise<void> {
        await this.stop();
        return this.start();
    }
}

export default Server;
