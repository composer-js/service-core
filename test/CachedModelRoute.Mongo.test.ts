///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { default as config } from "./config";
import * as crypto from "crypto";
import * as request from "supertest";
import { Server, ConnectionManager, ModelUtils } from "../src";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "./server/models/CacheUser";
import { MongoRepository, Connection } from "typeorm";
import CacheUser from "./server/models/CacheUser";
import { start } from "repl";
const Redis = require("ioredis-mock");

const baseCacheKey: string = "db.cache.CacheUser";
const mongod: MongoMemoryServer = new MongoMemoryServer({
    instance: {
        port: 9999,
        dbName: "axr-test",
    },
    autoStart: false,
});
const redis: any = new Redis();
let repo: MongoRepository<User>;
const server: Server = new Server(config, undefined, "./test/server");

const createUser = async (firstName: string, lastName: string, age: number = 100): Promise<User> => {
    const user: User = new User({
        firstName,
        lastName,
        age,
    });

    return await repo.save(user);
};

const createUsers = async (num: number): Promise<User[]> => {
    const results: User[] = [];

    for (let i = 1; i <= num; i++) {
        results.push(await createUser(String(i), "Doctor", 100 * i));
    }

    return results;
};

/**
 * Hashes the given query object to a unique string.
 * @param query The query object to hash.
 */
const getCacheKey = function(query: any): string {
    return (
        baseCacheKey +
        "." +
        crypto
            .createHash("sha512")
            .update(JSON.stringify(query))
            .digest("hex")
    );
};

jest.setTimeout(120000);

