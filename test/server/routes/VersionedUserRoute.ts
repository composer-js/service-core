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
    Init,
    Model
} from "../../../src/decorators/RouteDecorators";
import { ModelRoute } from "../../../src/routes/ModelRoute";
import { Logger } from "@composer-js/core";
import UserModel from "../models/VersionedUser";
import { MongoRepository as Repo } from "typeorm";
import { Response as XResponse } from "express";
import { MongoRepository } from "../../../src/decorators/DatabaseDecorators";

const logger = Logger();

@Model(UserModel)
@Route("/versionedusers")
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
    protected async count(@Param() params: any, @Query() query: any, @Response res: XResponse, @User user?: any): Promise<any> {
        return await super.doCount({ params, query, res, user });
    }

    @Post()
    @Validate("validate")
    protected async create(obj: UserModel | UserModel[], @User user?: any): Promise<UserModel | UserModel[]> {
        return await super.doCreate(obj, { user });
    }

    @Delete(":id")
    protected async delete(@Param("id") id: string, @Query("version") version?: string, @Query("purge") purge: string = "false", @User user?: any): Promise<void> {
        await super.doDelete(id, { purge: purge === "true" ? true : false, version, user });
    }

    @Get()
    protected async findAll(@Param() params: any, @Query() query: any, @User user?: any): Promise<UserModel[]> {
        return await super.doFindAll({ params, query, user });
    }

    @Get(":id")
    protected async findById(@Param("id") id: string, @Query() query: any, @User user?: any): Promise<UserModel | null> {
        return await super.doFindById(id, { query, user });
    }

    @Delete()
    protected async truncate(@Param() params: any, @Query() query: any, @User user?: any): Promise<void> {
        await super.doTruncate({ params, query, user });
    }

    @Put(":id")
    @Validate("validate")
    protected async update(@Param("id") id: string, obj: UserModel, @User user?: any): Promise<UserModel> {
        return await super.doUpdate(id, obj, { user });
    }
}

export default VersionedUserRoute;
