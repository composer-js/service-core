///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
const fs = require("fs");

import { default as config } from "./config";
import { Server } from "../src";
import { MongoMemoryServer } from "mongodb-memory-server";
import * as http from "http";
import * as path from "path";
import * as sqlite3 from "sqlite3";
import * as uuid from "uuid";
import requestws from "superwstest";

import * as yamljs from "js-yaml";
import { JWTUtils } from "@composer-js/core";
import { sleep } from "@composer-js/core";

const mongod: MongoMemoryServer = new MongoMemoryServer({
    instance: {
        port: 9999,
        dbName: "axr-test",
    },
});
const sqlite: sqlite3.Database = new sqlite3.Database(":memory:");
jest.setTimeout(60000);

describe("Server Tests", () => {
    const apiSpec: any = yamljs.load(fs.readFileSync(path.resolve("./test/openapi.yaml"))); //OASUtils.loadSpec(path.resolve("./test/openapi.yaml"));
    expect(apiSpec).toBeDefined();

    const server: Server = new Server(config, apiSpec, "./test/server");

    beforeAll(async () => {
        await mongod.start();
    });

    afterAll(async () => {
        await mongod.stop();
        return new Promise<void>((resolve) => {
            sqlite.close(err => {
                resolve();
            });
        })
    });

    beforeEach(async () => {
        expect(server).toBeInstanceOf(Server);
        await server.start();
        // Wait a bit longer each time. This allows objects to finish initialization before we proceed.
        await sleep(1000);
    });

    afterEach(async () => {
        await server.stop();
        // Wait a bit longer each time. This allows objects to finish initialization before we proceed.
        await sleep(1000);
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

    it("Can connect via unsecured WebSocket [user]", async () => {
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

    it.skip("Cannot connect via secured WebSocket [anonymous]", async () => {
        expect(server.isRunning()).toBe(true);
        const httpServer: http.Server | undefined = server.getServer();
        if (httpServer) {
            await requestws(httpServer).ws('/connect-secure')
                .expectClosed();
        }
    });

    it("Can connect via secured WebSocket [user]", async () => {
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
});
