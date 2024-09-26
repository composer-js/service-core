///////////////////////////////////////////////////////////////////////////////
// Copyright (C) Xsolla USA, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
// This mock MUST be defined before we import ConnectionManager (or anything that pulls it in such as Server)
jest.mock('ioredis', () => require('ioredis-mock'));

import { default as config } from "./config";
import { Server } from "../src";
import { MongoMemoryServer } from "mongodb-memory-server";
import * as sqlite3 from "sqlite3";
import * as uuid from "uuid";
import requestws from "superwstest";

import { JWTUtils } from "@composer-js/core";

const mongod: MongoMemoryServer = new MongoMemoryServer({
    instance: {
        port: 9999,
        dbName: "mongomemory-cjs-test",
    },
});
const sqlite: sqlite3.Database = new sqlite3.Database(":memory:");
jest.setTimeout(30000);

describe("AdminRoute Tests", () => {
    const basePath = "/admin";
    const server: Server = new Server(config, "./test/server");
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
        return await new Promise<void>((resolve) => {
            sqlite.close(err => {
                if (err) {
                    throw new Error(err.message);
                }
                resolve();
            });
        })
    });

    it.skip("Can connect to inspector with auth header.", async () => {
        const httpServer: any = server.getServer();
        await requestws(httpServer).ws(basePath + "/inspect", { headers: { Authorization: `jwt ${adminToken}` } })
            .expectJson({ id: 0, type: "SUBSCRIBED", success: true, data: serviceName + "-logs" })
            .close()
            .expectClosed();
    });

    it.skip("Cannot connect to inspector with auth header using untrusted user.", async () => {
        const httpServer: any = server.getServer();
        await requestws(httpServer).ws(basePath + "/inspect", { headers: { Authorization: `jwt ${authToken}` } })
            .expectClosed(1002, "api-102");
    });

    it.skip("Can connect to inspector with LOGIN message.", async () => {
        const httpServer: any = server.getServer();
        await requestws(httpServer).ws(basePath + "/inspect")
            .sendJson({ id: 0, type: "LOGIN", data: adminToken })
            .expectJson({ id: 0, type: "LOGIN_RESPONSE", success: true })
            .expectJson({ id: 0, type: "SUBSCRIBED", success: true, data: serviceName + "-logs" })
            .close()
            .expectClosed();
    });

    it.skip("Cannot connect to inspector with LOGIN message using untrusted user.", async () => {
        const httpServer: any = server.getServer();
        await requestws(httpServer).ws(basePath + "/inspect")
            .sendJson({ id: 0, type: "LOGIN", data: adminToken })
            .expectJson({ id: 0, type: "LOGIN_RESPONSE", success: true })
            .expectClosed(1002, "api-102");
    });

    it("Can connect to logs with auth header.", async () => {
        const httpServer: any = server.getServer();
        await requestws(httpServer).ws(basePath + "/logs", { headers: { Authorization: `jwt ${adminToken}` } })
            .expectJson({ id: 0, type: "SUBSCRIBED", success: true, data: serviceName + "-logs" })
            .close()
            .expectClosed();
    });

    it("Cannot connect to logs with auth header using untrusted user.", async () => {
        const httpServer: any = server.getServer();
        await requestws(httpServer).ws(basePath + "/logs", { headers: { Authorization: `jwt ${authToken}` } })
            .expectClosed(1002, "api-102");
    });

    it("Can connect to logs with LOGIN message.", async () => {
        const httpServer: any = server.getServer();
        await requestws(httpServer).ws(basePath + "/logs")
            .sendJson({ id: 0, type: "LOGIN", data: adminToken })
            .expectJson({ id: 0, type: "LOGIN_RESPONSE", success: true })
            .expectJson({ id: 0, type: "SUBSCRIBED", success: true, data: serviceName + "-logs" })
            .close()
            .expectClosed();
    });

    it("Cannot connect to logs with LOGIN message using untrusted user.", async () => {
        const httpServer: any = server.getServer();
        await requestws(httpServer).ws(basePath + "/logs")
            .sendJson({ id: 0, type: "LOGIN", data: authToken })
            .expectJson({ id: 0, type: "LOGIN_RESPONSE", success: true })
            .expectClosed(1002, "api-102");
    });
});
