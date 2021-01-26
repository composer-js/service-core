///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
const fs = require("fs");

import { default as config } from "./config";
import { Server } from "../src/service_core";
import { MongoMemoryServer } from "mongodb-memory-server";
import * as path from "path";
import * as request from "supertest";
import * as sqlite3 from "sqlite3";
import * as uuid from "uuid";
import requestws from "superwstest";

import * as yamljs from "js-yaml";
import { JWTUtils } from "@composer-js/core";

const mongod: MongoMemoryServer = new MongoMemoryServer({
    instance: {
        port: 9999,
        dbName: "axr-test",
    },
    autoStart: false,
});
const sqlite: sqlite3.Database = new sqlite3.Database(":memory:");
jest.setTimeout(60000);

describe("Server Tests", () => {
    const apiSpec: any = yamljs.safeLoad(fs.readFileSync(path.resolve("./test/openapi.yaml"))); //OASUtils.loadSpec(path.resolve("./test/openapi.yaml"));
    expect(apiSpec).toBeDefined();

    const server: Server = new Server(config, apiSpec, "./test");

    beforeAll(async () => {
        await mongod.start();
    });

    afterAll(async done => {
        await mongod.stop();
        sqlite.close(err => {
            done();
        });
    });

    beforeEach(async (done: Function) => {
        expect(server).toBeInstanceOf(Server);
        await server.start();
        // Wait a bit longer each time. This allows objects to finish initialization before we proceed.
        setTimeout(done, 1000);
        //done();
    });

    afterEach(async (done: Function) => {
        await server.stop();
        done();
    });

    it("Can connect via unsecured WebSocket [anonymous]", async () => {
        expect(server.isRunning()).toBe(true);
        await requestws(server.getServer()).ws('/connect')
            .expectText('hello guest')
            .sendText('ping')
            .expectText('echo ping')
            .sendText('pong')
            .expectText('echo pong')
            .close()
            .expectClosed();
    });

    it("Can connect via unsecured WebSocket [user]", async () => {
        const user = { uid: uuid.v4() };
        const token = JWTUtils.createToken(config.get("auth"), user);
        expect(server.isRunning()).toBe(true);
        await requestws(server.getServer()).ws('/connect', { headers: { Authorization: `jwt ${token}` }})
            .expectText('hello ' + user.uid)
            .sendText('ping')
            .expectText('echo ping')
            .sendText('pong')
            .expectText('echo pong')
            .close()
            .expectClosed();
    });

    it("Cannot connect via secured WebSocket [anonymous]", async () => {
        expect(server.isRunning()).toBe(true);
        await requestws(server.getServer()).ws('/connect-secure')
            .expectClosed();
    });

    it("Can connect via secured WebSocket [user]", async () => {
        const user = { uid: uuid.v4() };
        const token = JWTUtils.createToken(config.get("auth"), user);
        expect(server.isRunning()).toBe(true);
        await requestws(server.getServer()).ws('/connect-secure', { headers: { Authorization: `jwt ${token}` }})
            .expectText('hello ' + user.uid)
            .sendText('ping')
            .expectText('echo ping')
            .sendText('pong')
            .expectText('echo pong')
            .close()
            .expectClosed();
    });
});
