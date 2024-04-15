///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Repository, MongoRepository, AggregationCursor, EntityMetadata } from "typeorm";
import { ModelUtils } from "../models/ModelUtils";
import { RepoUtils } from "../models/RepoUtils";
import { BaseEntity } from "../models/BaseEntity";
import Redis from "ioredis";
import { RedisConnection } from "../decorators/DatabaseDecorators";
import * as crypto from "crypto";
import { Logger, Config, Init } from "../decorators/ObjectDecorators";
import { Request as XRequest, Response as XResponse } from "express";
import { SimpleEntity } from "../models/SimpleEntity";
import { BulkError } from "../BulkError";
import { RecoverableBaseEntity } from "../models";
import { Admin } from "mongodb";
import { ApiErrorMessages, ApiErrors } from "../ApiErrors";
import { ApiError } from "@composer-js/core";

/**
 * The set of options required by all request handlers.
 */
export interface RequestOptions {
    /** The originating client request. */
    req?: XRequest;
    /** The outgoing client response. */
    res?: XResponse;
    /** The authenticated user making the request. */
    user?: any;
}

/**
 * The set of options required by create request handlers.
 */
export interface CreateRequestOptions extends RequestOptions {
}

/**
 * The set of options required by delete request handlers.
 */
export interface DeleteRequestOptions extends RequestOptions {
    /** The desired product uid of the resource to delete. */
    productUid?: string;
    /** Set to true to permanently remove the object from the database (if applicable). */
    purge?: boolean;
    /** The desired version number of the resource to delete. */
    version?: number | string;
}

/**
 * The set of options required by search request handlers.
 */
export interface FindRequestOptions extends RequestOptions {
    /** The list of URL parameters to use in the search. */
    params?: any;
    /** The list of query parameters to use in the search. */
    query: any;
}

/**
 * The set of options required by truncate request handlers.
 */
 export interface TruncateRequestOptions extends DeleteRequestOptions {
    /** The list of URL parameters to use in the search. */
    params: any;
    /** The list of query parameters to use in the search. */
    query: any;
}

/**
 * The set of options required by update request handlers.
 */
 export interface UpdateRequestOptions extends RequestOptions {
    /** The desired product uid of the resource to update. */
    productUid?: string;
    /** The desired version number of the resource to update. */
    version?: number | string;
}

/**
 * The `ModelRoute` is an abstract base class that provides a set of built-in route behavior functions for handling
 * requests for a given data model that is managed by a persistent datastore.
 *
 * Provided behaviors:
 * * `count` - Counts the number of objects matching the provided set of criteria in the request's query parameters.
 * * `create` - Adds a new object to the datastore.
 * * `delete` - Removes an existing object from the datastore.
 * * `find` - Finds all objects matching the provided set of criteria in the request's query parameters.
 * * `findById` - Finds a single object with a specified unique identifier.
 * * `truncate` - Removes all objects from the datastore.
 * * `update` - Modifies an existing object in the datastore.
 *
 * @author Jean-Philippe Steinmetz
 */
export abstract class ModelRoute<T extends BaseEntity | SimpleEntity> {
    /** The redis client that will be used as a 2nd level cache for all cacheable models. */
    @RedisConnection("cache")
    protected cacheClient?: Redis;

    /** The time, in milliseconds, that objects will be cached before being invalidated. */
    protected cacheTTL?: number;

    /** The global application configuration. */
    @Config()
    protected config?: any;

    /** The unique identifier of the default ACL for the model type. */
    protected defaultACLUid: string = "";

    @Logger
    protected logger: any;

    /** The model class associated with the controller to perform operations against. */
    protected abstract repo?: Repository<T> | MongoRepository<T>;

    /**
     * The number of previous document versions to store in the database. A negative value indicates storing all
     * versions, a value of `0` stores no versions.
     */
    protected trackChanges: number = 0;

