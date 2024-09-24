///////////////////////////////////////////////////////////////////////////////
// Copyright (C) Xsolla (USA), Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

/**
 * The `RecoverableBaseEntity` provides an entity base class for those classes wishing to implement
 * soft delete capability. A soft delete means that a delete operation does not remove the entity
 * from the database but instead simply marks it as deleted. To completely remove the entity from
 * the database the user must explicitly specify the entity to be purged.
 *
 * @author Jean-Philippe Steinmetz <info@acceleratxr.com>
 */
export abstract class RecoverableBaseEntity extends BaseEntity {
    /**
     * Indicates if the document has been soft deleted.
     */
    @Column()
    public deleted: boolean = false;

    constructor(other?: Partial<RecoverableBaseEntity>) {
        super(other);

        if (other) {
            this.deleted = other.deleted || this.deleted;
        }
    }
}
