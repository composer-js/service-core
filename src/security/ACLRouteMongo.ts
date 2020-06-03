///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Delete, Get, Param, Post, Put, Query, Route, User } from "../decorators/RouteDecorators";
import { Config } from "../decorators/ObjectDecorators";
import { MongoRepository, Model } from "../decorators/ModelDecorators";
import AccessControlListMongo from "./AccessControlListMongo";
import { MongoRepository as Repo } from "typeorm";
import ModelRoute from "../routes/ModelRoute";
import { ACLUtils } from "../service_core";
import { ACLAction, AccessControlList } from "./AccessControlList";
import { JWTUser, UserUtils } from "@composer-js/core";

@Model(AccessControlListMongo)
@Route("/acls")
export default class ACLRouteMongo extends ModelRoute<AccessControlListMongo> {
    @Config
    private config?: any;

    @MongoRepository(AccessControlListMongo)
    protected repo?: Repo<AccessControlListMongo>;

    constructor() {
        super();
    }

    /**
     * The base key used to get or set data in the cache.
     */
    protected get baseCacheKey(): string {
        return "db.cache.AccessControlList";
    }

    protected getDefaultACL(): AccessControlList | undefined {
        // We return undefined here because we'll cover permissions directly
        return undefined;
    }

    @Post()
    private create(obj: AccessControlListMongo, @User user?: JWTUser): Promise<AccessControlListMongo> {
        if (!user || !UserUtils.hasRoles(user, this.config.get("trusted_roles"))) {
            const error: any = new Error("User does not have permission to perform this action.");
            error.status = 403;
            throw error;
        }

        const acl: AccessControlListMongo = new AccessControlListMongo(obj);
        return super.doCreate(acl, user);
    }

    @Delete("/:id")
    private delete(@Param("id") id: string, @User user?: JWTUser): Promise<void> {
        if (
            !user ||
            (!UserUtils.hasRoles(user, this.config.get("trusted_roles")) &&
                !ACLUtils.hasPermission(user, id, ACLAction.FULL))
        ) {
            const error: any = new Error("User does not have permission to perform this action.");
            error.status = 403;
            throw error;
        }

        if (id.startsWith("default_")) {
            const error: any = new Error("User does not have permission to perform this action.");
            error.status = 403;
            throw error;
        }

        return super.doDelete(id, user);
    }

    @Get()
    private findAll(
        @Param() params: any,
        @Query() query: any,
        @User user?: JWTUser
    ): Promise<AccessControlListMongo[]> {
        if (!user || !UserUtils.hasRoles(user, this.config.get("trusted_roles"))) {
            const error: any = new Error("User does not have permission to perform this action.");
            error.status = 403;
            throw error;
        }

        return super.doFindAll(params, query, user);
    }

    @Get("/:id")
    private findById(@Param("id") id: string, @User user?: any): Promise<AccessControlListMongo | undefined> {
        if (
            !user ||
            (!UserUtils.hasRoles(user, this.config.get("trusted_roles")) &&
                !ACLUtils.hasPermission(user, id, ACLAction.FULL))
        ) {
            const error: any = new Error("User does not have permission to perform this action.");
            error.status = 403;
            throw error;
        }

        return super.doFindById(id, user);
    }

    @Put("/:id")
    private update(
        @Param("id") id: string,
        obj: AccessControlListMongo,
        @User user?: JWTUser
    ): Promise<AccessControlListMongo> {
        if (
            !user ||
            (!UserUtils.hasRoles(user, this.config.get("trusted_roles")) &&
                !ACLUtils.hasPermission(user, id, ACLAction.FULL))
        ) {
            const error: any = new Error("User does not have permission to perform this action.");
            error.status = 403;
            throw error;
        }

        if (id.startsWith("default_")) {
            const error: any = new Error("User does not have permission to perform this action.");
            error.status = 403;
            throw error;
        }

        const acl: AccessControlListMongo = new AccessControlListMongo(obj);
        return super.doUpdate(id, acl, user);
    }
}