    /**
     * Initializes a new instance using any defaults.
     */
    protected constructor() { 
        // no-op 
    }

    /**
     * The base key used to get or set data in the cache.
     */
    protected get baseCacheKey(): string {
        const clazz: any = Object.getPrototypeOf(this).constructor;
        return "db.cache." + clazz.modelClass.name;
    }

    /**
     * The class type of the model this route is associated with.
     */
    protected get modelClass(): any {
        const clazz: any = Object.getPrototypeOf(this).constructor;
        return clazz.modelClass;
    }

    /**
     * Hashes the given query object to a unique string.
     * @param query The query object to hash.
     */
    protected hashQuery(query: any): string {
        const queryStr: string = JSON.stringify(query);
        return crypto
            .createHash("sha512")
            .update(queryStr)
            .digest("hex");
    }

    /**
     * Called on server startup to initialize the route with any defaults.
     */
    @Init
    private async superInitialize() {
        // Pull the cache and version configuration from the model class where applicable 
        if (this.modelClass) {
            this.cacheTTL = this.modelClass.cacheTTL || this.cacheTTL;
            this.trackChanges = this.modelClass.trackChanges || this.trackChanges;
        }

        // Does the model specify a MongoDB shard configuration?
        const shardConfig: any = Reflect.getMetadata("axr:shardConfig", this.modelClass);
        if (shardConfig && this.repo instanceof MongoRepository) {
            const dbClient: any = this.repo.manager.mongoQueryRunner.databaseConnection;
            if (dbClient) {
                try {
                    const admin: Admin = dbClient.db().admin() as Admin;
                    if (admin) {
                        // Find the EntityMetadata associated with this model class.
                        let metadata: EntityMetadata | undefined = undefined;
                        for (const md of this.repo.manager.connection.entityMetadatas) {
                            if (md.target === this.modelClass) {
                                metadata = md;
                                break;
                            }
                        }

                        if (metadata) {
                            try {
                                // Configure the sharded collection with the MongoDB server.
                                const dbName: string = this.config.get(`datastores:${this.modelClass.datastore}:database`);
                                this.logger.info(`Configuring sharding for: collection=${dbName}.${metadata.tableName}, key=${JSON.stringify(shardConfig.key)}, unique=${shardConfig.unique}, options=${JSON.stringify(shardConfig.options)})`);
                                const result: any = await admin.command({
                                    shardCollection: `${dbName}.${metadata.tableName}`,
                                    key: shardConfig.key,
                                    unique: shardConfig.unique,
                                    ...shardConfig.options
                                });
                                this.logger.debug(`Result: ${JSON.stringify(result)}`);
                            } catch (e: any) {
                                this.logger.warn(`There was a problem trying to configure MongoDB sharding for collection '${metadata.tableName}'. Error=${e.message}`);
                            }
                        }
                    } else {
                        this.logger.debug("Failed to get mongodb admin interface.");
                    }
                } catch (e: any) {
                    // Sharding is not supported or user doesnt' have permission
                    this.logger.debug(`Sharding not supported or user lacks the clusterAdmin role. Error=${e.message}`);
                }
            }
        }
    }

