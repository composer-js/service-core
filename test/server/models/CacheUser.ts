import { BaseMongoEntity } from "../../../src/models/BaseMongoEntity";
import { Entity, Column } from "typeorm";
import { Cache, Model } from "../../../src/decorators/ModelDecorators";
import { Description } from "../../../src/decorators/DocDecorators";

@Model("mongodb")
@Entity()
@Cache()
@Description("The CacheUser class describes a user within the system that utilizes the second-level caching system.")
export default class CacheUser extends BaseMongoEntity {
    @Column()
    @Description("The first name of the user.")
    public firstName: string = "";

    @Column()
    @Description("The surname of the user.")
    public lastName: string = "";

    @Column()
    @Description("The age of the user.")
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
