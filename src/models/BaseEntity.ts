///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2019 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Identifier } from "../decorators/ModelDecorators";
import { Column, Index, PrimaryColumn } from "typeorm";
const uuid = require("uuid");

/**
 * Provides a common base class for all entity's that will be persisted with TypeORM.
 *
 * Note that the `@CreateDateColumn`, `@UpdateDateColumn`, and `@VersionColumn` decorators from TypeORM are not supported
 * because they are not implemented in TypeORM's MongoDB support. They are instead implemented directly by this
 * library as part of `ModelRoute`.
 *
 * @author Jean-Philippe Steinmetz <info@acceleratxr.com>
 */
export abstract class BaseEntity {
    /**
     * The universally unique identifier of the entity.
     */
    @Identifier
    @Index()
    @PrimaryColumn()
    public uid: string = uuid.v4();

    /**
     * The date and time that the entity was created.
     */
    @Column()
    public dateCreated: Date = new Date();

    /**
     * The date and time that the entity was last modified.
     */
    @Column()
    public dateModified: Date = new Date();

    /**
     * The optimistic lock version.
     */
    @Column()
    public version: number = 0;

    constructor(other?: any) {
        if (other) {
            this.uid = 'uid' in other ? other.uid : this.uid;
            this.dateCreated = 'dateCreated' in other ? new Date(other.dateCreated) : this.dateCreated;
            this.dateModified = 'dateModified' in other ? new Date(other.dateModified) : this.dateModified;
            this.version = 'version' in other ? other.version : this.version;
        }
    }
}