    /**
     * Retrieves the object with the given id from either the cache or the database. If retrieving from the database
     * the cache is populated to speed up subsequent requests.
     *
     * @param id The unique identifier of the object to retrieve.
     * @param version The desired version number of the object to retrieve. If `undefined` returns the latest.
     * @param productUid The optional productUid associated with the object.
     */
    protected async getObj(id: string, version?: number | string, productUid?: string): Promise<T | null> {
        if (!this.repo) {
            throw new ApiError(ApiErrors.INTERNAL_ERROR, 500, ApiErrorMessages.INTERNAL_ERROR);
        }

        const query: any = this.searchIdQuery(id, version, productUid);
        if (this.cacheClient && this.cacheTTL) {
            // First attempt to retrieve the object from the cache
            const json: string | null = await this.cacheClient.get(`${this.baseCacheKey}.${this.hashQuery(query)}`);
            if (json) {
                try {
                    const existing: T | null = JSON.parse(json);
                    if (existing) {
                        return existing;
                    }
                } catch (err) {
                    // It doesn't matter if this fails
                }
            }
        }

        let existing: T | null = null;
        if (this.repo instanceof MongoRepository) {
            existing = await this.repo.aggregate(
                [
                    {
                        $match: query,
                    },
                    {
                        $sort: { version: -1 }
                    }
                ]
            ).limit(1).next();
        } else {
            existing = await this.repo.findOne(query);
        }

        if (existing && this.cacheClient && this.cacheTTL) {
            // Cache the object for faster retrieval
            void this.cacheClient.setex(
                `${this.baseCacheKey}.${this.hashQuery(query)}`,
                this.cacheTTL,
                JSON.stringify(existing)
            );
        }

        // Make sure we return the correct data type
        return existing ? new this.modelClass(existing) : null;
    }

    /**
     * Search for existing object based on passed in id and version and product uid.
     * 
     * The result of this function is compatible with all `Repository.find()` functions.
     */
    private searchIdQuery(id: string, version?: number | string, productUid?: string): any {
        return ModelUtils.buildIdSearchQuery(this.repo, this.modelClass, id, typeof version === "string" ? parseInt(version, 10) : version, productUid);
    }

    /**
     * Attempts to retrieve the number of data model objects matching the given set of criteria as specified in the
     * request `query`. Any results that have been found are set to the `content-length` header of the `res` argument.
     * 
     * @param options The options to process the request using.
     */
    protected async doCount(options: FindRequestOptions): Promise<XResponse> {
        if (!this.repo) {
            throw new ApiError(ApiErrors.INTERNAL_ERROR, 500, ApiErrorMessages.INTERNAL_ERROR);
        }

        if (!options.res) {
            throw new ApiError(ApiErrors.INTERNAL_ERROR, 500, ApiErrorMessages.INTERNAL_ERROR);
        }

        const searchQuery: any = ModelUtils.buildSearchQuery(this.modelClass, this.repo, options.params, options.query, true, options.user);
        if (this.repo instanceof MongoRepository && Array.isArray(searchQuery)) {
            searchQuery.push({ $count: "count" });
            const result: any = await (this.repo).aggregate(searchQuery).next();
            options.res.setHeader('content-length', result ? result.count : 0);
        } else {
            const result: number = await this.repo.count(searchQuery);
            options.res.setHeader('content-length', result);
        }

        return options.res.status(200);
    }

    /**
     * Attempts to store an object provided in `options.req.body` into the datastore. Upon success, sets the newly persisted
     * object(s) to the `result` property of the `options.res` argument, otherwise sends a `400 BAD REQUEST` response to the
     * client.
     *
     * @param objs The object to store in the database.
     * @param options The options to process the request using.
     */
    protected async doCreateObject(obj: T, options: CreateRequestOptions): Promise<T> {
        if (!this.repo) {
            throw new ApiError(ApiErrors.INTERNAL_ERROR, 500, ApiErrorMessages.INTERNAL_ERROR);
        }

        // Make sure the provided object has the correct typing
        obj = new this.modelClass(obj);

        obj = await RepoUtils.preprocessBeforeSave(this.repo, obj, this.trackChanges !== 0);

        // Are we tracking multiple versions for this object?
        if (obj instanceof BaseEntity && this.trackChanges === 0) {
            (obj as any).version = 0;
        }

        // HAX We shouldn't be casting obj to any here but this is the only way to get it to compile since T
        // extends BaseEntity.
        const result: T = new this.modelClass(await this.repo.save(obj as any));

        if (this.cacheClient && this.cacheTTL) {
            // Cache the object for faster retrieval
            const query: any = this.searchIdQuery(obj.uid);
            const cacheKey: string = `${this.baseCacheKey}.${this.hashQuery(query)}`;
            void this.cacheClient.setex(cacheKey, this.cacheTTL, JSON.stringify(result));
        }

        return result;
    }

