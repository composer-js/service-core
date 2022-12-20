import { BaseMongoEntity } from "../../../src/models/BaseMongoEntity";
import { Entity, Column } from "typeorm";
import { Cache, Model } from "../../../src/decorators/ModelDecorators";

@Model("mongodb")
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
            this.firstName = 'firstName' in other ? other.firstName : this.firstName;
            this.lastName = 'lastName' in other ? other.lastName : this.lastName;
            this.age = 'age' in other ? other.age : this.age;
        }
    }
}
