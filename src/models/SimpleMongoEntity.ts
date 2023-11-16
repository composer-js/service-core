///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2019 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { ObjectId } from "mongodb";
import { SimpleEntity } from "./SimpleEntity";
import { ObjectIdColumn } from "typeorm";

/**
 * Provides a simple base class for all entity's that will be persisted with TypeORM in a MongoDB database. Unlike
 * `BaseMongoEntity` this class does not provide optimistic locking or date created and modified tracking.
 *
 * @author Jean-Philippe Steinmetz <info@acceleratxr.com>
 */
export abstract class SimpleMongoEntity extends SimpleEntity {
    /**
     * The internal unique identifier used by MongoDB.
     */
    @ObjectIdColumn()
    public _id?: ObjectId;

    constructor(other?: any) {
        super(other);

        if (other) {
            this._id = other._id ? other._id : this._id;
        }
    }
}