    /**
     * Attempts to store a collection of objects provided in `options.req.body` into the datastore. Upon success, sets the newly persisted
     * object(s) to the `result` property of the `options.res` argument, otherwise sends a `400 BAD REQUEST` response to the
     * client.
     *
     * @param objs The object(s) to store in the database.
     * @param options The options to process the request using.
     */
    protected async doBulkCreate(objs: T[], options: CreateRequestOptions): Promise<T[]> {
        let thrownError: boolean = false;
        const errors: (Error | null)[] = [];
        const results: T[] = [];

        for (const obj of objs) {
            try {
                results.push(await this.doCreateObject(obj, options));
                errors.push(null);
            } catch (err: any) {
                errors.push(err);
                thrownError = true;
            }
        }

        if (thrownError) {
            throw new BulkError(errors, ApiErrors.BULK_UPDATE_FAILURE, (errors[0] as any)?.status || 400, ApiErrorMessages.BULK_UPDATE_FAILURE);
        }

        return results;
    }

    /**
     * Attempts to store one or more objects provided in `options.req.body` into the datastore. Upon success, sets the newly persisted
     * object(s) to the `result` property of the `options.res` argument, otherwise sends a `400 BAD REQUEST` response to the
     * client.
     *
     * @param objs The object(s) to store in the database.
     * @param options The options to process the request using.
     */
    protected async doCreate(obj: T | T[], options: CreateRequestOptions): Promise<T | T[]> {
        if (Array.isArray(obj)) {
            return await this.doBulkCreate(obj, options);
        } else {
            return await this.doCreateObject(obj, options);
        }
    }

    /**
     * Attempts to delete an existing data model object with a given unique identifier encoded by the URI parameter
     * `id`.
     *
     * @param id The unique identifier of the object to delete.
     * @param options The options to process the request using.
     */
    protected async doDelete(id: string, options: DeleteRequestOptions): Promise<void> {
        if (!this.repo) {
            throw new ApiError(ApiErrors.INTERNAL_ERROR, 500, ApiErrorMessages.INTERNAL_ERROR);
        }

        // When id === `me` this is a special keyword meaning the authenticated user
        if (id.toLowerCase() === "me") {
            if (options.user) {
                id = options.user.uid;
            } else {
                throw new ApiError(ApiErrors.SEARCH_INVALID_ME_REFERENCE, 403, ApiErrorMessages.SEARCH_INVALID_ME_REFERENCE);
            }
        }

        const query: any = this.searchIdQuery(id, options.version);
        const objs: T[] | undefined = await this.repo.find(query);
        const uid: string | undefined = objs && objs.length > 0 ? objs[0].uid : undefined;
        const isRecoverable: boolean = (new this.modelClass()) instanceof RecoverableBaseEntity;
        const isPurge: boolean = isRecoverable ? (options.purge || false) : true;

        if (uid && objs) {
            // If the object(s) are being permenantly removed from the database do so and then clear the accompanying
            // ACL(s). If the class type is recoverable and purge isn't desired, simply mark the object(s) as deleted.
            if (isPurge) {
                await this.repo.remove(objs);
            } else {
                if (this.repo instanceof MongoRepository) {
                    await this.repo.updateMany(query, {
                        $set: {
                            deleted: true
                        }
                    });
                } else {
                    await this.repo.update(query, {
                        deleted: true
                    } as any);
                }
            }

            if (this.cacheClient && this.cacheTTL) {
                // Delete the object from cache
                void this.cacheClient.del(`${this.baseCacheKey}.${this.hashQuery(query)}`);
                void this.cacheClient.del(`${this.baseCacheKey}.${this.hashQuery(this.searchIdQuery(uid))}`);
            }
        }
    }

