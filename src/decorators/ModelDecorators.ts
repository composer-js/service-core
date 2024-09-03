///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import "reflect-metadata";

/**
 * Indicates that the class is cacheable with the specified TTL.
 *
 * @param ttl The time, in seconds, that an object will be cached before being invalidated.
 */
export function Cache(ttl: number = 30) {
    return function (target: any) {
        Reflect.defineMetadata("cjs:cacheTTL", ttl, target);
        Object.defineProperty(target, "cacheTTL", {
            enumerable: true,
            writable: true,
            value: ttl,
        });
    };
}

/**
 * Indicates that the class describes an entity that will be persisted in the datastore with the given name.
 *
 * @param datastore The name of the datastore to store records of the decorated class.
 */
export function DataStore(datastore: string) {
    return function (target: any) {
        Reflect.defineMetadata("cjs:datastore", datastore, target);
        Object.defineProperty(target, "datastore", {
            enumerable: true,
            writable: true,
            value: datastore,
        });
    };
}

/**
 * Apply this to a property that is considered a unique identifier.
 */
export function Identifier(target: any, propertyKey: string | symbol) {
    Reflect.defineMetadata("cjs:isIdentifier", true, target, propertyKey);
    const key = `__${String(propertyKey)}`;
    Object.defineProperty(target, propertyKey, {
        enumerable: true,
        writable: true,
        value: undefined,
    });
}

/**
 * Indicates that the class describes an entity that will be persisted in a sharded database collection.
 * 
 * Note: Only supported by MongoDB.
 *
 * @param config The sharding configuration to pass to the database server. Default value is `{ key: { uid: 1 }, unique: false, options: {} }`.
 */
export function Shard(config: any = { key: { uid: 1 }, unique: false, options: {} }) {
    return function (target: any) {
        Reflect.defineMetadata("cjs:shardConfig", config, target);
        Object.defineProperty(target, "shardConfig", {
            enumerable: true,
            writable: true,
            value: config,
        });
    };
}

/**
 * Indicates that the class will track changes for each document update limited to the specified number of versions.
 *
 * @param versions The number of versions that will be tracked for each document change. Set to `-1` to store all
 * versions. Default value is `-1`.
 */
export function TrackChanges(versions: number = -1) {
    return function (target: any) {
        Reflect.defineMetadata("cjs:trackChanges", versions, target);
        Object.defineProperty(target, "trackChanges", {
            enumerable: true,
            writable: true,
            value: versions,
        });
    };
}
