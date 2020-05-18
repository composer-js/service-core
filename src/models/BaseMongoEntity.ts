///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2019 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { ObjectID, ObjectIdColumn } from "typeorm";
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
            this._id = other._id ? other._id : this._id;
        }
    }
}
