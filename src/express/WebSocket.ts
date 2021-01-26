///////////////////////////////////////////////////////////////////////////////
// Copyright (C) AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Server, ServerResponse } from "http";
import { Application, Request, Response } from "express";
import WebSocket, { Server as WebSocketServer } from "ws";

/**
 * HTTP request type for handling WebSockets.
 */
export interface RequestWS extends Request {
    /**
     * The associated WebSocket connection with this request.
     */
    websocket: WebSocket | undefined;

    /**
     * Indicates if the request is a websocket request that has been handled.
     */
    wsHandled: boolean;
}

/**
 * Enables and registers WebSocket support to the given Expressjs application and HTTP server.
 *
 * @param app The Expressjs application to add WebSocket support to.
 * @param server The HTTP server that will be bound to.
 * @param options An optional set of configuration options to apply to the WebSocket server.
 */
export default function addWebSocket(app: Application, server: Server, options: WebSocket.ServerOptions = {}): any {
    // Create the WebSocket server
    const wss: WebSocketServer = new WebSocketServer({
        ...options,
        server,
    });

    wss.on("connection", (socket: WebSocket, request: RequestWS) => {
        // Set the socket onto the request so that the Express handler has access to it
        request.websocket = socket;
        // We add `.websocket` to the url to let Express know this is a websocket specific request. Any handlers
        // marked with the @WebSocket decorator will have registered their paths this way too.
        request.url += ".websocket";

        const response: ServerResponse = new ServerResponse(request);
        // Shouldn't need to cast `response` as any here but for some reason compiler isn't liking it
        // despite the function declaration clearly accepting the `ServerResponse` type.
        app(request, response as any, (err: any) => {
            // If `wsHandled` is not set to true or an error was thrown then we did not handle the WebSocket request properly.
            // Close the connection and exit.
            if (err || !request.wsHandled) {
                socket.close();
            }
        });
    });

    return app;
}
