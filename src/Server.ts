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
    constructor(config: any, apiSpec?: any, basePath: string = ".", logger: any = Logger(), objectFactory?: ObjectFactory) {
        this.config = config;
        this.apiSpec = apiSpec;
        this.basePath = basePath;
        this.logger = logger;
        this.objectFactory = objectFactory ? objectFactory : new ObjectFactory(config, logger);
        this.port = config.get("port") ? config.get("port") : 3000;

        // Express configuration
        this.app = express();
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
    }

    /**
     * Returns the express app
     */
    public getApplication(): Application {
        return this.app;
    }

    /**
     * Returns `true` if the server is running, otherwise `false`.
     */
    public isRunning(): boolean {
        return this.server ? this.server.listening : false;
    }

    /**
     * Creates an Express middleware function that verifies the incoming request is from a valid user with at least
     * one of the specified roles.
     *
     * @param requiredRoles The list of roles that the authenticated user must have.
     */
    protected checkRequiredRoles(requiredRoles: string[]): RequestHandler {
        return function (req: Request, res: Response, next: NextFunction) {
            let foundRole: boolean = UserUtils.hasRoles(req.user, requiredRoles);

            if (foundRole) {
                return next();
            } else {
                return res.status(403).send();
            }
        };
    }

    /**
     * Creates an Express middleware function that verifies the incoming request is from a valid user with at least
     * one of the specified roles.
     */
    protected checkRequiredPerms(): RequestHandler {
        return async function (req: Request, res: Response, next: NextFunction) {
            let granted: boolean = await ACLUtils.checkRequestPerms(req.user as any, req);

            if (granted) {
                return next();
            } else {
                return res.status(403).send();
            }
        };
    }

    /**
     * Injects all known dependencies into the given object based on the property decorators.
     *
     * @param clazz The class type of the object to inject.
     * @param obj The object whose dependencies will be injected.
     */
    protected injectProperties(clazz: any, obj: any): void {
        // Set the cache TTL if set on the model
        if (clazz.modelClass && clazz.modelClass.cacheTTL) {
            obj.cacheTTL = clazz.modelClass.cacheTTL;
        }

        // Set the trackChanges if set on the model
        if (clazz.modelClass && clazz.modelClass.trackChanges) {
            obj.trackChanges = clazz.modelClass.trackChanges;
        }
        
        // Initialize the object with the ObjectFactory
        this.objectFactory.initialize(obj);
    }

    /**
     * Intantiates the given route class definition into an object that can be registered to Express.
     *
     * @param classDef The class definition of the route to instantiate.
     * @returns A new instance of the provided class definition that implements the Route interface.
     */
    protected instantiateRoute(classDef: any): any {
        const obj: any = new classDef();
        Object.defineProperty(obj, "class", {
            enumerable: true,
            writable: false,
            value: classDef,
        });
        this.injectProperties(classDef, obj);
        return obj;
    }

    /**
     * Converts the given array of string or Function objects to functions bound to the given route object.
     *
     * @param route The route object that the list of functions is bound to.
     * @param funcs The array of functions (or function names) to return.
     * @param send Set to true to have the last wrapped function send its payload to the client.
     * @returns An array of Function objects mapping to the route object.
     */
    protected getFuncArray(route: any, funcs: (Function | string)[], send: boolean = false): RequestHandler[] {
        const result: RequestHandler[] = [];

        if (funcs) {
            for (let i = 0; i < funcs.length; i++) {
                const func: Function | string = funcs[i];
                if (typeof func == "string") {
                    result.push(this.wrapRequestHandler(route, route[func], send && i >= funcs.length - 1));
                } else {
                    result.push(this.wrapRequestHandler(route, func, send && i >= funcs.length - 1));
                }
            }
        }

        return result;
    }

    /**
     * Searches an route object for any functions that implement a `@Method` decorator.
     *
     * @param route The route object to search.
     * @returns The list of `@Method` decorated functions that were found.
     */
    protected getRouteMethods(route: any): Map<string, any> {
        let results: Map<string, any> = new Map();

        for (let member in route) {
            let metadata: any = Reflect.getMetadata("axr:route", route, member);
            if (metadata) {
                results.set(member, route[member]);
            }
        }
        let proto = Object.getPrototypeOf(route);
        while (proto) {
            for (let member of Object.getOwnPropertyNames(proto)) {
                let metadata: any = Reflect.getMetadata("axr:route", proto, member);
                if (metadata) {
                    results.set(member, route[member]);
                }
            }
            proto = Object.getPrototypeOf(proto);
        }

        return results;
    }

    /**
     * Registers the provided route object containing a set of decorated endpoints to the server.
     *
     * @param route The route object to register with Express.
     */
    public registerRoute(route: any) {
        let routePaths: string[] = Reflect.getMetadata("axr:routePaths", route);
        if (!routePaths) {
            throw new Error("Route must specify a path: " + route);
        }

        // Convert Express app to any so that we can easily register methods dynamically
        const app: any = this.app;

        // Each route definition will contain a set of functions that have been decorated to include route metadata.
        // The route metadata will include what HTTP methods and paths that the endpoint is to be bound to. Multiple
        // methods and paths can be assigned to a single decorated function. Therefore, it is necessary to register
        // each combination of basePath, path and method that have been defined by the decorators.
        let methods: Map<string, any> = this.getRouteMethods(route);
        for (let entry of methods.entries()) {
            let key: string = entry[0];
            let value: any = entry[1] as any;

            let metadata: any = Reflect.getMetadata("axr:route", route, key);
            if (value && metadata) {
                const { after, authRequired, before, methods, requiredRoles, validator } = metadata;
                let { authStrategies } = metadata;
                let verbMap: Map<string, string> = methods as Map<string, string>;

                // If no JWT strategies have been provided by default, always include JWT token support
                if (!authStrategies) {
                    authStrategies = ["jwt"];
                }

                // Prepare the list of middleware to apply for the given endpoint.
                // The order of operations for middleware is:
                // 1. Auth Strategies
                // 2. Required Roles
                // 3. Required Permissions (Path Matching)
                // 4. Validator Function
                // 5. Before Functions
                // 6. Decorated Function
                // 7. After Functions
                let middleware: Array<RequestHandler> = new Array();
                if (requiredRoles) {
                    middleware.push(this.checkRequiredRoles(requiredRoles));
                }
                middleware.push(this.checkRequiredPerms());
                if (validator) {
                    middleware = middleware.concat(this.getFuncArray(route, [validator]));
                }
                middleware = middleware.concat(this.getFuncArray(route, before));
                middleware.push(this.wrapRequestHandler(route, value, after == undefined));
                middleware = middleware.concat(this.getFuncArray(route, after, true));

                // Multiple method verbs can be registered for a given route endpoint.
                for (let entry of verbMap.entries()) {
                    let verb: string = entry[0];

                    // Multiple base paths can be provided to a single route definition.
                    for (let basePath of routePaths) {
                        let subpath: string = entry[1].startsWith("/") ? entry[1].substr(1) : entry[1];
                        let path: string =
                            subpath.length == 0 || basePath.endsWith("/")
                                ? basePath + subpath
                                : basePath + "/" + subpath;

                        // If auth strategies are provided add the necessary passport middleware
                        if (authStrategies && authStrategies.length > 0) {
                            app[verb](
                                path,
                                passport.authenticate(authStrategies, {
                                    session: false,
                                    allowFailure: authRequired ? false : true,
                                }),
                                ...middleware
                            );
                        } else {
                            app[verb](path, ...middleware);
                        }
                        this.logger.info("Registered Route: " + verb.toUpperCase() + " " + path);
                    }
                }
            }
        }
    }

    /**
     * Starts an HTTP listen server based on the provided configuration and OpenAPI specification.
     */
    public async start(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.logger.info("Starting server...");

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
            this.registerRoute(index);

            // Register the ACLs route if configured
            const aclConn: any = ConnectionManager.connections.get("acl");
            if (aclConn instanceof Connection) {
                if (aclConn.driver.constructor.name === "MongoDriver") {
                    const aclRoute: ACLRouteMongo = this.instantiateRoute(ACLRouteMongo);
                    this.registerRoute(aclRoute);
                    allRoutes.push(aclRoute);
                } else {
                    const aclRoute: ACLRouteSQL = this.instantiateRoute(ACLRouteSQL);
                    this.registerRoute(aclRoute);
                    allRoutes.push(aclRoute);
                }
            }

            // Register the OpenAPI route if a spec has been provided
            if (this.apiSpec) {
                const oasRoute: OpenAPIRoute = new OpenAPIRoute(this.apiSpec);
                this.registerRoute(oasRoute);
                allRoutes.push(oasRoute);
            }

            // Register the metrics route
            const metricsRoute: MetricsRoute = new MetricsRoute(this.config);
            this.registerRoute(metricsRoute);

            // Perform automatic discovery of all other routes
            this.logger.info("Scanning for routes...");
            try {
                const routeScanner: RouteScanner = new RouteScanner(path.join(this.basePath, "routes"));
                const routes: any[] = await routeScanner.scan();
                for (const clazz of routes) {
                    const route: any = this.instantiateRoute(clazz);
                    this.registerRoute(route);
                    allRoutes.push(route);
                }
            } catch (err) {
                reject("Failed to scan for routes.\n" + err);
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
            this.server = http.createServer(this.app);
            this.server.listen(this.port, "0.0.0.0", () => {
                this.logger.info("Listening on port " + this.port + "...");
                resolve();
            });
        });
    }

    /**
     * Stops the HTTP listen server.
     */
    public async stop(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.server) {
                this.logger.info("Stopping server...");
                this.server.close(async () => {
                    this.server = undefined;

                    this.logger.info("Closing database connections...");
                    await ConnectionManager.disconnect();

                    resolve();
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

    /**
     * Wraps the provided function with Express handling based on the function's defined decorators.
     *
     * @param obj The object whose scope will be bound to when executing the function.
     * @param handler The decorated function to wrap for registration with Express.
     * @param send Set to true to have `func`'s result sent to the client.
     */
    protected wrapRequestHandler(obj: any, func: Function, send: boolean = false): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction) => {
            const startTime: number = new Date().valueOf();
            let returnResult: any = undefined;

            try {
                const argMetadata: any = Reflect.getMetadata("axr:args", Object.getPrototypeOf(obj), func.name);
                const routeMetadata: any = Reflect.getMetadata("axr:route", Object.getPrototypeOf(obj), func.name);
                const args: any[] = [];

                // This is a hack that lets us stub out function arguments because we no longer can access
                // them directly with func.arguments. Unfortunately this means we can't get default values
                // as there's no way to reference them. =(
                for (let i = 0; i < func.length; i++) {
                    args.push(undefined);
                }

                // Populate the list of function arguments based on the metadata
                if (argMetadata) {
                    for (const key in argMetadata) {
                        const i: number = Number(key);
                        if (argMetadata[i][0] === "header") {
                            if (argMetadata[i][1]) {
                                args[i] = req.headers[argMetadata[i][1]];
                            } else {
                                args[i] = req.headers;
                            }
                        } else if (argMetadata[i][0] === "param") {
                            if (argMetadata[i][1]) {
                                args[i] = req.params[argMetadata[i][1]];
                            } else {
                                args[i] = req.params;
                            }
                        } else if (argMetadata[i][0] === "query") {
                            if (argMetadata[i][1]) {
                                args[i] = req.query[argMetadata[i][1]];
                            } else {
                                args[i] = req.query;
                            }
                        } else if (argMetadata[i][0] === "request") {
                            args[i] = req;
                        } else if (argMetadata[i][0] === "response") {
                            args[i] = res;
                        } else if (argMetadata[i][0] === "user") {
                            args[i] = req.user;
                        }
                    }
                }

                // If res.result is defined it means the body has already been processed by another
                // function.
                let result: any = (res as any)["result"] ? (res as any)["result"] : req.body;
                // Now add the result obj as a function argument
                if (result) {
                    let bodyInjected: boolean = false;
                    // Find the first argument without an injection and insert the request body
                    for (let i = 0; i < args.length; i++) {
                        if (!args[i]) {
                            args[i] = result;
                            bodyInjected = true;
                            break;
                        }
                    }

                    // If no undecorated arg could be found inject at the end
                    if (bodyInjected) {
                        args.push(result);
                    }
                }

                // Call the wrapped function
                const boundFunc: Function = func.bind(obj, ...args);
                result = boundFunc(...args);
                if (result instanceof Promise) {
                    // Wait for the real result
                    result = await result;
                }

                if (send) {
                    // If a result was returned set it as the response body, otherwise set the status to NO_CONTENT
                    if (result) {
                        // Does the handler specify it's own Content-Type override?
                        const contentType: string =
                            routeMetadata && routeMetadata.contentType ? routeMetadata.contentType : "application/json";
                        // Don't encode the result as JSON if not the desired content-type
                        res.header("Content-Type", contentType).send(
                            contentType === "application/json" ? JSON.stringify(result) : result
                        );
                    } else {
                        res.status(204).send();
                    }

                    returnResult = next();
                } else {
                    // Assign result to the response for other handlers to use
                    (res as any).result = result;
                    returnResult = next();
                }

                Server.metricCompletedRequests.inc(1);
            } catch (error) {
                returnResult = next(error);
            }

            // Record the processing time
            const endTime: number = new Date().valueOf();
            Server.metricRequestTime.labels(req.path).observe(endTime - startTime);

            if (returnResult) {
                return returnResult;
            }
        };
    }
}

export default Server;