    /**
     * Attempts to determine if an existing object with the given unique identifier exists.
     * 
     * @param id The unique identifier of the object to verify exists.
     * @param options The options to process the request using.
     */
    protected async doExists(id: string, options: FindRequestOptions): Promise<any> {
        if (!this.repo) {
            throw new ApiError(ApiErrors.INTERNAL_ERROR, 500, ApiErrorMessages.INTERNAL_ERROR);
        }
        if (!options.res) {
            throw new ApiError(ApiErrors.INTERNAL_ERROR, 500, ApiErrorMessages.INTERNAL_ERROR);
        }

        // When id === `me` this is a special keyword meaning the authenticated user
        if (id.toLowerCase() === "me") {
            if (options.user) {
                id = options.user.uid;
            } else {
                throw new ApiError(ApiErrors.SEARCH_INVALID_ME_REFERENCE, 403, ApiErrorMessages.SEARCH_INVALID_ME_REFERENCE);
            }
        }

        const query: any = this.searchIdQuery(id, options.query.version);
        const result: number = await this.repo.count(query);
        if (result > 0) {
            return options.res.status(200).setHeader('content-length', result);
        } else {
            return options.res.status(404);
        }
    }

    /**
     * Attempts to retrieve all data model objects matching the given set of criteria as specified in the request
     * `query`. Any results that have been found are set to the `result` property of the `res` argument. `result` is
     * never null.
     * 
     * @param options The options to process the request using.
     */
    protected async doFindAll(options: FindRequestOptions): Promise<T[]> {
        let results: T[] = [];

        if (!this.repo) {
            throw new ApiError(ApiErrors.INTERNAL_ERROR, 500, ApiErrorMessages.INTERNAL_ERROR);
        }

        const searchQuery: any = ModelUtils.buildSearchQuery(this.modelClass, this.repo, options.params, options.query, true, options.user);
        const limit: number = options.query.limit ? Math.min(options.query.limit, 1000) : 100;
        const page: number = options.query.page ? Number(options.query.page) : 0;

        // When we hash the seach query we need to ensure we're including the pagination information to preserve
        // like queries and results.
        const searchQueryHash: string = this.hashQuery({
            ...searchQuery,
            limit,
            page
        });

        // Pull from the cache if available
        if (this.cacheClient && this.cacheTTL) {
            const json: string | null = await this.cacheClient.get(
                `${this.baseCacheKey}.${searchQueryHash}`
            );
            if (json) {
                try {
                    const uids: string[] = JSON.parse(json);
                    for (const uid of uids) {
                        // Retrieve the object from the cache or from database if not available
                        const obj: T | null = await this.getObj(uid, options.query.version, options.query.productUid);
                        if (obj) {
                            results.push(obj);
                        }
                    }
                } catch (err) {
                    // It doesn't matter if this fails
                }
            }
        }

        // If the query wasn't cached retrieve from the database
        if (results.length === 0) {
            if (this.repo instanceof MongoRepository && Array.isArray(searchQuery)) {
                const skip: number = page * limit;
                results = await this.repo.aggregate(searchQuery).skip(skip).limit(limit).toArray();
            }
            else {
                results = await this.repo.find(searchQuery);
            }

            // Cache the results for future requests
            if (this.cacheClient && this.cacheTTL) {
                const uids: string[] = [];

                for (const result of results) {
                    uids.push(result.uid);
                }

                void this.cacheClient.setex(
                    `${this.baseCacheKey}.${searchQueryHash}`,
                    this.cacheTTL,
                    JSON.stringify(uids)
                );
            }
        }

        return results;
    }

