///////////////////////////////////////////////////////////////////////////////
// Copyright (C) Xsolla USA, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
const fs = require("fs");
// This mock MUST be defined before we import ConnectionManager (or anything that pulls it in such as Server)
jest.mock('ioredis', () => {
    const RedisMock = require('ioredis-mock');
    return {
        __esModule: true,
        default: RedisMock,
        createClient: jest.fn(),
    };
});

import { default as config } from "./config";
import { Server } from "../src";
import { MongoMemoryServer } from "mongodb-memory-server";
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

describe("AdminRoute Tests", () => {
    const basePath = "/admin";
    const apiSpec: any = yamljs.load(fs.readFileSync(path.resolve("./test/openapi.yaml"))); //OASUtils.loadSpec(path.resolve("./test/openapi.yaml"));
    expect(apiSpec).toBeDefined();
    const server: Server = new Server(config, apiSpec, "./test/server");
    const serviceName: string = config.get("service_name");
    const admin: any = {
        uid: uuid.v4(),
        personas: [
            {
                uid: uuid.v4(),
                name: "Persona1"
            },
            {
                uid: uuid.v4(),
                name: "Persona2"
            }
        ],
        roles: config.get("trusted_roles")
    };
    const adminToken = JWTUtils.createToken(config.get("auth"), admin);
    const user: any = {
        uid: uuid.v4(),
        personas: [
            {
                uid: uuid.v4(),
                name: "Persona1"
            },
            {
                uid: uuid.v4(),
                name: "Persona2"
            }
        ]
    };
    const authToken = JWTUtils.createToken(config.get("auth"), user);

    beforeAll(async () => {
        config.set("datastores:logs", {
            type: "redis",
            url: "redis://localhost:6379"
        });
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

    it("Can connect to inspector with auth header.", () => {
        const httpServer: any = server.getServer();
        requestws(httpServer).ws(basePath + "/inspect", { headers: { Authorization: `jwt ${adminToken}` } })
            .expectJson({ id: 0, type: "SUBSCRIBED", success: true, data: serviceName + "-logs" })
            .close()
            .expectClosed();
    });

    it("Cannot connect to inspector with auth header using untrusted user.", () => {
        const httpServer: any = server.getServer();
        requestws(httpServer).ws(basePath + "/inspect", { headers: { Authorization: `jwt ${authToken}` } })
            .expectClosed(1002, "User does not have permission to perform this action.");
    });

    it("Can connect to inspector with LOGIN message.", () => {
        const httpServer: any = server.getServer();
        requestws(httpServer).ws(basePath + "/inspect")
            .sendJson({ id: 0, type: "LOGIN", data: adminToken })
            .expectJson({ id: 0, type: "LOGIN_RESPONSE", success: true })
            .expectJson({ id: 0, type: "SUBSCRIBED", success: true, data: serviceName + "-logs" })
            .close()
            .expectClosed();
    });

    it("Cannot connect to inspector with LOGIN message using untrusted user.", () => {
        const httpServer: any = server.getServer();
        requestws(httpServer).ws(basePath + "/inspect")
            .sendJson({ id: 0, type: "LOGIN", data: adminToken })
            .expectJson({ id: 0, type: "LOGIN_RESPONSE", success: true })
            .expectClosed(1002, "User does not have permission to perform this action.");
    });

    it("Can connect to logs with auth header.", () => {
        const httpServer: any = server.getServer();
        requestws(httpServer).ws(basePath + "/logs", { headers: { Authorization: `jwt ${adminToken}` } })
            .expectJson({ id: 0, type: "SUBSCRIBED", success: true, data: serviceName + "-logs" })
            .close()
            .expectClosed();
    });

    it("Cannot connect to logs with auth header using untrusted user.", () => {
        const httpServer: any = server.getServer();
        requestws(httpServer).ws(basePath + "/logs", { headers: { Authorization: `jwt ${authToken}` } })
            .expectClosed(1002, "User does not have permission to perform this action.");
    });

    it("Can connect to logs with LOGIN message.", () => {
        const httpServer: any = server.getServer();
        requestws(httpServer).ws(basePath + "/logs")
            .sendJson({ id: 0, type: "LOGIN", data: adminToken })
            .expectJson({ id: 0, type: "LOGIN_RESPONSE", success: true })
            .expectJson({ id: 0, type: "SUBSCRIBED", success: true, data: serviceName + "-logs" })
            .close()
            .expectClosed();
    });

    it("Cannot connect to logs with LOGIN message using untrusted user.", () => {
        const httpServer: any = server.getServer();
        requestws(httpServer).ws(basePath + "/logs")
            .sendJson({ id: 0, type: "LOGIN", data: authToken })
            .expectJson({ id: 0, type: "LOGIN_RESPONSE", success: true })
            .expectClosed(1002, "User does not have permission to perform this action.");
    });
});
