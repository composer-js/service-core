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
    Init,
    Before,
    Model,
    MongoRepository,
    Request,
    Response,
    After
} from "../../../src/decorators/RouteDecorators";
import { ModelRoute } from "../../../src/routes/ModelRoute";
import { Logger } from "@composer-js/core";
import UserModel from "../models/User";
import { MongoRepository as Repo } from "typeorm";
import { Request as XRequest, Response as XResponse } from "express";

const logger = Logger();

@Model(UserModel)
@Route("/users")
class UserRoute extends ModelRoute<UserModel> {
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
    protected count(@Param() params: any, @Query() query: any, @Response res: XResponse, @User user?: any): Promise<any> {
        return super.doCount({ params, query, res, user });
    }

    @Post()
    @Validate("validate")
    protected create(objs: UserModel | UserModel[], @Request req: XRequest, @User user?: any): Promise<UserModel | UserModel[]> {
        return super.doCreate(objs, { req, user });
    }

    @Put()
    @Validate("validate")
    protected updateBulk(objs: UserModel[], @User user?: any): Promise<UserModel[]> {
        return super.doBulkUpdate(objs, { user });
    }

    @Delete(":id")
    protected async delete(@Param("id") id: string, @User user?: any): Promise<void> {
        await super.doDelete(id, { user });
    }

    @Head(":id")
    protected exists(@Param("id") id: string, @Query() query: any, @Response res: XResponse, @User user?: any): Promise<any> {
        return super.doExists(id, { query, res, user });
    }

    @Get()
    protected findAll(@Param() params: any, @Query() query: any, @User user?: any): Promise<UserModel[]> {
        return super.doFindAll({ params, query, user });
    }

    @Get(":id")
    @After("cleanPII")
    protected findById(@Param("id") id: string, @Query() query: any, @User user?: any): Promise<UserModel | null> {
        return super.doFindById(id, { query, user });
    }

    @Delete()
    protected truncate(@Param() params: any, @Query() query: any, @User user?: any): Promise<void> {
        return super.doTruncate({ params, query, user });
    }

    @Put(":id")
    @Before("validate")
    protected update(@Param("id") id: string, obj: UserModel, @User user?: any): Promise<UserModel> {
        return super.doUpdate(id, obj, { user });
    }

    @Put(":id/:property")
    @Before("validate")
    protected updateProperty(@Param("id") id: string, @Param("property") propertyName: string, obj: any, @User user?: any): Promise<UserModel> {
        return super.doUpdateProperty(id, propertyName, obj, { user });
    }
}

export default UserRoute;
