///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2019 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { AccessControlList, ACLRecord } from "./AccessControlList";
import BaseEntity from "../models/BaseEntity";
import { Column, Entity, Index } from "typeorm";
import { Cache, Model } from "../decorators/ModelDecorators";

/**
 * Implementation of the `ACLRecord` interface for use with SQL databases.
 */
@Entity()
export class ACLRecordSQL implements ACLRecord {
    @Column()
    @Index()
    public userOrRoleId: string;

    @Column()
    public create: boolean | null;

    @Column()
    public read: boolean | null;

    @Column()
    public update: boolean | null;

    @Column()
    public delete: boolean | null;

    @Column()
    public special: boolean | null;

    @Column()
    public full: boolean | null;

    constructor(other?: any) {
        if (other) {
            this.userOrRoleId = other.userOrRoleId;
            this.create = other.create !== undefined ? other.create : null;
            this.read = other.read !== undefined ? other.read : null;
            this.update = other.update !== undefined ? other.update : null;
            this.delete = other.delete !== undefined ? other.delete : null;
            this.special = other.special !== undefined ? other.special : null;
            this.full = other.full !== undefined ? other.full : null;
        } else {
            throw new Error("Argument other cannot be null.");
        }
    }
}

/**
 * Implementation of the `AccessControlList` interface for use with SQL databases.
 */
@Model("acl")
@Entity()
@Cache()
export default class AccessControlListSQL extends BaseEntity implements AccessControlList {
    public parent?: AccessControlList;

    @Column()
    @Index()
    public parentUid?: string | undefined;

    @Column()
    public records: ACLRecordSQL[] = [];

    constructor(other?: any) {
        super(other);

        if (other) {
            this.parent = other.parent ? other.parent : this.parent;
            this.parentUid = other.parentUid ? other.parentUid : this.parentUid;
            this.records = other.records ? other.records : this.records;
        }
    }
}
