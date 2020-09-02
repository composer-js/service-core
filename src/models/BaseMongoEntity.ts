///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2019 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { ObjectIdColumn } from "typeorm";
import { ObjectID } from "mongodb";
import BaseEntity from "./BaseEntity";

/**
 * Provides a common base class for all entity's that will be persisted with TypeORM in a MongoDB database.
 *
 * @author Jean-Philippe Steinmetz <info@acceleratxr.com>
 */
export default abstract class BaseMongoEntity extends BaseEntity {
    /**
     * The internal unique identifier used by MongoDB.
     */
    @ObjectIdColumn()
    public _id?: ObjectID;

    constructor(other?: any) {
        super(other);

        if (other) {
            this._id = other._id
                ? (typeof other._id === "string" || typeof other._id === "number"
                    ? new ObjectID(other._id)
                    : other._id
                  )
                : this._id;
        }
    }
}
