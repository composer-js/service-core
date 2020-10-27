///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import "reflect-metadata";

/**
 * Indicates a provided function or list of functions to execute *after* the decorated function and before the response
 * is sent to a client. Note that the function must call `next()` in order for this decorator to work.
 *
 * @param func The function or list of functions to execute *after* the decorated function.
 */
export function After(func: Function | string | (Function | string)[]) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let route: any = Reflect.getMetadata("axr:route", target, propertyKey) || {};

        // Ensure we always have an array of functions. Also, append the new list of functions to any existing list.
        let funcs: (Function | string)[] = Array.isArray(func) ? func : [func];
        route.after = route.after ? route.after.concat(funcs) : funcs;

        Reflect.defineMetadata("axr:route", route, target, propertyKey);
    };
}

/**
 * Applies PassportJS authentication to the decorated route or method for the provided strategy or list of strategies
 * should be attempted before processing the route.
 *
 * @param strategies The PassportJS strategies that will be applied when incoming requests are processed.
 * @param require Set to `true` to indicate that at least one of the specified authentication strategies must pass to
 *                proceed, otherwise set to `false`. Default is `true`.
 */
export function Auth(strategies: string | string[], require: boolean = true) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let route: any = Reflect.getMetadata("axr:route", target, propertyKey) || {};
        route.authStrategies = strategies;
        route.authRequired = require;
        Reflect.defineMetadata("axr:route", route, target, propertyKey);
    };
}

/**
 * Indicates a provided function or list of functions to execute *before* the decorated function.
 *
 * @param func The function or list of functions to execute *before* the decorated function.
 */
export function Before(func: Function | string | (Function | string)[]) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let route: any = Reflect.getMetadata("axr:route", target, propertyKey) || {};

        // Ensure we always have an array of functions. Also, append the new list of functions to any existing list.
        let funcs: (Function | string)[] = Array.isArray(func) ? func : [func];
        route.before = route.before ? route.before.concat(funcs) : funcs;

        Reflect.defineMetadata("axr:route", route, target, propertyKey);
    };
}

/**
 * Indicates that the decorated function will return content encoded with the specified content type.
 *
 * @param type The content type that the function will return.
 */
export function ContentType(type: string) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const route: any = Reflect.getMetadata("axr:route", target, propertyKey) || {};
        route.contentType = type;
        Reflect.defineMetadata("axr:route", route, target, propertyKey);
    };
}

/**
 * Indicates that the decorated function handles incoming `DELETE` requests at the given sub-path.
 *
 * @param path The sub-path that the route will handle requests for.
 */
export function Delete(path?: string) {
    return Method("delete", path);
}

/**
 * Indicates that the decorated function handles incoming `GET` requests at the given sub-path.
 *
 * @param path The sub-path that the route will handle requests for.
 */
export function Get(path?: string) {
    return Method("get", path);
}

/**
 * Indicates that the decorated function handles incoming `HEAD` requests at the given sub-path.
 *
 * @param path The sub-path that the route will handle requests for.
 */
export function Head(path?: string) {
    return Method("head", path);
}

/**
 * Injects the value of the specified request header with the given name as the value of the decorated argument.
 *
 * @param name The name of the header whose value will be injected.
 */
export function Header(name: string) {
    return function(target: any, propertyKey: string, index: number) {
        let args: any = Reflect.getMetadata("axr:args", target, propertyKey) || {};
        args[index] = ["header", name];
        Reflect.defineMetadata("axr:args", args, target, propertyKey);
    };
}

/**
 * Indicates that the decorated function should be called during the initialization phase of server startup.
 */
export function Init(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata("axr:initialize", true, target, propertyKey);
}

/**
 * Indicates that the decorated function handles incoming HTTP requests for the specified HTTP method(s) at the given sub-path.
 *
 * @param methods The HTTP method(s) to handle requests for.
 * @param path The sub-path that the route handles requests for.
 */
export function Method(method: string | string[], path?: string) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let route: any = Reflect.getMetadata("axr:route", target, propertyKey) || {};
        const pathFinal: string = path ? path : "";

        if (!route.methods) {
            route.methods = new Map();
        }

        let methods: string[] = Array.isArray(method) ? method : [method];
        for (let key of methods) {
            route.methods.set(key, pathFinal);
        }

        Reflect.defineMetadata("axr:route", route, target, propertyKey);
    };
}

/**
 * Indicates that the class utilizes is a manager for the specified class type.
 *
 * @param name The data model class type to associate the class with.
 */
export function Model(type: any) {
    return function<T extends { new (...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            /** The class type of the data model type associated with this class. */
            public static readonly modelClass: any = type;
        };
    };
}

/**
 * Indicates that the decorated function handles incoming `OPTIONS` requests at the given sub-path.
 *
 * @param path The sub-path that the route will handle requests for.
 */
export function Options(path?: string) {
    return Method("options", path);
}

/**
 * Indicates that the decorated function handles incoming `POST` requests at the given sub-path.
 *
 * @param path The sub-path that the route will handle requests for.
 */
export function Post(path?: string) {
    return Method("post", path);
}

