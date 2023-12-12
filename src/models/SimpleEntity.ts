///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2019 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Default, Description } from "../decorators/DocDecorators";
import { Identifier } from "../decorators/ModelDecorators";
import { Index, PrimaryColumn } from "typeorm";
const uuid = require("uuid");

/**
 * Provides a simple base class for all entity's that will be persisted with TypeORM. Unlike `BaseEntity` this class
 * does not provide optimistic locking or date created and modified tracking.
 *
 * @author Jean-Philippe Steinmetz <info@acceleratxr.com>
 */
export abstract class SimpleEntity {
    /**
     * The universally unique identifier of the entity.
     */
    @Description("The universally unique identifier of the entity.")
    @Default("randomUUID()")
    @Identifier
    @Index()
    @PrimaryColumn()
    public uid: string = uuid.v4();

    constructor(other?: any) {
        if (other) {
            this.uid = 'uid' in other ? other.uid : this.uid;
        }
    }
}
