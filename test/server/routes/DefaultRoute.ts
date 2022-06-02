///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Route, Get, User, Init, Auth, WebSocket, Socket } from "../../../src/decorators/RouteDecorators";
import { Logger } from "@composer-js/core";
import * as ws from "ws";

const logger = Logger();

@Route("/")
class DefaultRoute {
    /**
     * Initializes a new instance with the specified defaults.
     */
    constructor() {}

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

    @WebSocket("connect")
    protected wsConnect(@Socket ws: ws, @User user?: any): void {
        ws.on("message", (msg) => {
            ws.send(`echo ${msg}`);
        });
        ws.send(`hello ${user && user.uid ? user.uid : "guest"}`);
    }

    @Auth("jwt")
    @WebSocket("connect-secure")
    protected wsConnectSecure(@Socket ws: ws, @User user?: any): void {
        if (user) {
            ws.on("message", (msg) => {
                ws.send(`echo ${msg}`);
            });
            ws.send(`hello ${user.uid}`);
        } else {
            const error: any = new Error("No user authenticated.");
            error.status = 401;
            throw error;
        }
    }
}

export default DefaultRoute;
