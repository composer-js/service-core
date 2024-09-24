///////////////////////////////////////////////////////////////////////////////
// Copyright (C) Xsolla (USA), Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Request as XRequest, Response as XResponse } from "express";
import { AccessControlListSQL } from "./AccessControlListSQL";
import { MongoRepository as Repo } from "typeorm";
import { ACLAction } from "./AccessControlList";
import { ApiError, JWTUser, ObjectDecorators, UserUtils } from "@composer-js/core";
import { ACLUtils } from "./ACLUtils";
import { DatabaseDecorators, DocDecorators, RouteDecorators } from "../decorators";
import { ModelRoute } from "../routes/ModelRoute";
import { RepoUtils } from "../models";
import { ApiErrorMessages } from "../ApiErrors";
const { Repository } = DatabaseDecorators;
const { Description, Returns, TypeInfo } = DocDecorators;
const { Inject } = ObjectDecorators;
const { Auth, Delete, Get, Head, Model, Param, Post, Put, Query, Request, Response, Route, User } = RouteDecorators;

@Model(AccessControlListSQL)
@Route("/acls")
export class ACLRouteSQL extends ModelRoute<AccessControlListSQL> {
    @Inject(ACLUtils)
    protected aclUtils?: ACLUtils;

    @Repository(AccessControlListSQL)
    protected repo?: Repo<AccessControlListSQL>;

    protected repoUtils?: RepoUtils<AccessControlListSQL>;

    constructor() {
        super();
    }

    /**
     * The base key used to get or set data in the cache.
     */
    protected get baseCacheKey(): string {
        return "db.cache.AccessControlList";
    }

    @Description("Creates one or more access control lists.")
    @Auth(["jwt"])
    @Post()
    @TypeInfo([AccessControlListSQL, [Array, AccessControlListSQL]])
    @Returns([AccessControlListSQL, [Array, AccessControlListSQL]])
    private create(
        objs: AccessControlListSQL | AccessControlListSQL[],
        @Request req: XRequest,
        @User user?: JWTUser
    ): Promise<AccessControlListSQL | AccessControlListSQL[]> {
        if (!user || !UserUtils.hasRoles(user, this.config.get("trusted_roles"))) {
            throw new ApiError(ApiErrorMessages.AUTH_PERMISSION_FAILURE, 403, ApiErrorMessages.AUTH_PERMISSION_FAILURE);
        }
        return super.doCreate(objs, { user, recordEvent: true, req });
    }

    @Description("Saves modifications for the given collection of access control lists.")
    @Auth(["jwt"])
    @Put()
    @TypeInfo([[Array, AccessControlListSQL]])
    @Returns([[Array, AccessControlListSQL]])
    private updateBulk(
        objs: AccessControlListSQL[],
        @Request req: XRequest,
        @User user?: JWTUser
    ): Promise<AccessControlListSQL[]> {
        if (!user || !UserUtils.hasRoles(user, this.config.get("trusted_roles"))) {
            throw new ApiError(ApiErrorMessages.AUTH_PERMISSION_FAILURE, 403, ApiErrorMessages.AUTH_PERMISSION_FAILURE);
        }
        return super.doBulkUpdate(objs, { user, recordEvent: true, req });
    }

    @Description("Returns the total number of access control lists matching the given search criteria.")
    @Auth(["jwt"])
    @Head()
    @Returns([null])
    private count(
        @Param() params: any,
        @Query() query: any,
        @Response res: XResponse,
        @User user?: JWTUser
    ): Promise<any> {
        if (!user || !UserUtils.hasRoles(user, this.config.get("trusted_roles"))) {
            throw new ApiError(ApiErrorMessages.AUTH_PERMISSION_FAILURE, 403, ApiErrorMessages.AUTH_PERMISSION_FAILURE);
        }

        return super.doCount({ params, query, res, user });
    }

    @Description("Returns a collection of access control lists matching the given search criteria.")
    @Auth(["jwt"])
    @Get()
    @Returns([Array, AccessControlListSQL])
    private findAll(@Param() params: any, @Query() query: any, @User user?: JWTUser): Promise<AccessControlListSQL[]> {
        if (!user || !UserUtils.hasRoles(user, this.config.get("trusted_roles"))) {
            throw new ApiError(ApiErrorMessages.AUTH_PERMISSION_FAILURE, 403, ApiErrorMessages.AUTH_PERMISSION_FAILURE);
        }

        return super.doFindAll({ params, query, user });
    }

    @Description("Deletes the access control list with the given unique identifier and optional version.")
    @Auth(["jwt"])
    @Delete("/:id")
    @Returns([null])
    private delete(
        @Param("id") id: string,
        @Request req: XRequest,
        @Query("version") version: string,
        @User user?: JWTUser
    ): Promise<void> {
        if (
            !user ||
            (!UserUtils.hasRoles(user, this.config.get("trusted_roles")) &&
                !this.aclUtils?.hasPermission(user, id, ACLAction.FULL))
        ) {
            throw new ApiError(ApiErrorMessages.AUTH_PERMISSION_FAILURE, 403, ApiErrorMessages.AUTH_PERMISSION_FAILURE);
        }

        if (id.startsWith("default_")) {
            throw new ApiError(ApiErrorMessages.AUTH_PERMISSION_FAILURE, 403, ApiErrorMessages.AUTH_PERMISSION_FAILURE);
        }

        return super.doDelete(id, { version, user, recordEvent: true, req });
    }

    @Description("Returns the access control list with the given unique identifier.")
    @Auth(["jwt"])
    @Get("/:id")
    @Returns([AccessControlListSQL])
    private findById(
        @Param("id") id: string,
        @Query() query?: any,
        @User user?: any
    ): Promise<AccessControlListSQL | null> {
        if (
            !user ||
            (!UserUtils.hasRoles(user, this.config.get("trusted_roles")) &&
                !this.aclUtils?.hasPermission(user, id, ACLAction.FULL))
        ) {
            throw new ApiError(ApiErrorMessages.AUTH_PERMISSION_FAILURE, 403, ApiErrorMessages.AUTH_PERMISSION_FAILURE);
        }

        return super.doFindById(id, { query, user });
    }

    @Description("Saves modifications to existing access control list with the given unique identifier.")
    @Auth(["jwt"])
    @Put("/:id")
    @Returns([AccessControlListSQL])
    private update(
        @Param("id") id: string,
        obj: AccessControlListSQL,
        @Request req: XRequest,
        @User user?: JWTUser
    ): Promise<AccessControlListSQL> {
        if (
            !user ||
            (!UserUtils.hasRoles(user, this.config.get("trusted_roles")) &&
                !this.aclUtils?.hasPermission(user, id, ACLAction.FULL))
        ) {
            throw new ApiError(ApiErrorMessages.AUTH_PERMISSION_FAILURE, 403, ApiErrorMessages.AUTH_PERMISSION_FAILURE);
        }

        if (id.startsWith("default_")) {
            throw new ApiError(ApiErrorMessages.AUTH_PERMISSION_FAILURE, 403, ApiErrorMessages.AUTH_PERMISSION_FAILURE);
        }

        const acl: AccessControlListSQL = new AccessControlListSQL(obj);
        return super.doUpdate(id, acl, { user, recordEvent: true, req });
    }
}
