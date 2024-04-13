///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Route, Get, User, Init, Auth, WebSocket, Socket } from "../../../src/decorators/RouteDecorators";
import { Logger } from "@composer-js/core";
import * as ws from "ws";
import { Description, Returns } from "../../../src/decorators/DocDecorators";

const logger = Logger();

@Route("/")
@Description("Handles processing of all HTTP requests to the `/` path.")
class DefaultRoute {
    /**
     * Initializes a new instance with the specified defaults.
     */
    constructor() { 
        // NO-OP
    }

    @Init
    private async initialize() { 
        // NO-OP
    }

    @Get("hello")
    @Description("Returns `Hello World!`.")
    @Returns([Object])
    protected async helloWorld(): Promise<any> {
        return { msg: "Hello World!" };
    }

    @Auth(["jwt"])
    @Get("token")
    @Description("Returns the user data for a valid authenticated user.")
    @Returns([Object])
    protected async authToken(@User user?: any): Promise<any> {
        return user;
    }

    @Get("error")
    @Description("Throws a 400-level error and returns the error as the response body.")
    @Returns([null])
    protected async throwError(): Promise<any> {
        let err: any = new Error("This is a test.");
        err.status = 400;
        throw err;
    }

    @WebSocket("connect")
    @Description("Establishes a socket connection that responds to all messages with `echo ${msg}`.")
    protected wsConnect(@Socket ws: ws, @User user?: any): void {
        ws.on("message", (msg) => {
            ws.send(`echo ${msg}`);
        });
        ws.send(`hello ${user && user.uid ? user.uid : "guest"}`);
    }

    @Auth(["jwt"])
    @WebSocket("connect-secure")
    @Description("Establishes a secured socket connection that responds to all messages with `echo ${msg}`.")
    protected wsConnectSecure(@Socket ws: ws, @User user?: any): void {
        if (user) {
            ws.on("message", (msg) => {
                ws.send(`echo ${msg}`);
            });
            ws.send(`hello ${user.uid}`);
        } else {
            const error: ApiError = new ApiError("No user authenticated.");
            error.status = 401;
            throw error;
        }
    }
}

export default DefaultRoute;
