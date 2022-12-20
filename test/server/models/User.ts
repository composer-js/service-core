import { BaseMongoEntity } from "../../../src/models/BaseMongoEntity";
import { Index, Entity, Column } from "typeorm";
import { Identifier, Model } from "../../../src/decorators/ModelDecorators";

@Model("mongodb")
@Entity()
export default class User extends BaseMongoEntity {
    @Identifier
    @Index()
    @Column()
    public name: string = "";

    @Column()
    public firstName: string = "";

    @Column()
    public lastName: string = "";

    @Column()
    public age: number = 0;

    @Identifier
    @Index()
    @Column()
    public productUid: string | undefined = undefined;

    constructor(other?: any) {
        super(other);

        if (other) {
            this.name = 'name' in other ? other.name : this.name;
            this.firstName = 'firstName' in other ? other.firstName : this.firstName;
            this.lastName = 'lastName' in other ? other.lastName : this.lastName;
            this.age = 'age' in other ? other.age : this.age;
            this.productUid = 'productUid' in other ? other.productUid : this.productUid;
        }
    }
}
