///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import "reflect-metadata";

/**
 * Apply this to a class function to mark it as a destructor to be called by the `ObjectFactory` during cleanup.
 */
export function Destroy(target: any, propertyKey: string) {
    Reflect.defineMetadata("axr:destructor", true, target, propertyKey);
}

/**
 * Injects an object instance to the decorated property of the given name and type using the provided arguments
 * if no object has been created yet.
 * @param type The name or type of the class instance to inject.
 * @param name The unique name of the object to inject. Set to `undefined` to force a new instance to be created. Default value is `default`.
 * @param args The constructor arguments to use if the object hasn't been created before.
 */
export function Inject(type: any, name: string | undefined = "default", ...args: any) {
    return function (target: any, propertyKey: string | symbol) {
        Reflect.defineMetadata("axr:injectObject", {
            args,
            name,
            type
        }, target, propertyKey);
        Object.defineProperty(target, propertyKey, {
            enumerable: true,
            writable: true,
            value: undefined,
        });
    };
}

/**
 * Apply this to a function to be executed once a new object instance has been created and all dependencies injected.
 * Note: If the decorated function returns a Promise it is not gauranteed to finish execution before the object is
 * returned during the instantiation process.
 */
export function Init(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata("axr:initialize", true, target, propertyKey);
}

/**
 * Apply this to a property to have a configuration variable be injected at instantiation. If no path is given, the
 * global configuration object is injected.
 *
 * @param path The path to the configuration variable to inject.
 * @param defaultValue Set to the desired default value. If `undefined` is specified then an error is thrown if
 *                      no config variable is found at the given path.
 */
export function Config(path?: string, defaultValue: any = undefined) {
    return function (target: any, propertyKey: string | symbol) {
        Reflect.defineMetadata("axr:injectConfig", path ? path : true, target, propertyKey);
        Reflect.defineMetadata("axr:injectConfigDefault", defaultValue, target, propertyKey);
        const key = `__${String(propertyKey)}`;
        Object.defineProperty(target, propertyKey, {
            enumerable: true,
            writable: true,
            value: undefined,
        });
    }
}

/**
 * Apply this to a function that will be called when events arrive for the specified type(s). If no event type is
 * specified, then the function will be called upon each event that arrives.
 *
 * @param type The name or list of names corresponding to events that the function will handle.
 */
export function OnEvent(type?: string | string[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata("axr:events", type ? type : ".*", target, propertyKey);
    };
}

/**
 * Apply this to a property to have the logger utility injected at instantiation.
 */
export function Logger(target: any, propertyKey: string | symbol) {
    Reflect.defineMetadata("axr:injectLogger", true, target, propertyKey);
    const key = `__${String(propertyKey)}`;
    Object.defineProperty(target, propertyKey, {
        enumerable: true,
        writable: true,
        value: undefined,
    });
}
