///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import {
    Route,
    Get,
    Post,
    Validate,
    Delete,
    Put,
    Param,
    User,
    Query,
    Init,
} from "../../src/decorators/RouteDecorators";
import { Model, MongoRepository } from "../../src/decorators/ModelDecorators";
import ModelRoute from "../../src/routes/ModelRoute";
import { Logger } from "@composer-js/core";
import UserModel from "../models/VersionedUser";
import { MongoRepository as Repo } from "typeorm";
import { AccessControlList } from "../../src/security/AccessControlList";

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

    protected getDefaultACL(): AccessControlList | undefined {
        return undefined;
    }

    private validate(obj: UserModel): void {
        if (!obj) {
            throw new Error("Did not receive object to validate");
        }
    }

    @Get("count")
    protected async count(@Param() params: any, @Query() query: any, @User user?: any): Promise<any> {
        return await super.doCount(params, query, user);
    }

    @Post()
    @Validate("validate")
    protected async create(obj: UserModel, @User user?: any): Promise<UserModel> {
        return await super.doCreate(obj, user);
    }

    @Delete(":id")
    protected async delete(@Param("id") id: string, @User user?: any): Promise<void> {
        await super.doDelete(id, user);
    }

    @Delete(":id/version/:version")
    protected async deleteVersion(@Param("id") id: string, @Param("version") version: string, @User user?: any): Promise<void> {
        await super.doDeleteVersion(id, parseInt(version), user);
    }

    @Get()
    protected async findAll(@Param() params: any, @Query() query: any, @User user?: any): Promise<UserModel[]> {
        return await super.doFindAll(params, query, user);
    }

    @Get(":id")
    protected async findById(@Param("id") id: string, @User user?: any): Promise<UserModel | void> {
        return await super.doFindById(id, user);
    }

    @Get(":id/version/:version")
    protected async findByIdAndVersion(@Param("id") id: string, @Param("version") version: string, @User user?: any): Promise<UserModel | void> {
        return await super.doFindByIdAndVersion(id, parseInt(version), user);
    }

    @Delete()
    protected async truncate(@User user?: any): Promise<void> {
        await super.doTruncate(user);
    }

    @Put(":id")
    @Validate("validate")
    protected async update(@Param("id") id: string, obj: UserModel, @User user?: any): Promise<UserModel> {
        return await super.doUpdate(id, obj, user);
    }
}

export default VersionedUserRoute;
