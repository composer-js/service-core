///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import "reflect-metadata";

/**
 * Apply this to a property to have the global configuration object injected at instantiation.
 */
export function Config(target: any, propertyKey: string | symbol) {
    Reflect.defineMetadata("axr:injectConfig", true, target, propertyKey);
    const key = `__${String(propertyKey)}`;
    Object.defineProperty(target, propertyKey, {
        enumerable: true,
        writable: true,
        value: undefined,
    });
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
