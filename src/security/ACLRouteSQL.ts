///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Delete, Get, Repository, Model, Param, Post, Put, Query, Route, User } from "../decorators/RouteDecorators";
import { Config } from "../decorators/ObjectDecorators";
import AccessControlListSQL from "./AccessControlListSQL";
import { Repository as Repo } from "typeorm";
import ModelRoute from "../routes/ModelRoute";
import { JWTUser, UserUtils } from "@composer-js/core";
import { ACLAction, AccessControlList } from "./AccessControlList";
import { ACLUtils } from "../service_core";

@Model(AccessControlListSQL)
@Route("/acls")
export default class ACLRouteSQL extends ModelRoute<AccessControlListSQL> {
    @Config()
    private config?: any;

    @Repository(AccessControlListSQL)
    protected repo?: Repo<AccessControlListSQL>;

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
    private create(obj: AccessControlListSQL, @User user?: JWTUser): Promise<AccessControlListSQL> {
        if (!user || !UserUtils.hasRoles(user, this.config.get("trusted_roles"))) {
            const error: any = new Error("User does not have permission to perform this action.");
            error.status = 403;
            throw error;
        }

        const acl: AccessControlListSQL = new AccessControlListSQL(obj);
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
    private findAll(@Param() params: any, @Query() query: any, @User user?: JWTUser): Promise<AccessControlListSQL[]> {
        if (!user || !UserUtils.hasRoles(user, this.config.get("trusted_roles"))) {
            const error: any = new Error("User does not have permission to perform this action.");
            error.status = 403;
            throw error;
        }

        return super.doFindAll(params, query, user);
    }

    @Get("/:id")
    private findById(@Param("id") id: string, @User user?: any): Promise<AccessControlListSQL | undefined> {
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
        obj: AccessControlListSQL,
        @User user?: JWTUser
    ): Promise<AccessControlListSQL> {
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

        const acl: AccessControlListSQL = new AccessControlListSQL(obj);
        return super.doUpdate(id, acl, user);
    }
}
