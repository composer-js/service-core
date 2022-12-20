import { Entity, Column, Index } from "typeorm";
import { Identifier, Model, TrackChanges } from "../../../src/decorators/ModelDecorators";
import { RecoverableBaseMongoEntity } from "../../../src/models";

@Model("mongodb")
@Entity()
@TrackChanges()
export default class VersionedUser extends RecoverableBaseMongoEntity {
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

    constructor(other?: any) {
        super(other);

        if (other) {
            this.name = 'name' in other ? other.name : this.name;
            this.firstName = 'firstName' in other ? other.firstName : this.firstName;
            this.lastName = 'lastName' in other ? other.lastName : this.lastName;
            this.age = 'age' in other ? other.age : this.age;
        }
    }
}
