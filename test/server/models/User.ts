///////////////////////////////////////////////////////////////////////////////
// Copyright (C) Xsolla (USA), Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { BaseMongoEntity } from "../../../src/models/BaseMongoEntity";
import { Index, Entity, Column } from "typeorm";
import { Identifier, DataStore } from "../../../src/decorators/ModelDecorators";
import { Description, TypeInfo } from "../../../src/decorators/DocDecorators";

@DataStore("mongodb")
@Entity()
@Description("The User class describes a user within the system.")
export default class User extends BaseMongoEntity {
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

    @Identifier
    @Index()
    @Column()
    @Description("The uuid of the product that is associated with this user.")
    public productUid: string | undefined = undefined;

    @Column()
    @TypeInfo([String, Number, undefined])
    public uType: string | number | undefined = undefined;

    constructor(other?: Partial<User>) {
        super(other);

        if (other) {
            this.name = other.name || this.name;
            this.firstName = other.firstName || this.firstName;
            this.lastName = other.lastName || this.lastName;
            this.age = other.age || this.age;
            this.productUid = other.productUid || this.productUid;
        }
    }
}
