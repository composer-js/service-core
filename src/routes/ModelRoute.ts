///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Repository, MongoRepository } from "typeorm";
import ModelUtils from "../models/ModelUtils";
import RepoUtils from "../models/RepoUtils";
import BaseEntity from "../models/BaseEntity";
import { SimpleEntity, Init, ACLUtils } from "../service_core";
import { Redis } from "ioredis";
import { RedisConnection } from "../decorators/ModelDecorators";
import * as crypto from "crypto";
import { Logger } from "../decorators/ObjectDecorators";
import { AccessControlList, ACLAction } from "../security/AccessControlList";

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
abstract class ModelRoute<T extends BaseEntity | SimpleEntity> {
    /** The redis client that will be used as a 2nd level cache for all cacheable models. */
    @RedisConnection("cache")
    protected cacheClient?: Redis;

    /** The time, in milliseconds, that objects will be cached before being invalidated. */
    protected cacheTTL?: number;

    /** The unique identifier of the default ACL for the model type. */
    protected defaultACLUid: string = "";

    @Logger
    protected logger: any;

    /** The model class associated with the controller to perform operations against. */
    protected abstract repo?: Repository<T> | MongoRepository<T>;

    /**
     * Initializes a new instance using any defaults.
     */
    protected constructor() {}

    /**
     * The base key used to get or set data in the cache.
     */
    protected get baseCacheKey(): string {
        const clazz: any = (this as any).class;
        return "db.cache." + clazz.modelClass.fqn;
    }

    /**
     * Returns the default access control list governing the model type. Returning a value of `undefined` will grant
     * full acccess to any user (including unauthenticated anonymous users).
     */
    protected abstract getDefaultACL(): AccessControlList | undefined;

    /**
     * Hashes the given query object to a unique string.
     * @param query The query object to hash.
     */
    protected hashQuery(query: any): string {
        return crypto
            .createHash("sha256")
            .update(JSON.stringify(query))
            .digest("hex");
    }

    /**
     * Called on server startup to initialize the route with any defaults.
     */
    @Init
    private async superInitialize() {
        const acl: AccessControlList | undefined = this.getDefaultACL();
        if (acl) {
            const existing: AccessControlList | undefined = await ACLUtils.findACL(acl.uid);

            // When an existing ACL is found make sure we can modify it
            if (existing) {
                acl.dateCreated = existing.dateCreated;
                acl.dateModified = new Date();
                acl.version = existing.version;
            }

            // Always save the ACL into the datastore
            await ACLUtils.saveACL(acl);
            this.defaultACLUid = acl.uid;
        }
    }

    /**
     * Retrieves the object with the given id from either the cache or the database. If retrieving from the database
     * the cache is populated to speed up subsequent requests.
     *
     * @param id The unique identifier of the object to retrieve.
     */
    protected async getObj(id: string): Promise<T | undefined> {
        if (!this.repo) {
            throw new Error("Repository not set or could not be found.");
        }

        const query: any = this.searchIdQuery(id);
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

        const existing: T | undefined = await this.repo.findOne(query);

        if (existing && this.cacheClient && this.cacheTTL) {
            // Cache the object for faster retrieval
            this.cacheClient.setex(
                `${this.baseCacheKey}.${this.hashQuery(query)}`,
                this.cacheTTL,
                JSON.stringify(existing)
            );
        }

        return existing;
    }

    /**
     * Search for existing object based on passed in id
     */
    private searchIdQuery(id: string): any {
        const clazz: any = (this as any).class;
        return ModelUtils.buildIdSearchQuery(this.repo, clazz.modelClass, id);
    }

    /**
     * Attempts to retrieve the number of data model objects matching the given set of criteria as specified in the
     * request `query`. Any results that have been found are set to the `result` property of the `res` argument.
     * `result` is never null.
     */
    protected async doCount(params: any, query: any, user?: any): Promise<any> {
        if (!this.repo) {
            throw new Error("Repository not set or could not be found.");
        }

        if (!(await ACLUtils.hasPermission(user, this.defaultACLUid, ACLAction.READ))) {
            const error: any = new Error("User does not have permission to perform this action.");
            error.status = 403;
            throw error;
        }

        const result: number = await this.repo.count(
            ModelUtils.buildSearchQuery(this.repo, params, query, true, user, false)
        );
        return { count: result };
    }

    /**
     * Attempts to store the object provided in `req.body` into the datastore. Upon success, sets the newly persisted
     * object to the `result` property of the `res` argument, otherwise sends a `400 BAD REQUEST` response to the
     * client.
     */
    protected async doCreate(obj: T, user?: any, acl?: AccessControlList): Promise<T> {
        if (!this.repo) {
            throw new Error("Repository not set or could not be found.");
        }

        if (!(await ACLUtils.hasPermission(user, this.defaultACLUid, ACLAction.CREATE))) {
            const error: any = new Error("User does not have permission to perform this action.");
            error.status = 403;
            throw error;
        }

        obj = await RepoUtils.preprocessBeforeSave(this.repo, obj);

        // HAX We shouldn't be casting obj to any here but this is the only way to get it to compile since T
        // extends BaseEntity.
        const result: T = await this.repo.save(obj as any);

        if (this.cacheClient && this.cacheTTL) {
            // Cache the object for faster retrieval
            const query: any = this.searchIdQuery(obj.uid);
            const cacheKey: string = `${this.baseCacheKey}.${this.hashQuery(query)}`;
            this.cacheClient.setex(cacheKey, this.cacheTTL, JSON.stringify(result));
        }

        // If ACLs are enabled but no ACL was given create one using the default
        if (!acl && this.defaultACLUid !== "") {
            acl = this.getDefaultACL();
            if (acl) {
                acl.uid = result.uid;

                // Grant the creator CRUD access
                if (user) {
                    acl.records.unshift({
                        userOrRoleId: user.uid,
                        create: true,
                        read: true,
                        update: true,
                        delete: true,
                        special: false,
                        full: false,
                    });
                }
            }
        }
        if (acl) {
            acl.parentUid = this.defaultACLUid;
            await ACLUtils.saveACL(acl);
        }

        return result;
    }

