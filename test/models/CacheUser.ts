import BaseMongoEntity from "../../src/models/BaseMongoEntity";
import { Entity, Column, ObjectIdColumn, ObjectID, Index, PrimaryColumn } from "typeorm";
import { Identifier, Cache } from "../../src/decorators/ModelDecorators";
import * as uuid from "uuid";

@Entity()
@Cache()
export default class CacheUser extends BaseMongoEntity {
    @Column()
    public firstName: string = "";

    @Column()
    public lastName: string = "";

    @Column()
    public age: number = 0;

    constructor(other?: any) {
        super(other);

        if (other) {
            this.firstName = other.firstName ? other.firstName : this.firstName;
            this.lastName = other.lastName ? other.lastName : this.lastName;
            this.age = other.age ? other.age : this.age;
        }
    }
}
