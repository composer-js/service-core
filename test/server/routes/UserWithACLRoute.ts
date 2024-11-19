///////////////////////////////////////////////////////////////////////////////
// Copyright (C) Xsolla (USA), Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Logger, ObjectDecorators } from "@composer-js/core";
import UserModel from "../models/ProtectedUser";
import { Response as XResponse } from "express";
import { RouteDecorators } from "../../../src/decorators";
import { ModelRoute } from "../../../src/routes/ModelRoute";
import { RepoUtils } from "../../../src/models";
const { Init } = ObjectDecorators;
const { Route, Get, Post, Validate, Delete, Head, Put, Param, User, Query, Response, Before, Model } = RouteDecorators;

const logger = Logger();

@Model(UserModel)
@Route("/userswithacl")
class UserWithACLRoute extends ModelRoute<UserModel> {
    protected readonly repoUtilsClass: any = RepoUtils;

    /**
     * Initializes a new instance with the specified defaults.
     */
    constructor() {
        super();
    }

    private validate(obj: UserModel): void {
        if (!obj) {
            throw new Error("Did not receive object to validate");
        }
    }

    @Head()
    protected async count(
        @Param() params: any,
        @Query() query: any,
        @Response res: XResponse,
        @User user?: any
    ): Promise<any> {
        return await super.doCount({ params, query, res, user });
    }

    @Post()
    @Validate("validate")
    protected async create(obj: UserModel | UserModel[], @User user?: any): Promise<UserModel | UserModel[]> {
        return await super.doCreate(obj, { user });
    }

    @Delete(":id")
    protected async delete(@Param("id") id: string, @User user?: any): Promise<void> {
        await super.doDelete(id, { user });
    }

    @Get()
    protected async findAll(@Param() params: any, @Query() query: any, @User user?: any): Promise<UserModel[]> {
        return await super.doFindAll({ params, query, user });
    }

    @Get(":id")
    protected async findById(
        @Param("id") id: string,
        @Query() query: any,
        @User user?: any
    ): Promise<UserModel | null> {
        return await super.doFindById(id, { query, user });
    }

    @Delete()
    protected async truncate(@Param() params: any, @Query() query: any, @User user?: any): Promise<void> {
        await super.doTruncate({ params, query, user });
    }

    @Put(":id")
    @Before("validate")
    protected async update(@Param("id") id: string, obj: UserModel, @User user?: any): Promise<UserModel> {
        const newObj: UserModel = new UserModel(obj);
        return await super.doUpdate(id, newObj, { user });
    }
}

export default UserWithACLRoute;
