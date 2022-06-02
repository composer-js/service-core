///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Repository, MongoRepository } from "typeorm";
import { ModelUtils } from "../models/ModelUtils";
import { BaseEntity } from "../models/BaseEntity";
import { SimpleEntity } from "../models/SimpleEntity";
import { BaseMongoEntity } from "../models/BaseMongoEntity";

/**
 * @author Jean-Philippe Steinmetz
 */
export class RepoUtils {
    /**
     * Verify object does not exist and update required fields for BaseEntity
     * @param repo Repository used to verify no existing object
     * @param obj Object that exentds BaseEntity or SimpleEntity
     */
    public static async preprocessBeforeSave<T extends BaseEntity | SimpleEntity>(
        repo: Repository<T> | MongoRepository<T>,
        obj: T
    ): Promise<T> {
        if (!repo) {
            throw new Error("Repository not set or could not be found.");
        }

        // Make sure an existing object doesn't already exist with the same identifiers
        const ids: any[] = [];
        const idProps: string[] = ModelUtils.getIdPropertyNames(obj.constructor);
        for (const prop of idProps) {
            ids.push((obj as any)[prop]);
        }
        const query: any = ModelUtils.buildIdSearchQuery(repo, obj.constructor, ids, obj instanceof BaseEntity ? obj.version : undefined);
        const existing: T | undefined = await repo.findOne(query);
        if (existing) {
            const error: any = new Error("An existing object with this identifier already exists.");
            error.status = 400;
            throw error;
        }

        // Override the date and version fields with their defaults
        if (obj instanceof BaseEntity) {
            obj.dateCreated = new Date();
            obj.dateModified = new Date();
            obj.version = 0;
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
        old?: T
    ): Promise<T> {
        if (!repo) {
            throw new Error("Repository not set or could not be found.");
        }

        if (!old) {
            const query: any = ModelUtils.buildIdSearchQuery(repo, modelClass, obj.uid);
            old = await repo.findOne(query);
        }
        if (!old) {
            const error: any = new Error("No object with that id could be found.");
            error.status = 404;
            throw error;
        }

        // Enforce optimistic locking when applicable
        if (old instanceof BaseEntity) {
            if (old.version != (obj as any).version) {
                const error: any = new Error("Invalid object version. Do you have the latest version?");
                error.status = 409;
                throw error;
            }
        }

        // Make sure the object provided actually matches the id given
        if (old.uid != obj.uid) {
            const error: any = new Error("The object provided does not match the identifier given.");
            error.status = 400;
            throw error;
        }

        // When using MongoDB we need to copy the _id property in order to prevent duplicate entries
        if (old instanceof BaseMongoEntity) {
            (obj as any)._id = old._id;
        }

        return obj;
    }
}
