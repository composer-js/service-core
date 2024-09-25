///////////////////////////////////////////////////////////////////////////////
// Copyright (C) Xsolla (USA), Inc. All rights reserved.
////////////////////////////////////////////////////////////////////////////////
import * as crypto from "crypto";
import { Repository, MongoRepository, EntityMetadata } from "typeorm";
import { ModelUtils } from "../models/ModelUtils";
import { BaseEntity } from "../models/BaseEntity";
import { SimpleEntity } from "../models/SimpleEntity";
import { BaseMongoEntity } from "../models/BaseMongoEntity";
import { ApiErrorMessages, ApiErrors } from "../ApiErrors";
import { ApiError, JWTUser, ObjectDecorators, UserUtils } from "@composer-js/core";
import { DatabaseDecorators } from "../decorators";
import Redis from "ioredis";
import { ObjectFactory } from "../ObjectFactory";
import { NotificationUtils } from "../NotificationUtils";
import { RecoverableBaseEntity } from "./RecoverableBaseEntity";
import { Admin } from "mongodb";
import { AccessControlList, ACLAction, ACLUtils } from "../security";
import { ConnectionManager } from "../database";
const { Config, Init, Inject, Logger } = ObjectDecorators;
const { RedisConnection } = DatabaseDecorators;

/**
 * The available options used for `RepoUtils` operations.
 */
export interface RepoOperationOptions {
    /** Set to `true` to ignore the ACL permissions check. */
    ignoreACL?: boolean;
    /** Indicates if a telemetry event should be broadcast for the request. */
    recordEvent?: boolean;
    /** The authenticated user making the request. */
    user?: JWTUser;
}

/**
 * The available options for the `RepoUtils.create()` operation.
 */
export interface RepoCreateOptions extends RepoOperationOptions {
    /** The AccessControlList to use when creating a new object. */
    acl?: AccessControlList;
}

/**
 * The available options for the `RepoUtils.delete()` operation.
 */
export interface RepoDeleteOptions extends RepoOperationOptions {
    /** The desired product uid of the resource to delete. */
    productUid?: string;
    /** Set to true to permanently remove the object from the database (if applicable). */
    purge?: boolean;
    /** The desired version number of the resource to delete. */
    version?: number | string;
}

/**
 * The available options for the `RepoUtils.update()` operation.
 */
export interface RepoUpdateOptions<T extends BaseEntity | SimpleEntity> extends RepoOperationOptions {
    /** The desired product uid of the resource to update. */
    productUid?: string;
    /** The desired version number of the resource to update. */
    version?: number | string;
}

/**
 * @author Jean-Philippe Steinmetz
 */
export class RepoUtils<T extends BaseEntity | SimpleEntity> {
    @Inject("ACLUtils")
    private aclUtils?: ACLUtils;

    /** The redis client that will be used as a 2nd level cache for all cacheable models. */
    @RedisConnection("cache")
    protected cacheClient?: Redis;

    @Config()
    protected config: any;

    /** The unique identifier of the default ACL for the model type. */
    protected defaultACLUid: string = "";

    @Logger
    protected logger: any;

    protected modelClass: any;

    @Inject(ObjectFactory)
    private objectFactory?: ObjectFactory;

    @Inject(NotificationUtils)
    protected notificationUtils?: NotificationUtils;

    /** The model class associated with the controller to perform operations against. */
    protected repo?: Repository<T>;

    @Config("trusted_roles", ["admin"])
    protected trustedRoles: string[] = ["admin"];

    constructor(modelClass: any, repo?: Repository<T>) {
        this.modelClass = modelClass;
        this.repo = repo;
    }

