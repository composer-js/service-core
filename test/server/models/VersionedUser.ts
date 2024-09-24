///////////////////////////////////////////////////////////////////////////////
// Copyright (C) Xsolla (USA), Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Entity, Column, Index } from "typeorm";
import { Identifier, DataStore, TrackChanges } from "../../../src/decorators/ModelDecorators";
import { RecoverableBaseMongoEntity } from "../../../src/models";
import { Description } from "../../../src/decorators/DocDecorators";

@DataStore("mongodb")
@Entity()
@TrackChanges()
@Description("The User class describes a user within the system that utilizes document versioning.")
export default class VersionedUser extends RecoverableBaseMongoEntity {
    @Identifier
    @Index()
    @Column()
    @Description("The unique identifier of the user.")
    public name: string = "";

    @Column()
    @Description("The first name of the user.")
    public firstName: string = "";

    @Column()
    @Description("The surname of the user.")
    public lastName: string = "";

    @Column()
    @Description("The age of the user.")
    public age: number = 0;

    constructor(other?: Partial<VersionedUser>) {
        super(other);

        if (other) {
            this.name = other.name || this.name;
            this.firstName = other.firstName || this.firstName;
            this.lastName = other.lastName || this.lastName;
            this.age = other.age || this.age;
        }
    }
}
