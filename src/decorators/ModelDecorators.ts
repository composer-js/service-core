///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import "reflect-metadata";

/**
 * Indicates that the class is cacheable with the specified TTL.
 *
 * @param name The time, in seconds, that an object will be cached before being invalidated.
 */
export function Cache(ttl: number = 30) {
    return function(target: any) {
        Reflect.defineMetadata("axr:cacheTTL", ttl, target);
        Object.defineProperty(target, "cacheTTL", {
            enumerable: true,
            writable: true,
            value: ttl,
        });
    };
}

/**
 * Apply this to a property that is considered a unique identifier.
 */
export function Identifier(target: any, propertyKey: string | symbol) {
    Reflect.defineMetadata("axr:isIdentifier", true, target, propertyKey);
    const key = `__${String(propertyKey)}`;
    Object.defineProperty(target, propertyKey, {
        enumerable: true,
        writable: true,
        value: undefined,
    });
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