    @Init
    private async init() {
        // Retrieve the repository based on the modelClass that was passed in to the constructor
        if (!this.repo) {
            if (!this.modelClass.datastore) {
                throw new Error(
                    `Cannot initialize RepoUtils. Did you forget to add @DataStore() to ${this.modelClass.name}?`
                );
            }

            const connMgr: ConnectionManager | undefined = this.objectFactory?.getInstance(ConnectionManager);
            if (!connMgr) {
                throw new Error("Cannot initialize RepoUtils. Failed to retrieve ConnectionManager.");
            }

            const ds: any = connMgr.connections.get(this.modelClass.datastore);
            if (!ds) {
                throw new Error(
                    `Cannot initialize RepoUtils. No connection found for datastore '${this.modelClass.datastore}'`
                );
            }

            const isMongoRepo: boolean = new this.modelClass() instanceof BaseMongoEntity;
            this.repo = isMongoRepo ? ds.getMongoRepository(this.modelClass) : ds.getRepository(this.modelClass);
        }

        if (!this.repo) {
            throw new Error(`Cannot initialize RepoUtils. No repository found for class ${this.modelClass.name}.`);
        }

        let defaultAcl: AccessControlList | undefined = this.getDefaultACL();
        if (defaultAcl) {
            this.defaultACLUid = defaultAcl.uid;
            await this.aclUtils?.saveDefaultACL(defaultAcl);
        }

        // Does the model specify a MongoDB shard configuration?
        const shardConfig: any = Reflect.getMetadata("cjs:shardConfig", this.modelClass);
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
                                const dbName: string = this.config.get(
                                    `datastores:${this.modelClass.datastore}:database`
                                );
                                this.logger.info(
                                    `Configuring sharding for: collection=${dbName}.${
                                        metadata.tableName
                                    }, key=${JSON.stringify(shardConfig.key)}, unique=${
                                        shardConfig.unique
                                    }, options=${JSON.stringify(shardConfig.options)})`
                                );
                                const result: any = await admin.command({
                                    shardCollection: `${dbName}.${metadata.tableName}`,
                                    key: shardConfig.key,
                                    unique: shardConfig.unique,
                                    ...shardConfig.options,
                                });
                                this.logger.debug(`Result: ${JSON.stringify(result)}`);
                            } catch (e: any) {
                                this.logger.warn(
                                    `There was a problem trying to configure MongoDB sharding for collection '${metadata.tableName}'. Error=${e.message}`
                                );
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
     * The base key used to get or set data in the cache.
     */
    public get baseCacheKey(): string {
        return "db.cache." + this.modelClass.name;
    }

    /**
     * Stores a new record of the provided object in the datastore. Performs pre-processing, permission checks against
     * the class ACL, cache seeding, telemetry recording and push notifications.
     *
     * @param obj The object to store.
     * @param acl The ACL to use
     */
    public async create(obj: T, options: RepoCreateOptions): Promise<T> {
        if (!this.repo) {
            throw new ApiError(ApiErrors.INTERNAL_ERROR, 500, ApiErrorMessages.INTERNAL_ERROR);
        }

        // Verify the user's permission to create objects
        if (
            this.aclUtils &&
            !options.ignoreACL &&
            !(await this.aclUtils.hasPermission(options.user, this.defaultACLUid, ACLAction.CREATE))
        ) {
            throw new ApiError(ApiErrors.AUTH_PERMISSION_FAILURE, 403, ApiErrorMessages.AUTH_PERMISSION_FAILURE);
        }

        // Make sure an existing object doesn't already exist with the same identifiers
        const ids: any[] = [];
        const idProps: string[] = ModelUtils.getIdPropertyNames(obj.constructor);
        for (const prop of idProps) {
            // Skip `productUid` as it is considered a compound key
            if (prop === "productUid") continue;
            const val: string = (obj as any)[prop];
            if (val) {
                ids.push(val);
            }
        }
        const query: any = ModelUtils.buildIdSearchQuery(
            this.repo,
            obj.constructor,
            ids,
            undefined,
            (obj as any).productUid
        );
        const count: number = await this.repo.count(query);
        if (!this.modelClass.trackChanges && count > 0) {
            throw new ApiError(ApiErrors.IDENTIFIER_EXISTS, 400, ApiErrorMessages.IDENTIFIER_EXISTS);
        }

        // Override the date and version fields with their defaults
        if (obj instanceof BaseEntity) {
            obj.dateCreated = new Date();
            obj.dateModified = new Date();
            obj.version = count;
        }

        // Are we tracking multiple versions for this object?
        if (obj instanceof BaseEntity && this.modelClass.trackChanges === 0) {
            (obj as any).version = 0;
        }

        // HAX We shouldn't be casting obj to any here but this is the only way to get it to compile since T
        // extends BaseEntity.
        const result: T = this.instantiateObject(await this.repo.save(obj));

        if (this.cacheClient && this.modelClass.cacheTTL) {
            // Cache the object for faster retrieval
            const query: any = this.searchIdQuery(obj.uid);
            const cacheKey: string = `${this.baseCacheKey}.${this.hashQuery(query)}`;
            void this.cacheClient.setex(cacheKey, this.modelClass.cacheTTL, JSON.stringify(result));
        }

        if (this.aclUtils && this.modelClass.recordACL) {
            // If ACLs are enabled but no ACL was given create one
            const acl: AccessControlList = {
                uid: result.uid,
                parentUid: options.acl?.parentUid || this.defaultACLUid,
                records: options.acl?.records || [],
            };

            // Look for an existing record for the creator
            let found: boolean = !!this.aclUtils.getRecord(acl, options.user);

            // Always grant the creator CRUD access, unless the user is a superuser.
            if (!found && options.user && !UserUtils.hasRoles(options.user, this.trustedRoles)) {
                acl.records.push({
                    userOrRoleId: options.user.uid,
                    create: true,
                    read: true,
                    update: true,
                    delete: true,
                    special: false,
                    full: false,
                });
            }

            await this.aclUtils?.saveACL(acl);
        }

        // If the document contains a userId or personaId reference send a push notification
        // to that client so that they're aware of the change.
        const objAny: any = obj;
        const id: string | undefined = objAny.userUid
            ? objAny.userUid
            : objAny.userId
            ? objAny.userId
            : objAny.personaUid
            ? objAny.personaUid
            : objAny.personaId
            ? objAny.personaId
            : undefined;
        if (id) {
            this.notificationUtils?.sendMessage(id, this.modelClass.name, "create", obj);
        }
        this.notificationUtils?.sendMessage(obj.uid, this.modelClass.name, "create", obj);

        return result;
    }

    public async delete(uid: string, options: RepoDeleteOptions): Promise<void> {
        if (!this.repo) {
            throw new ApiError(ApiErrors.INTERNAL_ERROR, 500, ApiErrorMessages.INTERNAL_ERROR);
        }

        if (this.aclUtils && !options.ignoreACL) {
            const acl: AccessControlList | null = await this.aclUtils.findACL(uid);
            if (!(await this.aclUtils.hasPermission(options.user, acl ? acl : this.defaultACLUid, ACLAction.DELETE))) {
                throw new ApiError(ApiErrors.AUTH_PERMISSION_FAILURE, 403, ApiErrorMessages.AUTH_PERMISSION_FAILURE);
            }
        }

        const isRecoverable: boolean = this.instantiateObject({}) instanceof RecoverableBaseEntity;
        const isPurge: boolean = isRecoverable ? options.purge || false : true;
        const query: any = ModelUtils.buildIdSearchQuery(
            this.repo,
            this.modelClass,
            uid,
            options.version ? Number(options.version) : undefined,
            options.productUid
        );

        // If the object(s) are being permenantly removed from the database do so and then clear the accompanying
        // ACL(s). If the class type is recoverable and purge isn't desired, simply mark the object(s) as deleted.
        if (isPurge) {
            if (this.repo instanceof MongoRepository) {
                await this.repo.deleteMany(query);
            } else {
                await this.repo.delete(query.where);
            }

            if (this.aclUtils && this.modelClass.recordACL) {
                await this.aclUtils.removeACL(uid);
            }
        } else {
            if (this.repo instanceof MongoRepository) {
                await this.repo.updateMany(query, {
                    $set: {
                        deleted: true,
                    },
                });
            } else {
                await this.repo.update(query.where, {
                    deleted: true,
                } as any);
            }
        }

        if (this.cacheClient && this.modelClass.cacheTTL) {
            // Delete the object from cache
            void this.cacheClient.del(`${this.baseCacheKey}.${this.hashQuery(query)}`);
            void this.cacheClient.del(`${this.baseCacheKey}.${this.hashQuery(this.searchIdQuery(uid))}`);
        }

        // If the document contains a userId or personaId reference send a push notification
        // to that client so that they're aware of the change.
        this.notificationUtils?.sendMessage(uid, this.modelClass.name, "delete", {
            uid,
            productUid: options.productUid,
            version: options.version,
        });
    }

    /**
     * Retrieves the object with the given id from either the cache or the database. If retrieving from the database
     * the cache is populated to speed up subsequent requests.
     *
     * @param id The unique identifier of the object to retrieve.
     * @param version The desired version number of the object to retrieve. If `undefined` returns the latest.
     * @param productUid The optional productUid associated with the object.
     * @param skipCache Set to `true` to skip retrieval from the cache.
     */
    public async fetchObject(
        id: string,
        version?: number | string,
        productUid?: string,
        skipCache: boolean = false
    ): Promise<T | undefined> {
        if (!this.repo) {
            throw new ApiError(ApiErrors.INTERNAL_ERROR, 500, ApiErrorMessages.INTERNAL_ERROR);
        }

        const query: any = this.searchIdQuery(id, version, productUid);
        if (!skipCache && this.cacheClient && this.modelClass.cacheTTL) {
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
            existing = await this.repo
                .aggregate([
                    {
                        $match: query,
                    },
                    {
                        $sort: { version: -1 },
                    },
                ])
                .limit(1)
                .next();
        } else {
            existing = await this.repo.findOne(query);
        }

        if (existing && this.cacheClient && this.modelClass.cacheTTL) {
            // Cache the object for faster retrieval
            void this.cacheClient.setex(
                `${this.baseCacheKey}.${this.hashQuery(query)}`,
                this.modelClass.cacheTTL,
                JSON.stringify(existing)
            );
        }

        // Make sure we return the correct data type
        return existing ? this.instantiateObject(existing) : undefined;
    }

    /**
     * Returns the default access control list governing the model type. Returning a value of `undefined` will grant
     * full acccess to any user (including unauthenticated anonymous users).
     */
    public getDefaultACL(): AccessControlList | undefined {
        let result: AccessControlList | undefined = undefined;

        // Check if the model has the Protect decorator
        if (this.modelClass.classACL) {
            result = this.modelClass.classACL;
            if (result) {
                // Override the specified uid with the actual class name if the value is `<ClassName>`
                result.uid = result.uid === "<ClassName>" ? this.modelClass.name : result.uid;
            }
        }

        return result;
    }

    /**
     * Hashes the given query object to a unique string.
     * @param query The query object to hash.
     */
    public hashQuery(query: any): string {
        const queryStr: string = JSON.stringify(query);
        return crypto.createHash("sha512").update(queryStr).digest("hex");
    }

    /**
     * Creates a new instance of obj scoped to the correct model class or sub-class.
     */
    public instantiateObject(obj: any): T {
        const className: string | null = obj._fqn || obj._type;
        if (this.objectFactory) {
            if (className && typeof className === "string") {
                const clazz: any =
                    this.objectFactory.classes.get(className) || this.objectFactory.classes.get(`models.${className}`);
                return this.objectFactory.newInstance(clazz, null, false, obj) as T;
            } else {
                return this.objectFactory.newInstance(this.modelClass, null, false, obj) as T;
            }
        } else {
            return new this.modelClass(obj);
        }
    }

    /**
     * Search for existing object based on passed in id and version and product uid.
     *
     * The result of this function is compatible with all `Repository.find()` functions.
     */
    public searchIdQuery(id: string, version?: number | string, productUid?: string): any {
        return ModelUtils.buildIdSearchQuery(
            this.repo,
            this.modelClass,
            id,
            typeof version === "string" ? parseInt(version, 10) : version,
            productUid
        );
    }

    public async update(obj: Partial<T>, existing: T, options: RepoUpdateOptions<T>): Promise<T> {
        if (!this.repo) {
            throw new ApiError(ApiErrors.INTERNAL_ERROR, 500, ApiErrorMessages.INTERNAL_ERROR);
        }

        if (this.aclUtils && !options.ignoreACL) {
            const acl: AccessControlList | null = await this.aclUtils.findACL(existing.uid);
            if (!(await this.aclUtils.hasPermission(options.user, acl ? acl : this.defaultACLUid, ACLAction.UPDATE))) {
                throw new ApiError(ApiErrors.AUTH_PERMISSION_FAILURE, 403, ApiErrorMessages.AUTH_PERMISSION_FAILURE);
            }
        }

        // Enforce optimistic locking when applicable
        if (existing instanceof BaseEntity) {
            if (existing.version !== (obj as any).version) {
                throw new ApiError(ApiErrors.INVALID_OBJECT_VERSION, 409, ApiErrorMessages.INVALID_OBJECT_VERSION);
            }
        }

        // Make sure the object provided actually matches the id given
        if (existing.uid !== obj.uid) {
            throw new ApiError(ApiErrors.OBJECT_ID_MISMATCH, 400, ApiErrorMessages.OBJECT_ID_MISMATCH);
        }

        // When using MongoDB we need to copy the _id property in order to prevent duplicate entries
        if (existing instanceof BaseMongoEntity) {
            (obj as any)._id = existing._id;
        }

        const keepPrevious: boolean = !!this.modelClass.trackChanges;
        let query: any = this.searchIdQuery(
            existing.uid,
            options.version || (obj as any).version,
            options.productUid || (obj as any).productUid
        );
        let result: T | null = null;

        if (this.repo instanceof MongoRepository) {
            if (existing instanceof BaseEntity) {
                if (keepPrevious) {
                    result = this.instantiateObject(
                        await this.repo.save({
                            ...obj,
                            _id: undefined, // Ensure we save a new document
                            dateModified: new Date(),
                            version: (obj as any).version + 1,
                        } as any)
                    );
                } else {
                    await this.repo.updateOne(
                        { uid: obj.uid, version: (obj as any).version },
                        {
                            $set: {
                                ...obj,
                                dateModified: new Date(),
                                version: (obj as any).version + 1,
                            },
                        }
                    );
                }
            } else if (obj.uid) {
                if (keepPrevious) {
                    result = this.instantiateObject(
                        await this.repo.save({
                            ...obj,
                            version: (obj as any).version + 1,
                        } as any)
                    );
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

                result = await this.repo.save(toSave);
            }
        } else {
            if (existing instanceof BaseEntity) {
                if (keepPrevious) {
                    await this.repo.insert({
                        ...obj,
                        dateModified: new Date(),
                        version: (obj as any).version + 1,
                    } as any);
                } else {
                    await this.repo.update(query.where, {
                        ...obj,
                        dateModified: new Date(),
                        version: (obj as any).version + 1,
                    } as any);
                }
            } else {
                const toSave: any = obj as any;

                if (keepPrevious) {
                    toSave.version += 1;
                    result = await this.repo.save(toSave);
                } else {
                    await this.repo.update(query.where, toSave);
                }
            }
        }

        query = this.searchIdQuery(existing.uid, obj instanceof BaseEntity ? obj.version + 1 : undefined);
        if (!result) {
            if (this.repo instanceof MongoRepository) {
                result = await this.repo
                    .aggregate([
                        {
                            $match: query,
                        },
                        {
                            $sort: { version: -1 },
                        },
                    ])
                    .limit(1)
                    .next();
            } else {
                result = await this.repo.findOne(query);
            }
            if (!result) {
                throw new ApiError(ApiErrors.INTERNAL_ERROR, 500, ApiErrorMessages.INTERNAL_ERROR);
            }
        }

        result = this.instantiateObject(result);

        if (result && this.cacheClient && this.modelClass.cacheTTL) {
            // Cache the object for faster retrieval
            void this.cacheClient.setex(
                `${this.baseCacheKey}.${this.hashQuery(query)}`,
                this.modelClass.cacheTTL,
                JSON.stringify(result)
            );
            void this.cacheClient.setex(
                `${this.baseCacheKey}.${this.hashQuery(this.searchIdQuery(result.uid))}`,
                this.modelClass.cacheTTL,
                JSON.stringify(result)
            );
        }

        // If the document contains a userId or personaId reference send a push notification
        // to that client so that they're aware of the change.
        const objAny: any = result;
        const userId: string | undefined = objAny.userUid ? objAny.userUid : objAny.userId ? objAny.userId : undefined;
        if (userId) {
            this.notificationUtils?.sendMessage(userId, this.modelClass.name, "update", obj);
        }
        this.notificationUtils?.sendMessage(result.uid, this.modelClass.name, "update", obj);

        return result;
    }
}
