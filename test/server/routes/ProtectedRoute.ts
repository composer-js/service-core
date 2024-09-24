///////////////////////////////////////////////////////////////////////////////
// Copyright (C) Xsolla (USA), Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Logger } from "@composer-js/core";
import { RouteDecorators } from "../../../src/decorators";
const { Auth, Get, Protect, RequiresRole, Route, User } = RouteDecorators;

const logger = Logger();

@Route("/protected")
@Protect({
    records: [
        {
            userOrRoleId: "anonymous",
            create: false,
            read: false,
            update: false,
            delete: false,
            special: false,
            full: false,
        },
        {
            userOrRoleId: ".*",
            create: true,
            read: true,
            update: true,
            delete: true,
            special: false,
            full: false,
        },
    ],
})
class ProtectedDefaultRoute {
    @Get("hello")
    @Protect({
        uid: "",
        records: [
            {
                userOrRoleId: "anonymous",
                create: true,
                read: true,
                update: true,
                delete: true,
                special: true,
                full: true,
            },
            {
                userOrRoleId: ".*",
                create: true,
                read: true,
                update: true,
                delete: true,
                special: false,
                full: false,
            },
        ],
    })
    protected helloWorld(): any {
        return { msg: "Hello World!" };
    }

    @Get("foobar")
    protected foobar(): any {
        return { msg: "foobar" };
    }

    @RequiresRole("test")
    @Get("roletest")
    protected roletest(): any {
        return { msg: "success" };
    }

    @Auth(["jwt"])
    @Get("token")
    protected async authToken(@User user?: any): Promise<any> {
        return user;
    }
}

export default ProtectedDefaultRoute;
