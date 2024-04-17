///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Route, Get, User, Auth, WebSocket, Socket, Query } from "../../../src/decorators/RouteDecorators";
import { ApiError, Logger } from "@composer-js/core";
import { Init } from "../../../src/decorators/ObjectDecorators";
import * as ws from "ws";
import { Description, Returns } from "../../../src/decorators/DocDecorators";
import { ApiErrors, ApiErrorMessages } from "../../../src/ApiErrors";

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
        throw new ApiError(ApiErrors.INVALID_REQUEST, 400, "This is a test.");
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
            throw new ApiError(ApiErrors.AUTH_REQUIRED, 401, ApiErrorMessages.AUTH_REQUIRED);
        }
    }

    @WebSocket("connect-query")
    @Description("Establishes a socket connection that responds to all messages with the query message and message `echo ${message} ${msg}` or `echo ${msg}`.")
    protected wsConnectQuery(@Query("message") message, @Socket ws: ws, @User user?: any): void {
        ws.on("message", (msg) => {
            ws.send(`echo ${message ? `${message} ` : ''}${msg}`);
        });
        ws.send(`hello ${user && user.uid ? user.uid : "guest"}`);
    }
}

export default DefaultRoute;
