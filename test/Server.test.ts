///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
const fs = require("fs");

import { default as config } from "./config";
import { Server, ObjectFactory } from "../src";
import { MongoMemoryServer } from "mongodb-memory-server";
import * as request from "supertest";
import * as sqlite3 from "sqlite3";
import * as uuid from "uuid";
import * as rimraf from "rimraf";

import { JWTUtils, Logger } from "@composer-js/core";
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
    const objectFactory: ObjectFactory = new ObjectFactory(config, Logger());
    const server: Server = new Server(config, "./test/server", Logger(), objectFactory);

    beforeAll(async () => {
        await mongod.start();
    });

    afterAll(async () => {
        await mongod.stop();
        return new Promise<void>((resolve) => {
            sqlite.close(err => {
                rimraf.sync("tmp-*");
                resolve();
            });
        });
    });

    beforeEach(async () => {
        expect(server).toBeInstanceOf(Server);
        await server.start();
        // Wait a bit longer each time. This allows objects to finish initialization before we proceed.
        await sleep(1000);
    });

    afterEach(async () => {
        await server.stop();
    });

    it("Can start server.", async () => {
        expect(server.isRunning()).toBe(true);
    });

    it("Can stop server.", async () => {
        expect(server.isRunning()).toBe(true);
        await server.stop();
        expect(server.isRunning()).toBe(false);
    });

    it("Can restart server.", async () => {
        expect(server.isRunning()).toBe(true);
        await server.restart();
        expect(server.isRunning()).toBe(true);
    });

    it("Can serve index.", async () => {
        expect(server.isRunning()).toBe(true);
        const result = await request(server.getApplication()).get("/");
        expect(result).toHaveProperty("status");
        expect(result.status).toBe(200);
        expect(result).toHaveProperty("body");
        expect(result.body).toHaveProperty("name");
        expect(result.body).toHaveProperty("version");
    });

    it("Can serve OpenAPI spec.", async () => {
        expect(server.isRunning()).toBe(true);
        const result = await request(server.getApplication()).get("/openapi.json");
        expect(result).toHaveProperty("status");
        expect(result.status).toBe(200);
        expect(result).toHaveProperty("body");
        expect(result.body).toEqual(apiSpec);

        const result2 = await request(server.getApplication()).get("/api-docs");
        expect(result2).toHaveProperty("status");
        expect(result2.status).toBe(200);
        expect(result2).toHaveProperty("body");
    });

    it("Can serve metrics.", async () => {
        expect(server.isRunning()).toBe(true);
        const result = await request(server.getApplication()).get("/metrics");
        expect(result).toHaveProperty("status");
        expect(result.status).toBe(200);
        expect(result).toHaveProperty("text");
        expect(result.text).not.toHaveLength(0);
    });

    it("Can serve single metric.", async () => {
        expect(server.isRunning()).toBe(true);
        const result = await request(server.getApplication()).get("/metrics/num_total_requests");
        expect(result).toHaveProperty("status");
        expect(result.status).toBe(200);
        expect(result).toHaveProperty("text");
        expect(result.text).not.toHaveLength(0);
    });

    it("Can serve hello world.", async () => {
        expect(server.isRunning()).toBe(true);
        const result = await request(server.getApplication()).get("/hello");
        expect(result.status).toBe(200);
        expect(result.body).toBeDefined();
        expect(result.body.msg).toBe("Hello World!");
    });

    it("Can authorize user.", async () => {
        const user = { uid: uuid.v4() };
        const token = JWTUtils.createToken(config.get("auth"), user);
        const result = await request(server.getApplication())
            .get("/token")
            .set("Authorization", "jwt " + token);
        expect(result.status).toBe(200);
        expect(result.body).toEqual(user);
    });

    it("Can authorize user with query param.", async () => {
        const user = { uid: uuid.v4() };
        const token = JWTUtils.createToken(config.get("auth"), user);
        const result = await request(server.getApplication()).get("/token?jwt_token=" + token);
        expect(result.status).toBe(200);
        expect(result.body).toEqual(user);
    });

    it("Can handle error gracefully.", async () => {
        expect(server.isRunning()).toBe(true);
        const result = await request(server.getApplication()).get("/error");
        expect(result.status).toBe(400);
        expect(result.body.status).toBeDefined();
    });
});
