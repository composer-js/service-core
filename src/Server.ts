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

import { Application, Response, Request, NextFunction } from "express";
import { ConnectionManager } from "./database/ConnectionManager";
import { CorsOptions } from "cors";
import { IndexRoute } from "./routes/IndexRoute";
import { JWTStrategy, JWTStrategyOptions } from "./passportjs/JWTStrategy";
import { ClassLoader, Logger } from "@composer-js/core";
import { OpenAPIRoute } from "./routes/OpenAPIRoute";
import { DataSource, MongoRepository, Repository } from "typeorm";
import { MetricsRoute } from "./routes/MetricsRoute";
import * as Redis from "ioredis";
import { ObjectFactory } from "./ObjectFactory";
import { BackgroundServiceManager } from "./BackgroundServiceManager";
import { RouteUtils } from "./express/RouteUtils";
import { Server as WebSocketServer } from "ws";
import addWebSocket from "./express/WebSocket";
import * as session from "express-session";
import { BulkError } from "./BulkError";
import { BackgroundService } from "./BackgroundService";

interface Entity {
    storeName?: any;
}

interface Model {
    modelClass?: any;
}

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
export class Server {
    /** The OpenAPI specification object to use to construct the server with. */
    protected readonly apiSpec?: any;
    /** The underlying ExpressJS application that provides HTTP processing services. */
    protected app: Application;
    /** The base file system path that will be searched for models and routes. */
    protected readonly basePath: string;
    /** The global object containing configuration information to use. */
    protected readonly config?: any;
    /** The manager for handling database connections. */
    protected connectionManager?: ConnectionManager;
    /** The logging utility to use when outputing to console/file. */
    protected readonly logger: any;
    /** The object factory to use when injecting dependencies. */
    protected readonly objectFactory: ObjectFactory;
    /** The port that the server is listening on. */
    public readonly port: number;
    protected routeUtils?: RouteUtils;
    /** The underlying HTTP server instance. */
    protected server?: http.Server;
    protected serviceManager?: BackgroundServiceManager;
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
        objectFactory?: ObjectFactory,
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
            try {
                this.logger.info("Starting server...");

                // Express configuration
                this.app = express();
                this.server = http.createServer(this.app);
                this.wss = new WebSocketServer({
                    server: this.server,
                });
                this.app = addWebSocket(this.app, this.wss);
                this.app.use(express.static(path.join(__dirname, "public")));
                this.app.use(express.json({ verify: (req: any, res: any, buf: any) => {
                    req.rawBody = buf;
                }}));
                this.app.use(express.urlencoded({ extended: false, type: "application/x-www-form-urlencoded" }));
                this.app.use(cookieParser(this.config.get("cookie_secret")));
                this.app.use(session({
                    cookie: {
                        sameSite: 'none',
                        secure: true
                    },
                    resave: false,
                    saveUninitialized: false,
                    secret: this.config.get("session:secret")
                }));
                this.app.use(passport.initialize());
                this.app.use(passport.session());

                // cors
                const corsOptions: CorsOptions = {
                    origin: this.config.get("cors:origins"),
                    credentials: true,
                    methods: "GET,HEAD,OPTIONS,PUT,POST,DELETE",
                    allowedHeaders: [
                        "Accept",
                        "Authorization",
                        "Content-Type",
                        "Location",
                        "Origin",
                        "Set-Cookie",
                        "X-Requested-With"
                    ],
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
                    const jwtOptions: JWTStrategyOptions = new JWTStrategyOptions();
                    jwtOptions.headerScheme = "(jwt|bearer)";
                    jwtOptions.config = this.config.get("auth");
                    passport.use("jwt", new JWTStrategy(jwtOptions));
                }

                // Set x-powered-by header
                this.app.use((req: Request, res: Response, next: NextFunction) => {
                    res.setHeader("x-powered-by", "AcceleratXR");
                    return next();
                });

                this.connectionManager = await this.objectFactory.newInstance(ConnectionManager, "default");
                const datastores: any = this.config.get("datastores");
                const models: Map<string, any> = new Map();

                this.logger.info("Loading all service classes...");
                const classLoader: ClassLoader = new ClassLoader(this.basePath);
                try {
                    await classLoader.load();
                }
                catch (e) {
                    reject(`[server-core|Server.ts]**ERR @ start, loading service classes: ${e}`);
                }

                // Register all found classes with the object factory
                for (const [name, clazz] of classLoader.getClasses().entries()) {
                    this.objectFactory.register(clazz, name);
                }

                // Load all models
                this.logger.info("Scanning for data models...");
                for (const [name, clazz] of classLoader.getClasses().entries()) {
                    const datastore: string | undefined = Reflect.getMetadata("cjs:datastore", clazz) || undefined;
                    if (datastore) {
                        models.set(name, clazz);
                    }
                }

                // Initiate all database connections
                this.logger.info("Initializing database connection(s)...");

                await this.connectionManager.connect(datastores, models);

                const allRoutes: Array<any> = [];

                this.routeUtils = await this.objectFactory.newInstance(RouteUtils, "default");
                if (!this.routeUtils) {
                    reject("Failed to instantiate RouteUtils.");
                    return;
                }

                // Register the index route
                const index: IndexRoute = await this.instantiateRoute(IndexRoute);
                allRoutes.push(index);
                await this.routeUtils.registerRoute(this.app, index);

                // Register the OpenAPI route if a spec has been provided
                if (this.apiSpec) {
                    const oasRoute: OpenAPIRoute = await this.objectFactory.newInstance(OpenAPIRoute, "default", this.apiSpec);
                    await this.routeUtils.registerRoute(this.app, oasRoute);
                    allRoutes.push(oasRoute);
                }

                // Register the metrics route
                const metricsRoute: MetricsRoute = await this.instantiateRoute(MetricsRoute);
                await this.routeUtils.registerRoute(this.app, metricsRoute);

                // Initialize the background service manager
                this.logger.info("Starting background services...");
                const serviceClasses: any = {};
                for (const [name, clazz] of classLoader.getClasses().entries()) {
                    if (clazz.prototype instanceof BackgroundService) {
                        serviceClasses[name] = clazz;
                    }
                }
                this.serviceManager = await this.objectFactory.newInstance(BackgroundServiceManager, "default", this.objectFactory, serviceClasses, this.config, this.logger);
                if (this.serviceManager) {
                    await this.serviceManager.startAll();
                }

                // Perform automatic discovery of all other routes
                this.logger.info("Scanning for routes...");
                try {
                    for (const [name, clazz] of classLoader.getClasses().entries()) {
                        const routePaths: string[] | undefined = clazz.prototype ? Reflect.getMetadata("cjs:routePaths", clazz.prototype) : Reflect.getMetadata("cjs:routePaths", clazz);
                        if (routePaths) {
                            const route: any = await this.instantiateRoute(clazz);
                            await this.routeUtils.registerRoute(this.app, route);
                            allRoutes.push(route);
                        }
                    }
                } catch (err) {
                    reject(err);
                    return;
                }

                // Error handling. NOTE: Must be defined last.
                this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
                    if (err) {
                        // Only log 500-level errors. 400-level errors are the client's fault and
                        // we don't need to spam the logs because of that.
                        if (err.status >= 500) {
                            this.logger.error(err);
                        } else {
                            this.logger.debug(err);
                        }

                        if (typeof err === "string") {
                            if (!res.headersSent) {
                                res.status(500);
                            }
                            res.json(err);
                        } else if (err instanceof BulkError) {
                            const errs: (Error | null)[] = err.errors;
                            if (err.stack && process.env.NODE_ENV === "production") {
                                for (const err of errs) {
                                    if (err) {
                                        delete err.stack;
                                    }
                                }
                            }

                            if (!res.headersSent) {
                                res.status(err.status);
                            }

                            res.json(errs);
                        } else {
                            if (!err.status && !err.status) {
                                err.status = 500;
                            }
                            // leverage NODE_ENV or another config?
                            if (err.stack && process.env.NODE_ENV === "production") {
                                delete err.stack;
                            }
                            if (!res.headersSent) {
                                res.status(err.status);
                            }

                            const formattedError = {
                                ...err,
                                // https://stackoverflow.com/a/25245824
                                level: err.level ? err.level.replace(/\u001b\[.*?m/g, '') : undefined,
                                message: err.message
                            }
                            res.json(err.stack ? { ...formattedError, stack: err.stack } : formattedError);
                        }

                        Server.metricFailedRequests.inc(1);
                    }

                    return next();
                });

                this.app.use((req: Request, res: Response) => {
                    Server.metricRequestPath.labels(req.path).observe(1);
                    Server.metricRequestStatus.labels(req.path, String(res.status)).observe(1);
                    return !res.writableEnded ? res.send() : res;
                });

                // Initialize the HTTP listen server
                this.server.listen(this.port, "0.0.0.0", () => {
                    this.logger.info("Listening on port " + this.port + "...");
                    resolve();
                });
            } catch (err) {
                this.logger.error(err);
                reject(err);
            }
        });
    }

    /**
     * Stops the HTTP listen server.
     */
    public stop(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.logger.info("Stopping background services...");
            await this.serviceManager?.stopAll();

            if (this.wss) {
                this.logger.info("Stopping server...");
                this.wss.close(async (err: any) => {
                    if (err) {
                        reject(err);
                    } else if (this.server) {
                        this.wss = undefined;

                        this.server.close(async (err: any) => {
                            this.logger.info("Closing database connections...");
                            await this.connectionManager?.disconnect();

                            if (err) {
                                reject(err);
                            } else {
                                this.server = undefined;
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
