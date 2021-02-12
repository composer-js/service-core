///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { JWTUser, UserUtils } from "@composer-js/core";
import AccessControlListSQL from "./AccessControlListSQL";
import AccessControlListMongo from "./AccessControlListMongo";
import { MongoRepository, Repository, Connection } from "typeorm";
import ConnectionManager from "../database/ConnectionManager";
import { Request } from "express";
import { AccessControlList, ACLAction, ACLRecord } from "./AccessControlList";
import { Redis } from "ioredis";

const CACHE_BASE_KEY: string = "db.cache.AccessControlList";

/**
 * Common utility functions for working with `AccessControlList` objects and validating user permissions.
 */
class ACLUtils {
    private cacheClient?: Redis;
    private cacheTTL: number = 30;
    private config: any;
    private repo?: Repository<AccessControlListSQL> | MongoRepository<AccessControlListMongo>;

    /**
     * Initializes the utility with the provided defaults.
     */
    public init(config: any): void {
        this.config = config;

        if (!this.cacheClient) {
            this.cacheClient = ConnectionManager.connections.get("cache") as Redis;
        }

        if (!this.repo) {
            const conn: any = ConnectionManager.connections.get("acl");
            if (conn instanceof Connection) {
                if (conn.driver.constructor.name === "MongoDriver") {
                    this.repo = conn.getMongoRepository(AccessControlListMongo);
                } else {
                    this.repo = conn.getRepository(AccessControlListSQL);
                }
            }
        }
    }

    /**
     * Checks to see if the provided user matches the providedUserOrRoleId.
     * @param user The user to check.
     * @param userOrRoleId The ACL record id to check against.
     * @returns `true` if the user contains a `uid` or `role` that matches the `userOrRoleId`, otherwise `false`.
     */
    private userMatchesId(user: JWTUser | undefined, userOrRoleId: string): boolean {
        let matches: RegExpMatchArray | null = null;

        if (user && user.uid) {
            matches = user.uid.match(userOrRoleId);
            if (!matches && user.roles) {
                for (const role of user.roles) {
                    matches = role.match(userOrRoleId);

                    if (matches !== null && matches.length > 0) {
                        break;
                    }
                }
            }
        } else {
            return "anonymous" === userOrRoleId;
        }

        return matches !== null && matches.length > 0;
    }

    /**
     * Validates that the user has permission to perform the request operation against the URL path for the
     * provided request. If ACLUtils has not been initialized or the `acl` datastore has not been configured
     * then always returns `true`.
     *
     * @param user The user to validate.
     * @param req The request whose URL path and method will be verified.
     */
    public async checkRequestPerms(user: JWTUser | undefined, req: Request): Promise<boolean> {
        let result: boolean = true;

        // If no repo is set then ACL support is not configured so just return
        if (!this.repo) {
            return result;
        }

        let acl: AccessControlList | undefined = undefined;

        // Look for the ACL in the cache
        if (this.cacheClient) {
            // TODO
        }

        // If the acl wasn't found in the cache, look it up in the database
        if (!acl) {
            if (this.repo instanceof MongoRepository) {
                const pipeline: any[] = [
                    {
                        $addFields: {
                            resultObject: {
                                $regexFind: {
                                    input: req.path,
                                    regex: "$uid",
                                },
                            },
                        },
                    },
                    {
                        $match: {
                            resultObject: {
                                $ne: null,
                            },
                        },
                    },
                    {
                        $sort: {
                            "resultObject.match": -1,
                        },
                    },
                ];
                const acls: AccessControlList[] = await this.repo.aggregate(pipeline).toArray();
                acl = acls.length > 0 ? acls[0] : undefined;
            } else {
                throw new Error("Inverse regex searching not supported by SQL.");
            }

            if (acl) {
                // Make sure all parents are populated
                if (!acl.parent) {
                    await this.populateParent(acl);
                }

                // Store a copy in the cache for faster retrieval next time
                if (this.cacheClient) {
                    await this.cacheClient.setex(`${CACHE_BASE_KEY}.${acl.uid}`, this.cacheTTL, JSON.stringify(acl));
                }
            }
        }

        if (acl) {
            // First check if the user is trusted. Trusted users always have permission. We pass in the ACL uid as
            // it may be an organization id in which case we want to also check for organizational trusted users.
            if (UserUtils.hasRoles(user, this.config.get("trusted_roles"), acl.uid)) {
                result = true;
            } else {
                // Map the request method to an ACLAction and test for permission
                switch (req.method.toLowerCase()) {
                    case "delete":
                        result = await this.hasPermission(user, acl, ACLAction.DELETE);
                        break;
                    case "get":
                        result = await this.hasPermission(user, acl, ACLAction.READ);
                        break;
                    case "post":
                        result = await this.hasPermission(user, acl, ACLAction.CREATE);
                        break;
                    case "put":
                        result = await this.hasPermission(user, acl, ACLAction.UPDATE);
                        break;
                }
            }
        }

        return result;
    }

