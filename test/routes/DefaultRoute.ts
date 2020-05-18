///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Route, Get, User, Init, Auth } from "../../src/decorators/RouteDecorators";
import { Logger } from "../../src/service_core";
import { AccessControlList } from "../../src/security/AccessControlList";

const logger = Logger();

@Route("/")
class DefaultRoute {
    /**
     * Initializes a new instance with the specified defaults.
     */
    constructor() {}

    protected getDefaultACL(): AccessControlList | undefined {
        return undefined;
    }

    @Init
    private async initialize() {}

    @Get("hello")
    protected async helloWorld(): Promise<any> {
        return { msg: "Hello World!" };
    }

    @Auth("jwt")
    @Get("token")
    protected async authToken(@User user?: any): Promise<any> {
        return user;
    }

    @Get("error")
    protected async throwError(): Promise<any> {
        let err: any = new Error("This is a test.");
        err.status = 400;
        throw err;
    }
}

export default DefaultRoute;
