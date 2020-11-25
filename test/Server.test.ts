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
        done();
    });

    afterEach(async (done: Function) => {
        await server.stop();
        done();
    });

    it("Can start server.", async (done: Function) => {
        expect(server.isRunning()).toBe(true);
        done();
    });

    it("Can stop server.", async (done: Function) => {
        expect(server.isRunning()).toBe(true);
        await server.stop();
        expect(server.isRunning()).toBe(false);
        done();
    });

    it("Can restart server.", async (done: Function) => {
        expect(server.isRunning()).toBe(true);
        await server.restart();
        expect(server.isRunning()).toBe(true);
        done();
    });

    it("Can serve index.", async (done: Function) => {
        expect(server.isRunning()).toBe(true);
        const result = await request(server.getApplication()).get("/");
        expect(result).toHaveProperty("status");
        expect(result.status).toBe(200);
        expect(result).toHaveProperty("body");
        expect(result.body).toHaveProperty("name");
        expect(result.body).toHaveProperty("version");
        done();
    });

    it("Can serve OpenAPI spec.", async (done: Function) => {
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
        done();
    });

    it("Can serve metrics.", async (done: Function) => {
        expect(server.isRunning()).toBe(true);
        const result = await request(server.getApplication()).get("/metrics");
        expect(result).toHaveProperty("status");
        expect(result.status).toBe(200);
        expect(result).toHaveProperty("text");
        expect(result.text).not.toHaveLength(0);
        done();
    });

    it("Can serve single metric.", async (done: Function) => {
        expect(server.isRunning()).toBe(true);
        const result = await request(server.getApplication()).get("/metrics/num_total_requests");
        expect(result).toHaveProperty("status");
        expect(result.status).toBe(200);
        expect(result).toHaveProperty("text");
        expect(result.text).not.toHaveLength(0);
        done();
    });

    it("Can serve hello world.", async (done: Function) => {
        expect(server.isRunning()).toBe(true);
        const result = await request(server.getApplication()).get("/hello");
        expect(result.status).toBe(200);
        expect(result.body).toBeDefined();
        expect(result.body.msg).toBe("Hello World!");
        done();
    });

    it("Can authorize user.", async (done: Function) => {
        const user = { uid: uuid.v4() };
        const token = JWTUtils.createToken(config.get("auth"), user);
        const result = await request(server.getApplication())
            .get("/token")
            .set("Authorization", "jwt " + token);
        expect(result.status).toBe(200);
        expect(result.body).toEqual(user);
        done();
    });

    it("Can authorize user with query param.", async (done: Function) => {
        const user = { uid: uuid.v4() };
        const token = JWTUtils.createToken(config.get("auth"), user);
        const result = await request(server.getApplication()).get("/token?jwt_token=" + token);
        expect(result.status).toBe(200);
        expect(result.body).toEqual(user);
        done();
    });

    it("Can handle error gracefully.", async (done: Function) => {
        expect(server.isRunning()).toBe(true);
        const result = await request(server.getApplication()).get("/error");
        expect(result.status).toBe(400);
        expect(result.body.status).toBeDefined();
        done();
    });
});
