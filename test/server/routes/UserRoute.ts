///////////////////////////////////////////////////////////////////////////////
// Copyright (C) Xsolla (USA), Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import {
    After,
    Before,
    Route,
    Get,
    Param,
    Post,
    Validate,
    Delete,
    Head,
    Put,
    Query,
    Model,
    Request,
    Response,
    User,
} from "../../../src/decorators/RouteDecorators";
import { ModelRoute } from "../../../src/routes/ModelRoute";
import { Logger, ObjectDecorators } from "@composer-js/core";
import UserModel from "../models/User";
import { MongoRepository as Repo } from "typeorm";
import { Request as XRequest, Response as XResponse } from "express";
import { MongoRepository } from "../../../src/decorators/DatabaseDecorators";
import { Description, Returns, TypeInfo } from "../../../src/decorators/DocDecorators";
import { RepoUtils } from "../../../src";
import Player from "../models/Player";
const { Init } = ObjectDecorators;

const logger = Logger();

@Model(UserModel)
@Route("/users")
@Description("Handles processing of all HTTP requests for the path `/users`.")
class UserRoute extends ModelRoute<UserModel> {
    protected repoUtils?: RepoUtils<UserModel>;

    @MongoRepository(UserModel)
    protected repo?: Repo<UserModel | Player>;

    /**
     * Initializes a new instance with the specified defaults.
     */
    constructor() {
        super();
    }

    @Init
    private async initialize() {
        if (this.repo) {
            logger.info("Calling init counting users " + (await this.repo.count()));
        }
    }

    private validate(obj: UserModel | UserModel[]): void {
        if (!obj) {
            throw new Error("Did not receive object to validate");
        }
    }

    private cleanPII(obj: UserModel, @User user?: any): UserModel {
        if (!user) {
            obj.firstName = "";
            obj.lastName = "";
        }
        return obj;
    }

    @Head()
    @Description("Returns the total number of user accounts matching the given search criteria.")
    @Returns([null])
    protected count(
        @Param() params: any,
        @Query() query: any,
        @Response res: XResponse,
        @User user?: any
    ): Promise<any> {
        return super.doCount({ params, query, res, user });
    }

    @Post()
    @Validate("validate")
    @Description("Creates a new user account.")
    @TypeInfo([UserModel, [Array, UserModel]])
    @Returns([UserModel, [Array, UserModel]])
    protected create(
        objs: UserModel | UserModel[],
        @Request req: XRequest,
        @User user?: any
    ): Promise<UserModel | UserModel[]> {
        return super.doCreate(objs, { req, user });
    }

    @Put()
    @Validate("validate")
    @Description("Updates multiple user accounts in bulk.")
    @TypeInfo([[Array, UserModel]])
    @Returns([[Array, UserModel]])
    protected updateBulk(objs: UserModel[], @User user?: any): Promise<UserModel[]> {
        return super.doBulkUpdate(objs, { user });
    }

    @Delete(":id")
    @Description("Deletes an existing user account.")
    @Returns([null])
    protected async delete(@Param("id") id: string, @User user?: any): Promise<void> {
        await super.doDelete(id, { user });
    }

    @Head(":id")
    @Description(
        "Returns a boolean integer indicating whether or not a user account with the given unique identifier exists."
    )
    @Returns([null])
    protected exists(
        @Param("id") id: string,
        @Query() query: any,
        @Response res: XResponse,
        @User user?: any
    ): Promise<any> {
        return super.doExists(id, { query, res, user });
    }

    @Get()
    @Description("Returns all user accounts matching the given search criteria.")
    @Returns([[Array, UserModel]])
    protected findAll(@Param() params: any, @Query() query: any, @User user?: any): Promise<UserModel[]> {
        return super.doFindAll({ params, query, user });
    }

    @Get(":id")
    @After("cleanPII")
    @Description("Returns the user account with the given unique identifier.")
    @Returns([UserModel])
    protected findById(@Param("id") id: string, @Query() query: any, @User user?: any): Promise<UserModel | null> {
        return super.doFindById(id, { query, user });
    }

    @Delete()
    @Description("Deletes all existing user accounts matching the given search criteria.")
    @Returns([null])
    protected truncate(@Param() params: any, @Query() query: any, @User user?: any): Promise<void> {
        return super.doTruncate({ params, query, user });
    }

    @Put(":id")
    @Before("validate")
    @Description("Updates an existing user account.")
    protected update(@Param("id") id: string, obj: UserModel, @User user?: any): Promise<UserModel> {
        return super.doUpdate(id, obj, { user });
    }

    @Put(":id/:property")
    @Before("validate")
    @Description("Updates a single property of an existing user account.")
    @TypeInfo([Object])
    @Returns([UserModel])
    protected updateProperty(
        @Param("id") id: string,
        @Param("property") propertyName: string,
        obj: any,
        @User user?: any
    ): Promise<UserModel> {
        return super.doUpdateProperty(id, propertyName, obj, { user });
    }
}

export default UserRoute;