    /**
     * Attempts to retrieve a single data model object as identified by the `id` parameter in the URI.
     * 
     * @param options The options to process the request using.
     */
    protected async doFindById(id: string, options: FindRequestOptions): Promise<T | null> {
        if (!this.repo) {
            throw new ApiError(ApiErrors.INTERNAL_ERROR, 500, ApiErrorMessages.INTERNAL_ERROR);
        }

        // When id === `me` this is a special keyword meaning the authenticated user
        if (id.toLowerCase() === "me") {
            if (options.user) {
                id = options.user.uid;
            } else {
                throw new ApiError(ApiErrors.SEARCH_INVALID_ME_REFERENCE, 403, ApiErrorMessages.SEARCH_INVALID_ME_REFERENCE);
            }
        }

        const result: T | null = await this.getObj(id, options.query.version, options.query.productUid);
        if (!result) {
            throw new ApiError(ApiErrors.NOT_FOUND, 404, ApiErrorMessages.NOT_FOUND);
        }

        return result;
    }

    /**
     * Attempts to remove all entries of the data model type from the datastore matching the given
     * parameters and query.
     *
     * @param options The options to process the request using.
     */
    protected async doTruncate(options: TruncateRequestOptions): Promise<void> {
        if (!this.repo) {
            throw new ApiError(ApiErrors.INTERNAL_ERROR, 500, ApiErrorMessages.INTERNAL_ERROR);
        }

        try {
            const searchQuery: any = ModelUtils.buildSearchQuery(this.modelClass, this.repo, options.params, options.query, true, options.user);
            let objs: T[] | undefined = undefined;
            if (this.repo instanceof MongoRepository && Array.isArray(searchQuery)) {
                const limit: number = options.query.limit ? Math.min(options.query.limit, 1000) : 100;
                const page: number = options.query.page ? options.query.page : 0;
                const skip: number = page * limit;
                objs = await this.repo.aggregate(searchQuery).skip(skip).limit(limit).toArray();
            }
            else {
                objs = await this.repo.find(searchQuery);
            }

            if (objs) {
                for (const obj of objs) {
                    await this.repo.remove(obj);
                }
            }
        } catch (err: any) {
            // The error "ns not found" occurs when the collection doesn't exist yet. We can ignore this error.
            if (err.message !== "ns not found") {
                throw err;
            }
        }
    }

    /**
     * Attempts to modify a collection of existing data model objects.
     *
     * @param recordEvent Set to `true` to record a telemetry event for this operation, otherwise set to `false`. Default is `true`.
     * @param options The options to process the request using.
     */
    protected async doBulkUpdate(objs: T[], options: UpdateRequestOptions): Promise<T[]> {
        let thrownError: boolean = false;
        const errors: (Error | null)[] = [];
        const result: T[] = [];

        for (const obj of objs) {
            try {
                result.push(await this.doUpdate(obj.uid, obj, options));
                errors.push(null);
            } catch (err: any) {
                errors.push(err);
                thrownError = true;
            }
        }

        if (thrownError) {
            throw new BulkError(errors, ApiErrors.BULK_UPDATE_FAILURE, (errors[0] as any)?.status || 400, ApiErrorMessages.BULK_UPDATE_FAILURE);
        }

        return result;
    }