describe("ModelRoute Tests [MongoDB with Caching]", () => {
    beforeAll(async () => {
        ConnectionManager.connections.set("cache", redis);
        await mongod.start();
        await server.start();
        const conn: any = ConnectionManager.connections.get("mongodb");
        if (conn instanceof Connection) {
            repo = conn.getMongoRepository(User);
        }
    });

    afterAll(async () => {
        await server.stop();
        await mongod.stop();
    });

    beforeEach(async () => {
        try {
            await repo.clear();
        } catch (err) {
            // The error "ns not found" occurs when the collection doesn't exist yet. We can ignore this error.
            if (err.message != "ns not found") {
                throw err;
            }
        }
    });

    describe("Single Cached Document Tests [MongoDB]", () => {
        it("Can create cached document.", async () => {
            const user: User = new User({
                firstName: "David",
                lastName: "Tennant",
                age: 47,
            });
            const result = await request(server.getApplication())
                .post("/cachedusers")
                .send(user);
            expect(result).toHaveProperty("body");
            expect(result.body.uid).toEqual(user.uid);
            expect(result.body.version).toEqual(user.version);
            expect(result.body.firstName).toEqual(user.firstName);
            expect(result.body.lastName).toEqual(user.lastName);
            expect(result.body.age).toEqual(user.age);

            const stored: User | undefined = await repo.findOne({ uid: result.body.uid } as any);
            expect(stored).toBeDefined();
            if (stored) {
                expect(stored.uid).toEqual(user.uid);
                expect(stored.version).toEqual(user.version);
                expect(stored.firstName).toEqual(user.firstName);
                expect(stored.lastName).toEqual(user.lastName);
                expect(stored.age).toEqual(user.age);

                const query: any = ModelUtils.buildIdSearchQuery(repo, CacheUser, result.body.uid);
                const cacheKey: string = getCacheKey(query);
                const json: string = await redis.get(cacheKey);
                expect(json).toBeDefined();
                const parsed: User = JSON.parse(json);
                expect(parsed).toBeDefined();
                expect(parsed.uid).toEqual(stored.uid);
                expect(parsed.version).toEqual(stored.version);
                expect(parsed.firstName).toEqual(stored.firstName);
                expect(parsed.lastName).toEqual(stored.lastName);
                expect(parsed.age).toEqual(stored.age);
            }
        });
        it("Can delete cached document.", async () => {
            const user: User = await createUser("David", "Tennant", 47);
            const result = await request(server.getApplication()).delete("/cachedusers/" + user.uid);
            expect(result.status).toBe(204);

            const existing: User | undefined = await repo.findOne({ uid: user.uid } as any);
            expect(existing).toBeUndefined();

            const query: any = ModelUtils.buildIdSearchQueryMongo(CacheUser, user.uid);
            const cacheKey: string = getCacheKey(query);
            const json: string = await redis.get(cacheKey);
            expect(json).toBeNull();
        });

        it("Can find cached document by id.", async () => {
            const user: User = await createUser("David", "Tennant", 47);
            const result = await request(server.getApplication())
                .get("/cachedusers/" + user.uid)
                .send();
            expect(result).toHaveProperty("body");
            expect(result.body.uid).toEqual(user.uid);
            expect(result.body.version).toEqual(user.version);
            expect(result.body.firstName).toEqual(user.firstName);
            expect(result.body.lastName).toEqual(user.lastName);
            expect(result.body.age).toEqual(user.age);

            const query: any = ModelUtils.buildIdSearchQueryMongo(CacheUser, result.body.uid);
            const cacheKey: string = getCacheKey(query);
            const json: string = await redis.get(cacheKey);
            expect(json).toBeDefined();
            const cachedObj: any = JSON.parse(json);
            expect(cachedObj).toBeDefined();
            expect(cachedObj).toEqual(result.body);
        });

        it("Can update cached document.", async () => {
            const user: User = await createUser("David", "Tennant", 47);
            user.firstName = "Matt";
            user.lastName = "Smith";
            user.age = 36;
            const result = await request(server.getApplication())
                .put("/cachedusers/" + user.uid)
                .send(user);
            expect(result).toHaveProperty("body");
            expect(result.body).toHaveProperty("uid");
            expect(result.body.uid).toBe(user.uid);
            expect(result.body.version).toBeGreaterThan(user.version);
            expect(result.body.firstName).toBe(user.firstName);
            expect(result.body.lastName).toBe(user.lastName);
            expect(result.body.age).toBe(user.age);

            const existing: User | undefined = await repo.findOne({ uid: user.uid } as any);
            expect(existing).toBeDefined();
            if (existing) {
                expect(existing.uid).toBe(result.body.uid);
                expect(existing.version).toBe(result.body.version);
                expect(existing.firstName).toBe(result.body.firstName);
                expect(existing.lastName).toBe(result.body.lastName);
                expect(existing.age).toBe(result.body.age);
            }

            const query: any = ModelUtils.buildIdSearchQueryMongo(CacheUser, user.uid);
            const cacheKey: string = getCacheKey(query);
            const json: string = await redis.get(cacheKey);
            expect(json).toBeDefined();
            const cachedObj: User = new User(JSON.parse(json));
            expect(cachedObj).toBeDefined();
            expect(cachedObj).toEqual(existing);
        });
    });

    describe("Multiple Cached Document Tests [MongoDB]", () => {
        it("Can find all cached documents.", async () => {
            const users: User[] = await createUsers(25);

            const result = await request(server.getApplication()).get("/cachedusers");
            expect(result).toHaveProperty("body");
            expect(result.body).toHaveLength(users.length);

            const result2 = await request(server.getApplication()).get("/cachedusers");
            expect(result2).toHaveProperty("body");
            expect(result2.body).toHaveLength(users.length);
            expect(result.body).toEqual(result2.body);
        });

        it("Can find cached documents with criteria (eq).", async () => {
            const users: User[] = await createUsers(13);
            await createUser("David", "Tennant", 47);
            await createUser("Matt", "Smith", 36);
            const result = await request(server.getApplication()).get("/cachedusers?lastName=Doctor");
            expect(result).toHaveProperty("body");
            expect(result.body).toHaveLength(users.length);

            const result2 = await request(server.getApplication()).get("/cachedusers?lastName=Doctor");
            expect(result2).toHaveProperty("body");
            expect(result2.body).toHaveLength(users.length);
            expect(result.body).toEqual(result2.body);
        });
    });
});
