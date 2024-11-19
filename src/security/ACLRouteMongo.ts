///////////////////////////////////////////////////////////////////////////////
// Copyright (C) Xsolla (USA), Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Request as XRequest, Response as XResponse } from "express";
import { AccessControlListMongo } from "./AccessControlListMongo";
import { MongoRepository as Repo } from "typeorm";
import { ACLAction } from "./AccessControlList";
import { ApiError, JWTUser, UserUtils } from "@composer-js/core";
import { DatabaseDecorators, DocDecorators, RouteDecorators } from "../decorators";
import { ModelRoute } from "../routes/ModelRoute";
import { RepoUtils } from "../models";
import { ApiErrorMessages } from "../ApiErrors";
const { MongoRepository } = DatabaseDecorators;
const { Description, Returns, TypeInfo } = DocDecorators;
const { Auth, Delete, Get, Head, Model, Param, Post, Put, Query, Request, Response, Route, User } = RouteDecorators;

@Model(AccessControlListMongo)
@Route("/acls")
export class ACLRouteMongo extends ModelRoute<AccessControlListMongo> {
    @MongoRepository(AccessControlListMongo)
    protected repo?: Repo<AccessControlListMongo>;

    protected readonly repoUtilsClass: any = RepoUtils;

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
    @TypeInfo([AccessControlListMongo, [Array, AccessControlListMongo]])
    @Returns([AccessControlListMongo, [Array, AccessControlListMongo]])
    private create(
        objs: AccessControlListMongo | AccessControlListMongo[],
        @Request req: XRequest,
        @User user?: JWTUser
    ): Promise<AccessControlListMongo | AccessControlListMongo[]> {
        if (!user || !UserUtils.hasRoles(user, this.config.get("trusted_roles"))) {
            throw new ApiError(ApiErrorMessages.AUTH_PERMISSION_FAILURE, 403, ApiErrorMessages.AUTH_PERMISSION_FAILURE);
        }
        return super.doCreate(objs, { user, recordEvent: true, req });
    }

    @Description("Saves modifications for the given collection of access control lists.")
    @Auth(["jwt"])
    @Put()
    @TypeInfo([[Array, AccessControlListMongo]])
    @Returns([[Array, AccessControlListMongo]])
    private updateBulk(
        objs: AccessControlListMongo[],
        @Request req: XRequest,
        @User user?: JWTUser
    ): Promise<AccessControlListMongo[]> {
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
    @Returns([Array, AccessControlListMongo])
    private findAll(
        @Param() params: any,
        @Query() query: any,
        @User user?: JWTUser
    ): Promise<AccessControlListMongo[]> {
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
    @Returns([AccessControlListMongo])
    private findById(
        @Param("id") id: string,
        @Query() query?: any,
        @User user?: any
    ): Promise<AccessControlListMongo | null> {
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
    @Returns([AccessControlListMongo])
    private update(
        @Param("id") id: string,
        obj: AccessControlListMongo,
        @Request req: XRequest,
        @User user?: JWTUser
    ): Promise<AccessControlListMongo> {
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

        const acl: AccessControlListMongo = new AccessControlListMongo(obj);
        return super.doUpdate(id, acl, { user, recordEvent: true, req });
    }
}
