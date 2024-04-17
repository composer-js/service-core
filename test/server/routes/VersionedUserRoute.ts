///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import {
    Route,
    Get,
    Post,
    Validate,
    Delete,
    Head,
    Put,
    Param,
    User,
    Query,
    Response,
    Model
} from "../../../src/decorators/RouteDecorators";
import { ModelRoute } from "../../../src/routes/ModelRoute";
import { Logger } from "@composer-js/core";
import UserModel from "../models/VersionedUser";
import { MongoRepository as Repo } from "typeorm";
import { Response as XResponse } from "express";
import { MongoRepository } from "../../../src/decorators/DatabaseDecorators";
import { Init } from "../../../src/decorators/ObjectDecorators";
import { Description, Returns, TypeInfo } from "../../../src/decorators/DocDecorators";

const logger = Logger();

@Model(UserModel)
@Route("/versionedusers")
@Description("Handles processing of all HTTP requests for the path `/versionedusers`.")
class VersionedUserRoute extends ModelRoute<UserModel> {
    @MongoRepository(UserModel)
    protected repo?: Repo<UserModel>;

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

    private validate(obj: UserModel): void {
        if (!obj) {
            throw new Error("Did not receive object to validate");
        }
    }

    @Head()
    @Description("Returns the total number of user accounts matching the given search criteria.")
    @Returns([null])
    protected count(@Param() params: any, @Query() query: any, @Response res: XResponse, @User user?: any): Promise<any> {
        return super.doCount({ params, query, res, user });
    }

    @Post()
    @Validate("validate")
    @Description("Creates a new user account.")
    @TypeInfo([UserModel, [Array, UserModel]])
    @Returns([UserModel, [Array, UserModel]])
    protected create(obj: UserModel | UserModel[], @User user?: any): Promise<UserModel | UserModel[]> {
        return super.doCreate(obj, { user });
    }

    @Delete(":id")
    @Description("Deletes an existing user account.")
    @Returns([null])
    protected delete(@Param("id") id: string, @Query("version") version?: string, @Query("purge") purge: string = "false", @User user?: any): Promise<void> {
        return super.doDelete(id, { purge: purge === "true" ? true : false, version, user });
    }

    @Get()
    @Description("Returns all user accounts matching the given search criteria.")
    @Returns([[Array, UserModel]])
    protected findAll(@Param() params: any, @Query() query: any, @User user?: any): Promise<UserModel[]> {
        return super.doFindAll({ params, query, user });
    }

    @Get(":id")
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
    @Validate("validate")
    @Description("Updates an existing user account.")
    @TypeInfo([UserModel])
    @Returns([UserModel])
    protected update(@Param("id") id: string, obj: UserModel, @User user?: any): Promise<UserModel> {
        return super.doUpdate(id, obj, { user });
    }
}

export default VersionedUserRoute;