    /**
     * Attempts to delete an existing data model object with a given unique identifier encoded by the URI parameter
     * `id`.
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
        const obj: T | undefined = await this.repo.findOne(query);

        const acl: AccessControlList | undefined = await ACLUtils.findACL(obj ? obj.uid : id);
        if (!(await ACLUtils.hasPermission(user, acl ? acl : this.defaultACLUid, ACLAction.DELETE))) {
            const error: any = new Error("User does not have permission to perform this action.");
            error.status = 403;
            throw error;
        }

        if (obj) {
            await this.repo.remove(obj);

            if (this.cacheClient && this.cacheTTL) {
                // Delete the object from cache
                this.cacheClient.del(`${this.baseCacheKey}.${this.hashQuery(query)}`);
                this.cacheClient.del(`${this.baseCacheKey}.${this.hashQuery(this.searchIdQuery(obj.uid))}`);
            }

            await ACLUtils.removeACL(id);
        }
    }

    /**
     * Attempts to retrieve all data model objects matching the given set of criteria as specified in the request
     * `query`. Any results that have been found are set to the `result` property of the `res` argument. `result` is
     * never null.
     *
     * @param req The HTTP request that contains one or more query parameters to use in the search.
     * @param res The HTTP response whose `result` property will contain all objects found in the search.
     * @param next The next function to execute after this one.
     */
    protected async doFindAll(params: any, query: any, user?: any): Promise<T[]> {
        let results: T[] = [];

        if (!this.repo) {
            throw new Error("Repository not set or could not be found.");
        }

        if (!(await ACLUtils.hasPermission(user, this.defaultACLUid, ACLAction.READ))) {
            const error: any = new Error("User does not have permission to perform this action.");
            error.status = 403;
            throw error;
        }

        const searchQuery: any = ModelUtils.buildSearchQuery(this.repo, params, query, true, user, false);

        // Pull from the cache if available
        if (this.cacheClient && this.cacheTTL) {
            const json: string | null = await this.cacheClient.get(
                `${this.baseCacheKey}.${this.hashQuery(searchQuery)}`
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
            results = await this.repo.find(searchQuery);

            // Cache the results for future requests
            if (this.cacheClient && this.cacheTTL) {
                const uids: string[] = [];

                for (const result of results) {
                    uids.push(result.uid);
                }

                this.cacheClient.setex(
                    `${this.baseCacheKey}.${this.hashQuery(searchQuery)}`,
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
     * @param req The HTTP request that contains a `params.id` parameter with the unique identifier to retrieve.
     * @param res The HTTP response whose `result` property will be set with the results of the search.
     * @param next The next function to execute after this one.
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

        const acl: AccessControlList | undefined = await ACLUtils.findACL(result.uid);
        if (!(await ACLUtils.hasPermission(user, acl ? acl : this.defaultACLUid, ACLAction.READ))) {
            const error: any = new Error("User does not have permission to perform this action.");
            error.status = 403;
            throw error;
        }

        return result;
    }

    /**
     * Attempts to remove all entries of the data model type from the datastore.
     *
     * @param user The authenticated user performing the action, otherwise undefined.
     */
    protected async doTruncate(user?: any): Promise<void> {
        if (!this.repo) {
            throw new Error("Repository not set or could not be found.");
        }

        if (!(await ACLUtils.hasPermission(user, this.defaultACLUid, ACLAction.DELETE))) {
            const error: any = new Error("User does not have permission to perform this action.");
            error.status = 403;
            throw error;
        }

        try {
            await this.repo.clear();
        } catch (err) {
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

        const query: any = this.searchIdQuery(obj.uid);
        obj = await RepoUtils.preprocessBeforeUpdate(this.repo, obj);

        const acl: AccessControlList | undefined = await ACLUtils.findACL(obj.uid);
        if (!(await ACLUtils.hasPermission(user, acl ? acl : this.defaultACLUid, ACLAction.UPDATE))) {
            const error: any = new Error("User does not have permission to perform this action.");
            error.status = 403;
            throw error;
        }

        if (this.repo instanceof MongoRepository) {
            if (obj instanceof BaseEntity) {
                await this.repo.updateOne(
                    { uid: obj.uid, version: obj.version },
                    {
                        $set: {
                            ...obj,
                            dateModified: new Date(),
                            version: obj.version + 1,
                        },
                    }
                );
            } else if (obj.uid) {
                await this.repo.updateOne(
                    { uid: obj.uid },
                    {
                        $set: {
                            ...obj,
                        },
                    }
                );
            } else {
                // HAX We shouldn't be casting `obj` to `any` here but this is the only way to get it to compile since T
                // extends `BaseEntity`.
                const result: T | undefined = await this.repo.save(obj as any);
                if (result) {
                    obj = result;
                }
            }
        } else {
            if (obj instanceof BaseEntity) {
                await this.repo.update(query, {
                    ...obj,
                    dateModified: new Date(),
                    version: obj.version + 1,
                } as any);
            } else {
                await this.repo.update(query, obj as any);
            }
        }

        const result: T | undefined = await this.repo.findOne(query);
        if (result) {
            obj = result;
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

export default ModelRoute;
