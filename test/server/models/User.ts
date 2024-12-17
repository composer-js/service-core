///////////////////////////////////////////////////////////////////////////////
// Copyright (C) Xsolla (USA), Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { BaseMongoEntity } from "../../../src/models/BaseMongoEntity";
import { Index, Entity, Column } from "typeorm";
import { Identifier, DataStore } from "../../../src/decorators/ModelDecorators";
import { Description, TypeInfo } from "../../../src/decorators/DocDecorators";
import { ObjectDecorators, ValidationUtils } from "@composer-js/core";
const { Nullable, Validator } = ObjectDecorators;

@DataStore("mongodb")
@Entity()
@Description("The User class describes a user within the system.")
export default class User extends BaseMongoEntity {
    @Identifier
    @Index()
    @Column()
    @Description("The unique identifier of the user.")
    @Validator(ValidationUtils.checkName)
    public name: string = "";

    @Column()
    @Description("The first name of the user.")
    public firstName: string = "";

    @Column()
    @Description("The surname of the user.")
    public lastName: string = "";

    @Column()
    @Description("The age of the user. Must be 13 or older.")
    // TODO  @Validator(ValidationUtils.check((val) => val >= 13))
    public age: number = 0;

    @Identifier
    @Index()
    @Column()
    @Description("The uuid of the product that is associated with this user.")
    @Nullable
    public productUid: string | undefined = undefined;

    @Column()
    @TypeInfo([String, Number, undefined])
    @Nullable
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
