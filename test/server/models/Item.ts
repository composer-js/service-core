import { BaseEntity } from "../../../src/models/BaseEntity";
import { Entity, Column, Index } from "typeorm";
import { Identifier, Model } from "../../../src/decorators/ModelDecorators";

@Model("sqlite")
@Entity()
export default class Item extends BaseEntity {
    @Identifier
    @Index()
    @Column()
    public name: string = "";

    @Column()
    public quantity: number = 0;

    @Column()
    public cost: number = 0;

    constructor(other?: any) {
        super(other);

        if (other) {
            this.name = other.name;
            this.quantity = other.quantity;
            this.cost = other.cost;
        }
    }
}
