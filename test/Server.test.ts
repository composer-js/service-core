///////////////////////////////////////////////////////////////////////////////
// Copyright (C) Xsolla (USA), Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
const corsOrigins = ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"];
process.env[`cors__origins`] = JSON.stringify(corsOrigins);

import * as fs from "fs";
import { default as config } from "./config";
import { Server, ObjectFactory } from "../src";
import { MongoMemoryServer } from "mongodb-memory-server";
import * as request from "supertest";
import * as sqlite3 from "sqlite3";
import * as uuid from "uuid";

import { JWTUtils, Logger, sleep } from "@composer-js/core";
import { StatusExtraData } from "../src/models/StatusExtraData";

const unixLineEndings = (input: string): string => {
    return input.replace(/\r\n/g, "\n");
};

const mongod: MongoMemoryServer = new MongoMemoryServer({
    instance: {
        port: 9999,
        dbName: "mongomemory-cjs-test",
    },
});
const sqlite: sqlite3.Database = new sqlite3.Database(":memory:");
jest.setTimeout(1200000);
const regenOpenapiFile = process.env["XBE_REGEN"] || false;
describe("Server Tests", () => {
    const objectFactory: ObjectFactory = new ObjectFactory(config, Logger());
    const server: Server = new Server(config, "./test/server", Logger(), objectFactory);

    beforeAll(async () => {
        await mongod.start();
    });

    afterAll(async () => {
        await mongod.stop();
        await new Promise<void>((resolve) => {
            sqlite.close((err) => {
                if (err) {
                    throw new Error(err.message);
                }
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
        // Cors Check
        let result = await request(server.getApplication()).options("/").set("Origin", corsOrigins[0]);
        expect(result.headers["access-control-allow-origin"]).toEqual(corsOrigins[0]);
        result = await request(server.getApplication()).options("/").set("Origin", "http://localhost:3005");
        expect(result.headers["access-control-allow-origin"]).not.toBeDefined();
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

    it("Can serve status.", async () => {
        expect(server.isRunning()).toBe(true);
        const result = await request(server.getApplication()).get("/status");
        expect(result).toHaveProperty("status");
        expect(result.status).toBe(200);
        expect(result).toHaveProperty("body");
        expect(result.body).toHaveProperty("name");
        expect(result.body).toHaveProperty("version");
    });

    it("Can serve status, with data updates.", async () => {
        const statusExtraData: StatusExtraData = await objectFactory.newInstance(StatusExtraData, { name: "default" });
        statusExtraData.data = {
            test: "Updates"
        };
        expect(server.isRunning()).toBe(true);
        const result = await request(server.getApplication()).get("/status");
        expect(result).toHaveProperty("status");
        expect(result.status).toBe(200);
        expect(result).toHaveProperty("body");
        expect(result.body).toHaveProperty("name");
        expect(result.body).toHaveProperty("version");
        expect(result.body.test).toBe("Updates");
    });

    it("Can serve OpenAPI spec.", async () => {
        expect(server.isRunning()).toBe(true);
        const result = await request(server.getApplication()).get("/openapi.json");
        expect(result).toHaveProperty("status");
        expect(result.type).toBe("application/json");
        expect(result.status).toBe(200);
        expect(result).toHaveProperty("body");
        expect(result.body.openapi).toBe("3.1.0");

        const result2 = await request(server.getApplication()).get("/openapi.yaml");
        expect(result2).toHaveProperty("status");
        expect(result2.status).toBe(200);
        expect(result2).toHaveProperty("text");
        expect(result2.type).toBe("text/yaml");

        if (regenOpenapiFile) {
            fs.writeFileSync(`./test/openapi.yaml`, result2.text);
        }
        // Even with dynamic , leverage test to validate OpenApiSpec isn't broken
        // TODO: Possibly validate parts of JSON spec to better isolate errors and allow for date to be moved around 
        const testFile: string = fs.readFileSync("./test/openapi.yaml").toString("utf-8");
        expect(unixLineEndings(result2.text)).toEqual(unixLineEndings(testFile));

        const result3 = await request(server.getApplication()).get("/api-docs");
        expect(result3).toHaveProperty("status");
        expect(result3.status).toBe(200);
        expect(result3).toHaveProperty("body");
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
        const user: any = { uid: uuid.v4() };
        const token = JWTUtils.createToken(config.get("auth"), user);
        const result = await request(server.getApplication())
            .get("/token")
            .set("Authorization", "jwt " + token);
        expect(result.status).toBe(200);
        expect(result.body).toEqual(user);
    });

    it("Can authorize user with query param.", async () => {
        const user: any = { uid: uuid.v4() };
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