    /**
     * Validates that the user has permission to perform the provided action using the given access control list.
     *
     * @param user The user to validate permissions of.
     * @param acl The ACL or uid of an ACL to validate permissions against.
     * @param action The action that the user desires permission for.
     * @returns `true` if the user has at least one of the permissions granted for the given entity, otherwise `false`.
     */
    public async hasPermission(
        user: JWTUser | undefined,
        acl: AccessControlList | string,
        action: ACLAction
    ): Promise<boolean> {
        let result: boolean | null = true;

        // If the repo isn't available, no acl was provided or the ACL string is empty just return, assume always true
        if (!this.repo || !acl || acl === "") {
            return result;
        }

        // First check if the user is trusted. Trusted users always have permission. We pass in the ACL uid as
        // it may be an organization id in which case we want to also check for organizational trusted users.
        if (UserUtils.hasRoles(user, this.config.get("trusted_roles"), typeof acl === "string" ? acl : acl.uid)) {
            return true;
        }

        // If a uid has been given look up the ACL associated with it and then process
        if (typeof acl === "string") {
            const entry: AccessControlList | undefined = await this.findACL(acl);
            return entry ? this.hasPermission(user, entry, action) : result;
        }

        // Look for the first available record for the given user
        const record: ACLRecord | undefined = this.getRecord(acl, user);

        // Validate the requested action against the record.
        if (record) {
            // A `FULL` permission grant overrides everything else
            result = record.full;

            if (!result) {
                switch (action) {
                    case ACLAction.CREATE:
                        result = record.create;
                        break;
                    case ACLAction.DELETE:
                        result = record.delete;
                        break;
                    case ACLAction.FULL:
                        result =
                            record.full ||
                            (record.create && record.delete && record.read && record.special && record.update);
                        break;
                    case ACLAction.READ:
                        result = record.read;
                        break;
                    case ACLAction.SPECIAL:
                        result = record.special;
                        break;
                    case ACLAction.UPDATE:
                        result = record.update;
                        break;
                }
            }
        }

        // If the result of the previous permission check is that result is now `undefined`
        // then search for a parent record that hopefully has a defined entry for that action.
        if ((result === undefined || result === null) && acl.parent) {
            result = await this.hasPermission(user, acl.parent, action);
        }

        // `undefined` is an invalid answer, in that case always return `true`
        return result !== null && result !== null ? result : true;
    }

    /**
     * Retrieves the access control list with the associated identifier and populates the parent(s).
     *
     * @param entityId The unique identifier of the ACL to retrieve.
     * @param parentUids The list of already found parent UIDs. This is used to break circular dependencies.
     */
    public async findACL(entityId: string, parentUids: string[] = []): Promise<AccessControlList | undefined> {
        if (!this.repo) {
            return undefined;
        }

        let acl: AccessControlList | undefined;

        // Retrieve the ACL from the cache if present
        if (this.cacheClient) {
            const json: string | null = await this.cacheClient.get(`${CACHE_BASE_KEY}.${entityId}`);
            if (json) {
                try {
                    acl = JSON.parse(json);
                } catch (err) {
                    // We don't care if this fails
                }
            }
        }

        // If the acl wasn't found in the cache look in the database
        if (!acl) {
            if (this.repo instanceof MongoRepository) {
                acl = await this.repo.aggregate([{ $match: { uid: entityId }}]).limit(1).next();
                acl = acl ? new AccessControlListMongo(acl) : undefined;
            } else {
                acl = await this.repo.findOne({ uid: entityId });
                acl = acl ? new AccessControlListSQL(acl) : undefined;
            }

            // Retrieve the parent ACL and assign it if available. Don't populate parents we've
            // already found to prevent a circular dependency.
            if (acl && acl.parentUid && !parentUids.includes(acl.parentUid)) {
                parentUids.push(acl.parentUid);
                acl.parent = await this.findACL(acl.parentUid, parentUids);
            }

            // Store a copy in the cache for faster retrieval next time
            if (this.cacheClient) {
                await this.cacheClient.setex(`${CACHE_BASE_KEY}.${entityId}`, this.cacheTTL, JSON.stringify(acl));
            }
        }

        return acl;
    }

    /**
     * Deletes the ACL with the given identifier from the database.
     * @param uid The unique identifier of the ACL to remove.
     */
    public async removeACL(uid: string): Promise<void> {
        try {
            if (this.repo instanceof MongoRepository) {
                await this.repo.deleteOne({ uid });
            } else if (this.repo) {
                await this.repo.delete({ uid });
            }
        } catch (err) {
            // It's okay if this fails because no document exists
        }
    }

