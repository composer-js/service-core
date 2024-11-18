///////////////////////////////////////////////////////////////////////////////
// Copyright (C) Xsolla (USA), Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Column } from "typeorm";
import { ChildEntity, Reference } from "../../../src/decorators/ModelDecorators";
import { Description } from "../../../src/decorators/DocDecorators";
import Item from "./Item";
import User from "./User";
import { ObjectDecorators } from "@composer-js/core";
const { Nullable } = ObjectDecorators;

@ChildEntity()
@Description("The player of a game.")
export default class Player extends User {
    @Description("The skill ranking of the player.")
    @Column()
    public skillRating: number = 1500;

    @Description("The unique identifier of the item associated with this player.")
    @Reference(Item)
    @Nullable
    itemUid?: string;

    constructor(other?: Partial<Player>) {
        super(other);

        if (other) {
            this.skillRating = other.skillRating || this.skillRating;
            this.itemUid = "itemUid" in other ? other.itemUid : this.itemUid;
        }
    }
}
