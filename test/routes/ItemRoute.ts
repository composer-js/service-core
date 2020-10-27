///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Query, Param, Route, User, Get, Post, Validate, Delete, Put, Model, Repository } from "../../src/decorators/RouteDecorators";
import ModelRoute from "../../src/routes/ModelRoute";
import Item from "../models/Item";
import { Repository as Repo } from "typeorm";
import { AccessControlList } from "../../src/security/AccessControlList";

@Model(Item)
@Route("/items")
class ItemRoute extends ModelRoute<Item> {
    @Repository(Item)
    protected repo?: Repo<Item>;

    /**
     * Initializes a new instance with the specified defaults.
     */
    constructor() {
        super();
    }

    private validate(obj: Item): void {
        if (!obj) {
            throw new Error("Did not receive object to validate");
        }
    }

    protected getDefaultACL(): AccessControlList | undefined {
        return undefined;
    }

    @Get("count")
    protected async count(@Param() params: any, @Query() query: any, @User user?: any): Promise<any> {
        return await super.doCount(params, query, user);
    }

    @Post()
    @Validate("validate")
    protected async create(obj: Item, @User user?: any): Promise<Item> {
        const newObj: Item = new Item(obj);
        return await super.doCreate(newObj, user);
    }

    @Delete(":id")
    protected async delete(@Param("id") id: string, @User user?: any): Promise<void> {
        await super.doDelete(id, user);
    }

    @Get()
    protected async findAll(@Param() params: any, @Query() query: any, @User user?: any): Promise<Item[]> {
        return await super.doFindAll(params, query, user);
    }

    @Get(":id")
    protected async findById(@Param("id") id: string, @User user?: any): Promise<Item | void> {
        return await super.doFindById(id, user);
    }

    @Delete()
    protected async truncate(@User user?: any): Promise<void> {
        await super.doTruncate(user);
    }

    @Put(":id")
    @Validate("validate")
    protected async update(@Param("id") id: string, obj: Item, @User user?: any): Promise<Item> {
        const newObj: Item = new Item(obj);
        return await super.doUpdate(id, newObj, user);
    }
}

export default ItemRoute;
