///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Repository, MongoRepository, AggregationCursorResult } from "typeorm";
import { ModelUtils } from "../models/ModelUtils";
import { RepoUtils } from "../models/RepoUtils";
import { BaseEntity } from "../models/BaseEntity";
import { Redis } from "ioredis";
import { Init, RedisConnection } from "../decorators/RouteDecorators";
import * as crypto from "crypto";
import { Logger, Config, Inject } from "../decorators/ObjectDecorators";
import { Response as XResponse } from "express";
import { SimpleEntity } from "../models/SimpleEntity";
import { NetUtils } from "../NetUtils";

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
    protected constructor() {}

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
     * Retrieves the object with the given id from either the cache or the database. If retrieving from the database
     * the cache is populated to speed up subsequent requests.
     *
     * @param id The unique identifier of the object to retrieve.
     * @param version The desired version number of the object to retrieve. If `undefined` returns the latest.
     */
    protected async getObj(id: string, version?: number): Promise<T | undefined> {
        if (!this.repo) {
            throw new Error("Repository not set or could not be found.");
        }

        const query: any = this.searchIdQuery(id, version);
        if (this.cacheClient && this.cacheTTL) {
            // First attempt to retrieve the object from the cache
            const json: string | null = await this.cacheClient.get(`${this.baseCacheKey}.${this.hashQuery(query)}`);
            if (json) {
                try {
                    const existing: T | undefined = JSON.parse(json);
                    if (existing) {
                        return existing;
                    }
                } catch (err) {
                    // It doesn't matter if this fails
                }
            }
        }

        let existing: T | undefined = undefined;
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
            this.cacheClient.setex(
                `${this.baseCacheKey}.${this.hashQuery(query)}`,
                this.cacheTTL,
                JSON.stringify(existing)
            );
        }

        // Make sure we return the correct data type
        return existing ? new this.modelClass(existing) : undefined;
    }

    /**
     * Search for existing object based on passed in id and version and product uid.
     */
    private searchIdQuery(id: string, version?: number): any {
        return ModelUtils.buildIdSearchQuery(this.repo, this.modelClass, id, version);
    }

    /**
     * Attempts to retrieve the number of data model objects matching the given set of criteria as specified in the
     * request `query`. Any results that have been found are set to the `content-length` header of the `res` argument.
     */
    protected async doCount(params: any, query: any, res: XResponse, user?: any): Promise<XResponse> {
        if (!this.repo) {
            throw new Error("Repository not set or could not be found.");
        }

        const searchQuery: any = ModelUtils.buildSearchQuery(this.modelClass, this.repo, params, query, true, user);
        if (this.repo instanceof MongoRepository && Array.isArray(searchQuery)) {
            searchQuery.push({ $count: "count" });
            const result: AggregationCursorResult = await (this.repo as MongoRepository<T>).aggregate(searchQuery).next();
            res.setHeader('content-length', result ? result.count : 0);
        } else {
            const result: number = await this.repo.count(searchQuery);
            res.setHeader('content-length', result);
        }

        return res.status(200);
    }

    /**
     * Attempts to store the object provided in `req.body` into the datastore. Upon success, sets the newly persisted
     * object to the `result` property of the `res` argument, otherwise sends a `400 BAD REQUEST` response to the
     * client.
     * 
     * @param obj The object to store in the database.
     * @param user The authenticated user performing the action.
     */
    protected async doCreate(obj: T, user?: any): Promise<T> {
        if (!this.repo) {
            throw new Error("Repository not set or could not be found.");
        }

        // Make sure the provided object has the correct typing
        obj = new this.modelClass(obj);

        obj = await RepoUtils.preprocessBeforeSave(this.repo, obj);

        // Are we tracking multiple versions for this object?
        if (obj instanceof BaseEntity || this.trackChanges != 0) {
            (obj as any).version = 0;
        }

        // HAX We shouldn't be casting obj to any here but this is the only way to get it to compile since T
        // extends BaseEntity.
        const result: T = new this.modelClass(await this.repo.save(obj as any));

        if (this.cacheClient && this.cacheTTL) {
            // Cache the object for faster retrieval
            const query: any = this.searchIdQuery(obj.uid);
            const cacheKey: string = `${this.baseCacheKey}.${this.hashQuery(query)}`;
            this.cacheClient.setex(cacheKey, this.cacheTTL, JSON.stringify(result));
        }

        return result;
    }

    /**
     * Attempts to delete an existing data model object with a given unique identifier encoded by the URI parameter
     * `id`.
     * 
     * @param id The unique identifier of the object to delete.
     * @param user The authenticated user performing the action.
     */
    protected async doDelete(id: string, user?: any): Promise<void> {
        if (!this.repo) {
            throw new Error("Repository not set or could not be found.");
        }

        // When id === `me` this is a special keyword meaning the authenticated user
        if (id.toLowerCase() === "me") {
            if (user) {
                id = user.uid;
            } else {
                const error: any = new Error("Cannot use `me` reference for an unauthorized user.");
                error.status = 403;
                throw error;
            }
        }

        const query: any = this.searchIdQuery(id);
        const objs: T[] | undefined = await this.repo.find(query);
        const uid: string | undefined = objs && objs.length > 0 ? objs[0].uid : undefined;

        if (uid && objs) {
            await this.repo.remove(objs);

            if (this.cacheClient && this.cacheTTL) {
                // Delete the object from cache
                this.cacheClient.del(`${this.baseCacheKey}.${this.hashQuery(query)}`);
                this.cacheClient.del(`${this.baseCacheKey}.${this.hashQuery(this.searchIdQuery(uid))}`);
            }
        }
    }

    /**
     * Attempts to delete an existing data model object with a given unique identifier encoded by the URI parameter
     * `id` for a specified `version`.
     */
    protected async doDeleteVersion(id: string, version: number, user?: any): Promise<void> {
        if (!this.repo) {
            throw new Error("Repository not set or could not be found.");
        }

        // When id === `me` this is a special keyword meaning the authenticated user
        if (id.toLowerCase() === "me") {
            if (user) {
                id = user.uid;
            } else {
                const error: any = new Error("Cannot use `me` reference for an unauthorized user.");
                error.status = 403;
                throw error;
            }
        }

        const query: any = this.searchIdQuery(id, version);
        const objs: T[] | undefined = await this.repo.find(query);
        const uid: string | undefined = objs && objs.length > 0 ? objs[0].uid : undefined;

        if (uid && objs) {
            await this.repo.remove(objs);

            if (this.cacheClient && this.cacheTTL) {
                // Delete the object from cache
                this.cacheClient.del(`${this.baseCacheKey}.${this.hashQuery(query)}`);
                this.cacheClient.del(`${this.baseCacheKey}.${this.hashQuery(this.searchIdQuery(uid))}`);
            }
        }
    }

    /**
     * Attempts to determine if an existing object with the given unique identifier exists.
     */
    protected async doExists(id: string, res: XResponse, user?: any): Promise<any> {
        if (!this.repo) {
            throw new Error("Repository not set or could not be found.");
        }

        // When id === `me` this is a special keyword meaning the authenticated user
        if (id.toLowerCase() === "me") {
            if (user) {
                id = user.uid;
            } else {
                const error: any = new Error("Cannot use `me` reference for an unauthorized user.");
                error.status = 403;
                throw error;
            }
        }

        const query: any = this.searchIdQuery(id);
        const result: number = await this.repo.count(query);
        if (result > 0) {
            return res.status(200).setHeader('content-length', result);
        } else {
            return res.status(404);
        }
    }

    /**
     * Attempts to retrieve all data model objects matching the given set of criteria as specified in the request
     * `query`. Any results that have been found are set to the `result` property of the `res` argument. `result` is
     * never null.
     */
    protected async doFindAll(params: any, query: any, user?: any): Promise<T[]> {
        let results: T[] = [];

        if (!this.repo) {
            throw new Error("Repository not set or could not be found.");
        }

        const searchQuery: any = ModelUtils.buildSearchQuery(this.modelClass, this.repo, params, query, true, user);
        const limit: number = query.limit ? Math.min(query.limit, 1000) : 100;
        const page: number = query.page ? Number(query.page) : 0;

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
                        const obj: T | undefined = await this.getObj(uid);
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

                this.cacheClient.setex(
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
     */
    protected async doFindById(id: string, user?: any): Promise<T | undefined> {
        if (!this.repo) {
            throw new Error("Repository not set or could not be found.");
        }

        // When id === `me` this is a special keyword meaning the authenticated user
        if (id.toLowerCase() === "me") {
            if (user) {
                id = user.uid;
            } else {
                const error: any = new Error("Cannot use `me` reference for an unauthorized user.");
                error.status = 403;
                throw error;
            }
        }

        const result: T | undefined = await this.getObj(id);
        if (!result) {
            const error: any = new Error("No object with that id could be found.");
            error.status = 404;
            throw error;
        }

        return result;
    }

    /**
     * Attempts to retrieve a single data model object as identified by the `id` and `version` parameters in the URI.
     */
    protected async doFindByIdAndVersion(id: string, version: number, user?: any): Promise<T | undefined> {
        if (!this.repo) {
            throw new Error("Repository not set or could not be found.");
        }

        // When id === `me` this is a special keyword meaning the authenticated user
        if (id.toLowerCase() === "me") {
            if (user) {
                id = user.uid;
            } else {
                const error: any = new Error("Cannot use `me` reference for an unauthorized user.");
                error.status = 403;
                throw error;
            }
        }

        const result: T | undefined = await this.getObj(id, version);
        if (!result) {
            const error: any = new Error("No object with that id could be found.");
            error.status = 404;
            throw error;
        }

        return result;
    }

    /**
     * Attempts to remove all entries of the data model type from the datastore matching the given
     * parameters and query.
     *
     * @param params The parameters to match.
     * @param query The query parameters to match.
     * @param user The authenticated user performing the action, otherwise undefined.
     */
    protected async doTruncate(params?: any, query?: any, user?: any): Promise<void> {
        if (!this.repo) {
            throw new Error("Repository not set or could not be found.");
        }

        try {
            const searchQuery: any = ModelUtils.buildSearchQuery(this.modelClass, this.repo, params, query, true, user);
            let objs: T[] | undefined = undefined;
            if (this.repo instanceof MongoRepository && Array.isArray(searchQuery)) {
                const limit: number = query.limit ? Math.min(query.limit, 1000) : 100;
                const page: number = query.page ? query.page : 0;
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
            if (err.message != "ns not found") {
                throw err;
            }
        }
    }

    /**
     * Attempts to modify an existing data model object as identified by the `id` parameter in the URI.
     *
     * @param req The HTTP request that contains a body and `params.id` parameter with the unique identifier to modify.
     * @param res The HTTP response whose `result` property will be set to the newly updated object upon success.
     * @param next The next function to execute after this one.
     */
    protected async doUpdate(id: string, obj: T, user?: any): Promise<T> {
        if (!this.repo) {
            throw new Error("Repository not set or could not be found.");
        }
        
        // When id === `me` this is a special keyword meaning the authenticated user
        if (id.toLowerCase() === "me") {
            if (user) {
                id = user.uid;
            } else {
                const error: any = new Error("Cannot use `me` reference for an unauthorized user.");
                error.status = 403;
                throw error;
            }
        }

        let query: any = this.searchIdQuery(obj.uid);
        obj = await RepoUtils.preprocessBeforeUpdate(this.repo, this.modelClass, obj);

        const keepPrevious: boolean = this.trackChanges != 0;
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
        const result: T | undefined = await this.repo.findOne(query);
        if (result) {
            obj = new this.modelClass(result);
        }

        if (obj && this.cacheClient && this.cacheTTL) {
            // Cache the object for faster retrieval
            this.cacheClient.setex(`${this.baseCacheKey}.${this.hashQuery(query)}`, this.cacheTTL, JSON.stringify(obj));
            this.cacheClient.setex(
                `${this.baseCacheKey}.${this.hashQuery(this.searchIdQuery(obj.uid))}`,
                this.cacheTTL,
                JSON.stringify(obj)
            );
        }

        return obj;
    }
}
