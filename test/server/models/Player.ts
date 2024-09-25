///////////////////////////////////////////////////////////////////////////////
// Copyright (C) Xsolla (USA), Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Column } from "typeorm";
import { ChildEntity } from "../../../src/decorators/ModelDecorators";
import { Description } from "../../../src/decorators/DocDecorators";
import User from "./User";

@ChildEntity()
@Description("The player of a game.")
export default class Player extends User {
    @Description("The skill ranking of the player.")
    @Column()
    public skillRating: number = 1500;

    constructor(other?: Partial<Player>) {
        super(other);

        if (other) {
            this.skillRating = other.skillRating || this.skillRating;
        }
    }
}
