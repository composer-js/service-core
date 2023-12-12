import { BaseMongoEntity } from "../../../src/models/BaseMongoEntity";
import { Index, Entity, Column } from "typeorm";
import { Identifier, Model } from "../../../src/decorators/ModelDecorators";
import { Description, TypeInfo } from "../../../src/decorators/DocDecorators";

@Model("mongodb")
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