    /**
     * Attempts to modify an existing data model object as identified by the `id` parameter in the URI.
     *
     * @param recordEvent Set to `true` to record a telemetry event for this operation, otherwise set to `false`. Default is `true`.
     * @param options The options to process the request using.
     */
    protected async doUpdate(id: string, obj: T, options: UpdateRequestOptions): Promise<T> {
        if (!this.repo) {
            throw new ApiError(ApiErrors.INTERNAL_ERROR, 500, ApiErrorMessages.INTERNAL_ERROR);
        }

        // When id === `me` this is a special keyword meaning the authenticated user
        if (id.toLowerCase() === "me") {
            if (options.user) {
                id = options.user.uid;
            } else {
                throw new ApiError(ApiErrors.SEARCH_INVALID_ME_REFERENCE, 403, ApiErrorMessages.SEARCH_INVALID_ME_REFERENCE);
            }
        }

        let query: any = this.searchIdQuery(id, options.version || (obj as any).version, options.productUid || (obj as any).productUid);
        const existing: T | null = await this.repo.findOne(query);
        obj = await RepoUtils.preprocessBeforeUpdate(this.repo, this.modelClass, obj, existing);

        const keepPrevious: boolean = this.trackChanges !== 0;
        const testObj: T = new this.modelClass();

        if (this.repo instanceof MongoRepository) {
            if (testObj instanceof BaseEntity) {
                if (keepPrevious) {
                    obj = new this.modelClass(await this.repo.save({
                        ...obj,
                        _id: undefined, // Ensure we save a new document
                        dateModified: new Date(),
                        version: (obj as BaseEntity).version + 1,
                    } as any));
                } else {
                    await this.repo.updateOne(
                        { uid: obj.uid, version: (obj as BaseEntity).version },
                        {
                            $set: {
                                ...obj,
                                dateModified: new Date(),
                                version: (obj as BaseEntity).version + 1,
                            },
                        }
                    );
                }
            } else if (obj.uid) {
                if (keepPrevious) {
                    obj = new this.modelClass(await this.repo.save({
                        ...obj,
                        version: (obj as any).version + 1,
                    } as any));
                } else {
                    await this.repo.updateOne(
                        { uid: obj.uid },
                        {
                            $set: {
                                ...obj,
                            },
                        }
                    );
                }
            } else {
                const toSave: any = obj as any;
                if (keepPrevious) {
                    toSave.version += 1;
                }

                const result: T | undefined = await this.repo.save(toSave);
                if (result) {
                    obj = new this.modelClass(result);
                }
            }
        } else {
            if (testObj instanceof BaseEntity) {
                if (keepPrevious) {
                    await this.repo.insert({
                        ...obj,
                        dateModified: new Date(),
                        version: (obj as BaseEntity).version + 1,
                    } as any);
                } else {
                    await this.repo.update(query.where, {
                        ...obj,
                        dateModified: new Date(),
                        version: (obj as BaseEntity).version + 1,
                    } as any);
                }
            } else {
                const toSave: any = obj as any;

                if (keepPrevious) {
                    toSave.version += 1;
                    await this.repo.save(toSave);
                } else {
                    await this.repo.update(query.where, toSave);
                }
            }
        }

        query = this.searchIdQuery(obj.uid, obj instanceof BaseEntity ? obj.version + 1 : undefined);
        const result: T | null = await this.repo.findOne(query);
        if (result) {
            obj = new this.modelClass(result);
        }

        if (obj && this.cacheClient && this.cacheTTL) {
            // Cache the object for faster retrieval
            void this.cacheClient.setex(`${this.baseCacheKey}.${this.hashQuery(query)}`, this.cacheTTL, JSON.stringify(obj));
            void this.cacheClient.setex(
                `${this.baseCacheKey}.${this.hashQuery(this.searchIdQuery(obj.uid))}`,
                this.cacheTTL,
                JSON.stringify(obj)
            );
        }

        return obj;
    }

    /**
     * Attempts to modify a single property of an existing data model object as identified by the `id` parameter in the URI.
     *
     * Note that this effectively bypasses optimistic locking and can cause unexpected data overwrites. Use with care.
     * 
     * @param id The unique identifier of the object to update.
     * @param propertyName The name of the property to update.
     * @param value The value of the property to set.
     * @param options The options to process the request using.
     */
    protected async doUpdateProperty(id: string, propertyName: string, value: any, options: UpdateRequestOptions): Promise<T> {
        const existing: any = await this.getObj(id);
        if (!existing) {
            throw new ApiError(ApiErrors.NOT_FOUND, 404, ApiErrorMessages.NOT_FOUND);
        }

        return await this.doUpdate(id, {
            uid: existing.uid,
            productUid: options.productUid || existing.productUid,
            version: options.version || existing.version,
            [propertyName]: value
        } as any, options);
    }
}
