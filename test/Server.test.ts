///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
const fs = require("fs");

import { default as config } from "./config";
import { Server, ObjectFactory } from "../src/service_core";
import { MongoMemoryServer } from "mongodb-memory-server";
import * as path from "path";
import * as request from "supertest";
import * as sqlite3 from "sqlite3";
import * as uuid from "uuid";
import { LicenseManager } from "@acceleratxr/licensing";
import * as rimraf from "rimraf";

import * as yamljs from "js-yaml";
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
    const apiSpec: any = yamljs.load(fs.readFileSync(path.resolve("./test/openapi.yaml"))); //OASUtils.loadSpec(path.resolve("./test/openapi.yaml"));
    expect(apiSpec).toBeDefined();

    const objectFactory: ObjectFactory = new ObjectFactory(config, Logger());
    const server: Server = new Server(config, apiSpec, "./test/server", Logger(), objectFactory);

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

    it("Can serve protected hello world to anonymous.", async () => {
        expect(server.isRunning()).toBe(true);
        const result = await request(server.getApplication()).get("/protected/hello");
        expect(result.status).toBe(200);
        expect(result.body).toBeDefined();
        expect(result.body.msg).toBe("Hello World!");
    });

    it("Can perform required role check.", async () => {
        const user = { uid: uuid.v4(), roles: ['test'] };
        const token = JWTUtils.createToken(config.get("auth"), user);
        expect(server.isRunning()).toBe(true);
        const result = await request(server.getApplication())
            .get("/protected/roletest")
            .set("Authorization", "jwt " + token);
        expect(result.status).toBe(200);
        expect(result.body).toBeDefined();
        expect(result.body.msg).toBe("success");
    });

    it("Can fail required role check.", async () => {
        const user = { uid: uuid.v4() };
        const token = JWTUtils.createToken(config.get("auth"), user);
        expect(server.isRunning()).toBe(true);
        const result = await request(server.getApplication())
            .get("/protected/roletest")
            .set("Authorization", "jwt " + token);
        expect(result.status).toBe(403);
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

    it("Can serve protected foobar to user.", async () => {
        const user = { uid: uuid.v4() };
        const token = JWTUtils.createToken(config.get("auth"), user);
        expect(server.isRunning()).toBe(true);
        const result = await request(server.getApplication()).get("/protected/foobar").set("Authorization", `jwt ${token}`);
        expect(result).toHaveProperty("status");
        expect(result.status).toBe(200);
        expect(result).toHaveProperty("body");
        expect(result.body.msg).toBe("foobar");
    });

    // TODO Disabling for now. It works standalone but not when all tests are run.
    it.skip("Cannot serve protected foobar to anonymous.", async () => {
        expect(server.isRunning()).toBe(true);
        const result = await request(server.getApplication()).get("/protected/foobar");
        expect(result).toHaveProperty("status");
        expect(result.status).toBe(403);
    });

    it("Can handle error gracefully.", async () => {
        expect(server.isRunning()).toBe(true);
        const result = await request(server.getApplication()).get("/error");
        expect(result.status).toBe(400);
        expect(result.body.status).toBeDefined();
    });

    it.skip("Cannot start server without valid license.", async () => {
        expect(server.isRunning()).toBe(true);
        await server.stop();
        expect(server.isRunning()).toBe(false);
        jest.spyOn(LicenseManager, "verify").mockImplementation(() => Promise.reject());
        let didThrow: boolean = false;
        try {
            await server.start();
        } catch (err) {
            didThrow = true;
        }
        expect(didThrow).toBe(true);
        expect(server.isRunning()).toBe(false);
    });
});
