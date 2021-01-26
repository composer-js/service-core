///////////////////////////////////////////////////////////////////////////////
// Copyright (C) AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { UserUtils } from "@composer-js/core";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { ACLUtils } from "../service_core";
import { RequestWS } from "./WebSocket";
const passport = require("passport");

/**
 * Provides a set of utilities for converting Route classes to ExpressJS middleware.
 *
 * @author Jean-Philippe Steinmetz <info@acceleratxr.com>
 */
class RouteUtils {
    /**
     * Creates an Express middleware function that verifies the incoming request is from a valid user with at least
     * one of the specified roles.
     */
    public checkRequiredPerms(): RequestHandler {
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
     * Creates an Express middleware function that verifies the incoming request is from a valid user with at least
     * one of the specified roles.
     *
     * @param requiredRoles The list of roles that the authenticated user must have.
     */
    public checkRequiredRoles(requiredRoles: string[]): RequestHandler {
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
     * Converts the given array of string or Function objects to functions bound to the given route object.
     *
     * @param route The route object that the list of functions is bound to.
     * @param funcs The array of functions (or function names) to return.
     * @param send Set to true to have the last wrapped function send its payload to the client.
     * @returns An array of Function objects mapping to the route object.
     */
    public getFuncArray(route: any, funcs: (Function | string)[], send: boolean = false): RequestHandler[] {
        const result: RequestHandler[] = [];

        if (funcs) {
            for (let i = 0; i < funcs.length; i++) {
                const func: Function | string = funcs[i];
                if (typeof func == "string") {
                    result.push(this.wrapMiddleware(route, route[func], send && i >= funcs.length - 1));
                } else {
                    result.push(this.wrapMiddleware(route, func, send && i >= funcs.length - 1));
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
    public getRouteMethods(route: any): Map<string, any> {
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
     * @param app The Express application to register the route to.
     * @param route The route object to register with Express.
     */
    public registerRoute(app: any, route: any) {
        let routePaths: string[] = Reflect.getMetadata("axr:routePaths", route);
        if (!routePaths) {
            throw new Error("Route must specify a path: " + route);
        }

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
                middleware.push(this.wrapMiddleware(route, value, after == undefined));
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

                        // If the verb is `ws` we need to translate this accordingly
                        if (verb === "ws") {
                            // Rewrite our verb to be `get` so that Express' internal plumbing works correctly
                            verb = "get";
                            // We add .websocket to the end of the path so that other routes using different
                            // verbs will still function correctly
                            path += ".websocket";
                        }

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
                        //this.logger.info("Registered Route: " + verb.toUpperCase() + " " + path);
                    }
                }
            }
        }
    }

    /**
     * Wraps the provided function with Express handling based on the function's defined decorators.
     *
     * @param obj The bound object whose middleware function will be wrapped.
     * @param handler The decorated function to wrap for registration with Express.
     * @param send Set to true to have `func`'s result sent to the client.
     */
    public wrapMiddleware(obj: any, func: Function, send: boolean = false): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction) => {
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
                        } else if (argMetadata[i][0] === "socket") {
                            args[i] =
                                (req as RequestWS).websocket !== undefined ? (req as RequestWS).websocket : req.socket;
                        }
                    }
                }

                // If res.result is defined it means the body has already been processed by another
                // function.
                let result: any = (res as any)["result"] ? (res as any)["result"] : req.body;
                // Now add the result obj as a function argument
                if (result) {
                    let bodyInjected: boolean = false;
                    // Find the first argument without a decorator and insert the request body
                    for (let i = 0; i < args.length; i++) {
                        if (argMetadata && !argMetadata[i]) {
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
                const boundFunc: Function = func.bind(obj);
                result = boundFunc(...args);
                if (result instanceof Promise) {
                    // Wait for the real result
                    result = await result;
                }

                // If this is a WebSocket request, mark it as having been handled. This will notify
                // the WebSocket middleware that the connection is active and shouldn't be closed.
                if ((req as RequestWS).websocket !== undefined) {
                    (req as RequestWS).wsHandled = true;
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
            } catch (error) {
                returnResult = next(error);
            }

            if (returnResult) {
                return returnResult;
            }
        };
    }
}

export default new RouteUtils();
