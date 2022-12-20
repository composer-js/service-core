///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Query, Param, Route, User, Get, Head, Post, Response, Validate, Delete, Put, Model, Repository } from "../../../src/decorators/RouteDecorators";
import { ModelRoute } from "../../../src/routes/ModelRoute";
import Item from "../models/Item";
import { Repository as Repo } from "typeorm";
import { Response as XResponse } from "express";

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

    @Head()
    protected async count(@Param() params: any, @Query() query: any, @Response res: XResponse, @User user?: any): Promise<any> {
        return await super.doCount({ params, query, res, user });
    }

    @Post()
    @Validate("validate")
    protected async create(obj: Item | Item[], @User user?: any): Promise<Item | Item[]> {
        return await super.doCreate(obj, { user });
    }

    @Delete(":id")
    protected async delete(@Param("id") id: string, @User user?: any): Promise<void> {
        await super.doDelete(id, { user });
    }

    @Get()
    protected async findAll(@Param() params: any, @Query() query: any, @User user?: any): Promise<Item[]> {
        return await super.doFindAll({ params, query, user });
    }

    @Get(":id")
    protected async findById(@Param("id") id: string, @Query() query: any, @User user?: any): Promise<Item | null> {
        return await super.doFindById(id, { query, user });
    }

    @Delete()
    protected async truncate(@Param() params: any, @Query() query: any, @User user?: any): Promise<void> {
        await super.doTruncate({ params, query, user });
    }

    @Put(":id")
    @Validate("validate")
    protected async update(@Param("id") id: string, obj: Item, @User user?: any): Promise<Item> {
        const newObj: Item = new Item(obj);
        return await super.doUpdate(id, newObj, { user });
    }
}

export default ItemRoute;
