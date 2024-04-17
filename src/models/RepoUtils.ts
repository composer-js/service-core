///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Repository, MongoRepository } from "typeorm";
import { ModelUtils } from "../models/ModelUtils";
import { BaseEntity } from "../models/BaseEntity";
import { SimpleEntity } from "../models/SimpleEntity";
import { BaseMongoEntity } from "../models/BaseMongoEntity";
import { ApiErrorMessages, ApiErrors } from "../ApiErrors";
import { ApiError } from "@composer-js/core";

/**
 * @author Jean-Philippe Steinmetz
 */
export class RepoUtils {
    /**
     * Verify object does not exist and update required fields for BaseEntity
     * @param repo Repository used to verify no existing object
     * @param obj Object that exentds BaseEntity or SimpleEntity
     * @param tracked Indicates if the object type uses version tracking or not.
     */
    public static async preprocessBeforeSave<T extends BaseEntity | SimpleEntity>(
        repo: Repository<T> | MongoRepository<T>,
        obj: T,
        tracked: boolean
    ): Promise<T> {
        if (!repo) {
            throw new Error("Repository not set or could not be found.");
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
        const query: any = ModelUtils.buildIdSearchQuery(repo, obj.constructor, ids, undefined, (obj as any).productUid);
        const count: number = await repo.count(query);
        if (!tracked && count > 0) {
            throw new ApiError(ApiErrors.IDENTIFIER_EXISTS, 400, ApiErrorMessages.IDENTIFIER_EXISTS);
        }

        // Override the date and version fields with their defaults
        if (obj instanceof BaseEntity) {
            obj.dateCreated = new Date();
            obj.dateModified = new Date();
            obj.version = count;
        }
        return obj;
    }

    /**
     * Verify object does exist and update required fields
     * @param repo Repository used to verify no existing object
     * @param obj Object that exentds BaseEntity or SimpleEntity
     * @param old The original object to validate against
     */
    public static async preprocessBeforeUpdate<T extends BaseEntity | SimpleEntity>(
        repo: Repository<T> | MongoRepository<T>,
        modelClass: any,
        obj: T,
        old?: T | null
    ): Promise<T> {
        if (!repo) {
            throw new Error("Repository not set or could not be found.");
        }

        if (!old) {
            const query: any = ModelUtils.buildIdSearchQuery(repo, modelClass, obj.uid, obj instanceof BaseEntity ? obj.version : undefined, "productUid" in obj ? (obj as any).productUid : undefined);
            old = await repo.findOne(query);
        }
        if (!old) {
            throw new ApiError(ApiErrors.NOT_FOUND, 404, ApiErrorMessages.NOT_FOUND);
        }

        // Enforce optimistic locking when applicable
        if (old instanceof BaseEntity) {
            if (old.version !== (obj as any).version) {
                throw new ApiError(ApiErrors.INVALID_OBJECT_VERSION, 409, ApiErrorMessages.INVALID_OBJECT_VERSION);
            }
        }

        // Make sure the object provided actually matches the id given
        if (old.uid !== obj.uid) {
            throw new ApiError(ApiErrors.OBJECT_ID_MISMATCH, 400, ApiErrorMessages.OBJECT_ID_MISMATCH);
        }

        // When using MongoDB we need to copy the _id property in order to prevent duplicate entries
        if (old instanceof BaseMongoEntity) {
            (obj as any)._id = old._id;
        }

        return obj;
    }
}
