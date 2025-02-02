///////////////////////////////////////////////////////////////////////////////
// Copyright (C) Xsolla (USA), Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { ObjectIdColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { ObjectId } from "mongodb";
import { ObjectDecorators } from "@composer-js/core";
const { Nullable } = ObjectDecorators;

/**
 * Provides a common base class for all entity's that will be persisted with TypeORM in a MongoDB database.
 *
 * @author Jean-Philippe Steinmetz <info@acceleratxr.com>
 */
export abstract class BaseMongoEntity extends BaseEntity {
    /**
     * The internal unique identifier used by MongoDB.
     */
    @ObjectIdColumn()
    @Nullable
    public _id?: any;

    constructor(other?: Partial<BaseMongoEntity>) {
        super(other);

        if (other) {
            this._id = other._id
                ? typeof other._id === "string" || typeof other._id === "number"
                    ? new ObjectId(other._id)
                    : other._id
                : this._id;
        }
    }
}