/**
 * Injects the value of the specified URI parameter with the given name as the value of the decorated argument. If no
 * name is specified the entire request parameter will be injected.
 *
 * @param name The name of the URI parameter whose value will be injected.
 */
export function Param(name: string | undefined = undefined) {
    return function(target: any, propertyKey: string, index: number) {
        let args: any = Reflect.getMetadata("axr:args", target, propertyKey) || {};
        args[index] = ["param", name];
        Reflect.defineMetadata("axr:args", args, target, propertyKey);
    };
}

/**
 * Indicates that the decorated function handles incoming `PUT` requests at the given sub-path.
 *
 * @param path The sub-path that the route will handle requests for.
 */
export function Put(path?: string) {
    return Method("put", path);
}

/**
 * Injects the value of the specified query parameter with the given name as the value of the decorated argument. If
 * no name is specified the entire request query will be injected.
 *
 * @param name THe name of the query parameter whose value will be injected.
 */
export function Query(name: string | undefined = undefined) {
    return function(target: any, propertyKey: string, index: number) {
        let args: any = Reflect.getMetadata("axr:args", target, propertyKey) || {};
        args[index] = ["query", name];
        Reflect.defineMetadata("axr:args", args, target, propertyKey);
    };
}

/**
 * Apply this to a property to have the TypeORM `MongoRepository` for the given entity type injected at instantiation.
 *
 * @param {any} type The entity type whose repository will be injected.
 */
export function MongoRepository(type: any) {
    return function(target: any, propertyKey: string | symbol) {
        Reflect.defineMetadata("axr:injectMongoRepo", type, target, propertyKey);
        const key = `__${String(propertyKey)}`;
        Object.defineProperty(target, propertyKey, {
            enumerable: true,
            writable: true,
            value: undefined,
        });
    };
}

/**
 * Apply this to a property to have the TypeORM `Repository` for the given entity type injected at instantiation.
 *
 * @param {any} type The entity type whose repository will be injected.
 */
export function Repository(type: any) {
    return function(target: any, propertyKey: string | symbol) {
        Reflect.defineMetadata("axr:injectRepo", type, target, propertyKey);
        const key = `__${String(propertyKey)}`;
        Object.defineProperty(target, propertyKey, {
            enumerable: true,
            writable: true,
            value: undefined,
        });
    };
}

/**
 * Apply this to a property to have the `Redis` connection injected at instantiation.
 *
 * @param {string} name The name of the database connection to inject.
 */
export function RedisConnection(name: string) {
    return function(target: any, propertyKey: string | symbol) {
        Reflect.defineMetadata("axr:injectRedisRepo", name, target, propertyKey);
        const key = `__${String(propertyKey)}`;
        Object.defineProperty(target, propertyKey, {
            enumerable: true,
            writable: true,
            value: undefined,
        });
    };
}

/**
 * Injects the Express request object as the value of the decorated argument.
 */
export function Request(target: any, propertyKey: string, index: number) {
    let args: any = Reflect.getMetadata("axr:args", target, propertyKey) || {};
    args[index] = ["request"];
    Reflect.defineMetadata("axr:args", args, target, propertyKey);
}

/**
 * Injects the Express response object as the value of the decorated argument.
 */
export function Response(target: any, propertyKey: string, index: number) {
    let args: any = Reflect.getMetadata("axr:args", target, propertyKey) || {};
    args[index] = ["response"];
    Reflect.defineMetadata("axr:args", args, target, propertyKey);
}

/**
 * Indicates that the client must be an authenticated user with at least one of the specified role(s) to process the
 * request.
 *
 * @param roles The role(s) that an authenticated user must have to make the request.
 */
export function RequiresRole(roles: string | string[]) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let route: any = Reflect.getMetadata("axr:route", target, propertyKey) || {};
        route.requiredRoles = Array.isArray(roles) ? roles : [roles];
        Reflect.defineMetadata("axr:route", route, target, propertyKey);
    };
}

/**
 * Indicates that the decorated class contains Express route definitions.
 *
 * @param path The base path(s) that all route definitions will use.
 */
export function Route(paths: string | string[]) {
    return function(target: Function) {
        let routePaths: string[] = Reflect.getMetadata("axr:routePaths", target.prototype) || [];
        routePaths = routePaths.concat(Array.isArray(paths) ? paths : [paths]);
        Reflect.defineMetadata("axr:routePaths", routePaths, target.prototype);
    };
}

/**
 * Injects the authenticated user object as the value of the decorated argument.
 */
export function User(target: any, propertyKey: string, index: number) {
    let args: any = Reflect.getMetadata("axr:args", target, propertyKey) || {};
    args[index] = ["user"];
    Reflect.defineMetadata("axr:args", args, target, propertyKey);
}

/**
 * Indicates a validation function to execute in order to verify an incoming requests payload.
 *
 * @param func The validation function to execute that will verify the request payload.
 */
export function Validate(func: Function | string) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let route: any = Reflect.getMetadata("axr:route", target, propertyKey) || {};
        route.validator = func;
        Reflect.defineMetadata("axr:route", route, target, propertyKey);
    };
}
