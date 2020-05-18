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
    Before,
} from "../../src/decorators/RouteDecorators";
import { Model, MongoRepository } from "../../src/decorators/ModelDecorators";
import ModelRoute from "../../src/routes/ModelRoute";
import { Logger } from "../../src/service_core";
import UserModel from "../models/User";
import { MongoRepository as Repo } from "typeorm";
import { AccessControlList, ACLRecord } from "../../src/security/AccessControlList";

const logger = Logger();

@Model(UserModel)
@Route("/userswithacl")
class UserWithACLRoute extends ModelRoute<UserModel> {
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

    protected getDefaultACL(): AccessControlList | undefined {
        const records: ACLRecord[] = [];

        // Guests have create-only access
        records.push({
            userOrRoleId: "anonymous",
            create: true,
            read: false,
            update: false,
            delete: false,
            special: false,
            full: false,
        });

        // Everyone has read-only access
        records.push({
            userOrRoleId: ".*",
            create: false,
            read: true,
            update: false,
            delete: false,
            special: false,
            full: false,
        });

        return {
            uid: "User",
            dateCreated: new Date(),
            dateModified: new Date(),
            version: 0,
            records,
        };
    }

    @Get("count")
    protected async count(@Param() params: any, @Query() query: any, @User user?: any): Promise<any> {
        return await super.doCount(params, query, user);
    }

    @Post()
    @Validate("validate")
    protected async create(obj: UserModel, @User user?: any): Promise<UserModel> {
        const newObj: UserModel = new UserModel(obj);
        return await super.doCreate(newObj, user);
    }

    @Delete(":id")
    protected async delete(@Param("id") id: string, @User user?: any): Promise<void> {
        await super.doDelete(id, user);
    }

    @Get()
    protected async findAll(@Param() params: any, @Query() query: any, @User user?: any): Promise<UserModel[]> {
        return await super.doFindAll(params, query, user);
    }

    @Get(":id")
    protected async findById(@Param("id") id: string, @User user?: any): Promise<UserModel | void> {
        return await super.doFindById(id, user);
    }

    @Delete()
    protected async truncate(@User user?: any): Promise<void> {
        await super.doTruncate(user);
    }

    @Put(":id")
    @Before("validate")
    protected async update(@Param("id") id: string, obj: UserModel, @User user?: any): Promise<UserModel> {
        const newObj: UserModel = new UserModel(obj);
        return await super.doUpdate(id, newObj, user);
    }
}

export default UserWithACLRoute;
