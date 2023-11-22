///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
const fs = require("fs");

import { default as config } from "./config";
import { Server } from "../src";
import { MongoMemoryServer } from "mongodb-memory-server";
import * as http from "http";
import * as sqlite3 from "sqlite3";
import * as uuid from "uuid";
import requestws from "superwstest";

import { JWTUtils } from "@composer-js/core";

const mongod: MongoMemoryServer = new MongoMemoryServer({
    instance: {
        port: 9999,
        dbName: "axr-test",
    },
});
const sqlite: sqlite3.Database = new sqlite3.Database(":memory:");
jest.setTimeout(60000);

describe("Server WebSocket Tests", () => {
    const server: Server = new Server(config, "./test/server");

    beforeAll(async () => {
        await mongod.start();
        await server.start();
    });

    afterAll(async () => {
        await server.stop();
        await mongod.stop();
        return new Promise<void>((resolve) => {
            sqlite.close(err => {
                resolve();
            });
        })
    });

    it("Can connect via unsecured WebSocket [anonymous]", async () => {
        expect(server.isRunning()).toBe(true);
        const httpServer: http.Server | undefined = server.getServer();
        if (httpServer) {
            await requestws(httpServer).ws('/connect')
                .expectText('hello guest')
                .sendText('ping')
                .expectText('echo ping')
                .sendText('pong')
                .expectText('echo pong')
                .close()
                .expectClosed();
        }
    });

    it("Can connect via unsecured WebSocket [user via header]", async () => {
        const user = { uid: uuid.v4() };
        const token = JWTUtils.createToken(config.get("auth"), user);
        expect(server.isRunning()).toBe(true);
        const httpServer: http.Server | undefined = server.getServer();
        if (httpServer) {
            await requestws(httpServer).ws('/connect', { headers: { Authorization: `jwt ${token}` } })
                .expectText('hello ' + user.uid)
                .sendText('ping')
                .expectText('echo ping')
                .sendText('pong')
                .expectText('echo pong')
                .close()
                .expectClosed();
        }
    });

    it("Can connect via unsecured WebSocket [user via handshake]", async () => {
        const user = { uid: uuid.v4() };
        const token = JWTUtils.createToken(config.get("auth"), user);
        expect(server.isRunning()).toBe(true);
        const httpServer: http.Server | undefined = server.getServer();
        if (httpServer) {
            await requestws(httpServer).ws('/connect')
                .sendJson({ id: 0, type: "LOGIN", data: token })
                .expectJson({ id: 0, type: "LOGIN_RESPONSE", success: true })
                .expectText('hello ' + user.uid)
                .sendText('ping')
                .expectText('echo ping')
                .sendText('pong')
                .expectText('echo pong')
                .close()
                .expectClosed();
        }
    });

    it("Cannot connect via secured WebSocket [anonymous]", async () => {
        expect(server.isRunning()).toBe(true);
        const httpServer: http.Server | undefined = server.getServer();
        if (httpServer) {
            await requestws(httpServer).ws('/connect-secure')
                .expectClosed();
        }
    });

    it("Can connect via secured WebSocket [user via header]", async () => {
        const user = { uid: uuid.v4() };
        const token = JWTUtils.createToken(config.get("auth"), user);
        expect(server.isRunning()).toBe(true);
        const httpServer: http.Server | undefined = server.getServer();
        if (httpServer) {
            await requestws(httpServer).ws('/connect-secure', { headers: { Authorization: `jwt ${token}` } })
                .expectText('hello ' + user.uid)
                .sendText('ping')
                .expectText('echo ping')
                .sendText('pong')
                .expectText('echo pong')
                .close()
                .expectClosed();
        }
    });

    it("Can connect via secured WebSocket [user via handshake]", async () => {
        const user = { uid: uuid.v4() };
        const token = JWTUtils.createToken(config.get("auth"), user);
        expect(server.isRunning()).toBe(true);
        const httpServer: http.Server | undefined = server.getServer();
        if (httpServer) {
            await requestws(httpServer).ws('/connect-secure')
                .sendJson({ id: 0, type: "LOGIN", data: token })
                .expectJson({ id: 0, type: "LOGIN_RESPONSE", success: true })
                .expectText('hello ' + user.uid)
                .sendText('ping')
                .expectText('echo ping')
                .sendText('pong')
                .expectText('echo pong')
                .close()
                .expectClosed();
        }
    });
});