    /**
     * Compares two ACLs to see if they have been modified and returns the total number of changes between them.
     * 
     * @param aclA The source ACL to compare against.
     * @param aclB The new ACL to compare with.
     * @returns The total number of changes between the two ACLs.
     */
    private diffACL(aclA: AccessControlList, aclB: AccessControlList): number {
        let result: number = 0;

        // Did the parent change?
        if (aclA.parent !== aclB.parent) {
            result++;
        }

        // Did any of the records change from A to B?
        for (const recordA of aclA.records) {
            let foundRecord: ACLRecord | undefined = undefined;

            // Look for the same record in aclA
            for (const recordB of aclB.records) {
                if (recordA.userOrRoleId === recordB.userOrRoleId) {
                    foundRecord = recordB;
                    break;
                }
            }

            if (foundRecord) {
                // Check to see if any of the permissions changed for this record
                result += foundRecord.create !== recordA.create ? 1 : 0;
                result += foundRecord.delete !== recordA.delete ? 1 : 0;
                result += foundRecord.full !== recordA.full ? 1 : 0;
                result += foundRecord.read !== recordA.read ? 1 : 0;
                result += foundRecord.special !== recordA.special ? 1 : 0;
                result += foundRecord.update !== recordA.update ? 1 : 0;
            } else {
                result++;
            }
        }

        // Did any of the records change from B to A?
        for (const recordB of aclB.records) {
            let foundRecord: ACLRecord | undefined = undefined;

            // Look for the same record in aclA
            for (const recordA of aclA.records) {
                if (recordA.userOrRoleId === recordB.userOrRoleId) {
                    foundRecord = recordA;
                    break;
                }
            }

            if (foundRecord) {
                // Check to see if any of the permissions changed for this record
                result += foundRecord.create !== recordB.create ? 1 : 0;
                result += foundRecord.delete !== recordB.delete ? 1 : 0;
                result += foundRecord.full !== recordB.full ? 1 : 0;
                result += foundRecord.read !== recordB.read ? 1 : 0;
                result += foundRecord.special !== recordB.special ? 1 : 0;
                result += foundRecord.update !== recordB.update ? 1 : 0;
            } else {
                result++;
            }
        }

        return result;
    }

    /**
     * Stores the given access control list into the ACL database.
     *
     * @param acl The ACL to store.
     * @return Returns the ACL that was stored in the database.
     */
    public async saveACL(acl: AccessControlList): Promise<AccessControlList | undefined> {
        let result: AccessControlList | undefined = undefined;

        if (this.repo instanceof MongoRepository) {
            const existing: AccessControlListMongo | undefined = await this.repo.findOne({ uid: acl.uid });
            // If no changes have been made between versions ignore this request
            if (existing && this.diffACL(existing, acl) === 0) {
                return existing;
            }
            // Make sure that the versions match before we proceed
            if (existing && existing.version != acl.version) {
                throw new Error(`The acl to save must be of the same version. ACL=${acl.uid}, Expected=${existing.version}, Actual=${acl.version}`);
            }
            const aclMongo: AccessControlListMongo = new AccessControlListMongo({
                ...acl,
                dateModifed: new Date(),
                version: existing ? acl.version + 1 : acl.version,
            });
            result = await this.repo.save(aclMongo);
        } else if (this.repo) {
            const existing: AccessControlListSQL | undefined = await this.repo.findOne({ uid: acl.uid });
            // If no changes have been made between versions ignore this request
            if (existing && this.diffACL(existing, acl) === 0) {
                return existing;
            }
            // Make sure that the versions match before we proceed
            if (existing && existing.version != acl.version) {
                throw new Error(`The acl to save must be of the same version. ACL=${acl.uid}, Expected=${existing.version}, Actual=${acl.version}`);
            }
            const aclSQL: AccessControlListSQL = new AccessControlListSQL({
                ...acl,
                dateModifed: new Date(),
                version: existing ? acl.version + 1 : acl.version,
            });
            result = await this.repo.save(aclSQL);
        }

        // Store a copy in the cache for faster retrieval next time
        if (this.cacheClient && result) {
            await this.cacheClient.setex(`${CACHE_BASE_KEY}.${result.uid}`, this.cacheTTL, JSON.stringify(result));
        }

        return result;
    }

    /**
     * Retrieves the first available record in the provided ACL associated with the provided user.
     *
     * @param acl The access control list that will be searched.
     * @param user The user to find a record for.
     * @returns The ACL record associated with the given user if found, otherwise `undefined`.
     */
    public getRecord(acl: AccessControlList, user: JWTUser | undefined): ACLRecord | undefined {
        for (const record of acl.records) {
            if (this.userMatchesId(user, record.userOrRoleId)) {
                return record;
            }
        }

        return acl.parent ? this.getRecord(acl.parent, user) : undefined;
    }

    /**
     * Attempts to retrieve the parent access control list for the given ACL object.
     *
     * @param acl The access control list whose parents will be populated.
     * @param parentUids The list of already found parent UIDs. This is used to break circular dependencies.
     */
    public async populateParent(acl: AccessControlList, parentUids: string[] = []): Promise<void> {
        if (acl && acl.parentUid) {
            parentUids.push(acl.parentUid);
            acl.parent = await this.findACL(acl.parentUid, parentUids);
        }
    }
}

const instance: ACLUtils = new ACLUtils();
export default instance;
