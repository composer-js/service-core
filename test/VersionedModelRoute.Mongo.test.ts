///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { default as config } from "./config";
import * as request from "supertest";
import { Server, ConnectionManager, ModelUtils } from "../src/service_core";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "./models/VersionedUser";
import { MongoRepository, Connection } from "typeorm";
const uuid = require("uuid");

const mongod: MongoMemoryServer = new MongoMemoryServer({
    instance: {
        port: 9999,
        dbName: "axr-test",
    },
    autoStart: false,
});
let repo: MongoRepository<User>;
const server: Server = new Server(config, undefined, "./test");
const baseUrl: string = "/versionedusers";

const createUser = async (firstName: string, lastName: string, age: number = 100, versions: number = 1): Promise<User[]> => {
    const results: User[] = [];

    const uid: string = uuid.v4();
    for (let version = 0; version < versions; version++) {
        const user: User = new User({
            uid,
            firstName,
            lastName,
            age,
            version
        });

        results.push(await repo.save(user));
    }

    return results;
};

const createUsers = async (num: number, versions: number = 1): Promise<User[]> => {
    let results: User[] = [];

    for (let i = 1; i <= num; i++) {
        results = results.concat(await createUser(String(i), "Doctor", 100 * i, versions));
    }

    return results;
};

jest.setTimeout(120000);
describe("VersionedModelRoute Tests [MongoDB]", () => {
    beforeAll(async () => {
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

    describe("Single Document Tests [MongoDB]", () => {
        it("Can create document. [MongoDB]", async () => {
            const user: User = new User({
                firstName: "David",
                lastName: "Tennant",
                age: 47,
            });
            const result = await request(server.getApplication())
                .post(baseUrl)
                .send(user);
            expect(result).toHaveProperty("body");
            expect(result.body.uid).toEqual(user.uid);
            expect(result.body.version).toEqual(user.version);
            expect(result.body.firstName).toEqual(user.firstName);
            expect(result.body.lastName).toEqual(user.lastName);
            expect(result.body.age).toEqual(user.age);

            const stored: User[] | undefined = await repo.find({ uid: result.body.uid });
            expect(stored).toHaveLength(1);
            if (stored) {
                expect(stored[0].uid).toEqual(user.uid);
                expect(stored[0].version).toEqual(user.version);
                expect(stored[0].firstName).toEqual(user.firstName);
                expect(stored[0].lastName).toEqual(user.lastName);
                expect(stored[0].age).toEqual(user.age);
            }
        });

        it("Can delete document. [MongoDB]", async () => {
            const user: User = (await createUser("David", "Tennant", 47))[0];
            const result = await request(server.getApplication()).delete(`${baseUrl}/${user.uid}`);
            expect(result.status).toBe(204);

            const count: number = await repo.count({ uid: user.uid });
            expect(count).toBe(0);
        });

        it("Can delete document with multiple versions. [MongoDB]", async () => {
            const user: User = (await createUser("David", "Tennant", 47, 4))[0];
            const result = await request(server.getApplication()).delete(`${baseUrl}/${user.uid}`);
            expect(result.status).toBe(204);

            const count: number = await repo.count({ uid: user.uid });
            expect(count).toBe(0);
        });

        it("Can delete document with specific version. [MongoDB]", async () => {
            const user: User = (await createUser("David", "Tennant", 47, 4))[0];
            const result = await request(server.getApplication()).delete(`${baseUrl}/${user.uid}/version/2`);
            expect(result.status).toBe(204);

            const count: number = await repo.count({ uid: user.uid });
            expect(count).toBe(3);
        });

        it("Can find document by id. [MongoDB]", async () => {
            const user: User = (await createUser("David", "Tennant", 47, 3))[2];
            const result = await request(server.getApplication())
                .get(`${baseUrl}/${user.uid}`)
                .send();
            expect(result).toHaveProperty("body");
            expect(result.body.uid).toEqual(user.uid);
            expect(result.body.version).toEqual(user.version);
            expect(result.body.firstName).toEqual(user.firstName);
            expect(result.body.lastName).toEqual(user.lastName);
            expect(result.body.age).toEqual(user.age);
        });

        it("Can find document by id and version. [MongoDB]", async () => {
            const user: User = (await createUser("David", "Tennant", 47, 5))[2];
            const result = await request(server.getApplication())
                .get(`${baseUrl}/${user.uid}/version/${user.version}`)
                .send();
            expect(result).toHaveProperty("body");
            expect(result.body.uid).toEqual(user.uid);
            expect(result.body.version).toEqual(user.version);
            expect(result.body.firstName).toEqual(user.firstName);
            expect(result.body.lastName).toEqual(user.lastName);
            expect(result.body.age).toEqual(user.age);
        });

        it("Can update document. [MongoDB]", async () => {
            const user: User = (await createUser("David", "Tennant", 47))[0];
            user.firstName = "Matt";
            user.lastName = "Smith";
            user.age = 36;
            const result = await request(server.getApplication())
                .put(`${baseUrl}/${user.uid}`)
                .send(user);
            expect(result).toHaveProperty("body");
            expect(result.body).toHaveProperty("uid");
            expect(result.body.uid).toBe(user.uid);
            expect(result.body.version).toBeGreaterThan(user.version);
            expect(result.body.firstName).toBe(user.firstName);
            expect(result.body.lastName).toBe(user.lastName);
            expect(result.body.age).toBe(user.age);

            const count: number = await repo.count({ uid: user.uid });
            expect(count).toBe(2);

            const query: any = ModelUtils.buildIdSearchQuery(repo, User, user.uid, 1);
            const existing: User | undefined = await repo.findOne(query);
            expect(existing).toBeDefined();
            if (existing) {
                expect(existing.uid).toBe(result.body.uid);
                expect(existing.version).toBe(result.body.version);
                expect(existing.firstName).toBe(result.body.firstName);
                expect(existing.lastName).toBe(result.body.lastName);
                expect(existing.age).toBe(result.body.age);
            }
        });
    });

    describe("Multiple Document Tests [MongoDB]", () => {
        it("Can count documents. [MongoDB]", async () => {
            const users: User[] = await createUsers(20);
            const result = await request(server.getApplication()).get(`${baseUrl}/count`);
            expect(result).toHaveProperty("body");
            expect(result.body).toHaveProperty("count");
            expect(result.body.count).toBe(users.length);
        });

        it("Can count documents with multiple versions. [MongoDB]", async () => {
            const users: User[] = await createUsers(20, 3);
            const result = await request(server.getApplication()).get(`${baseUrl}/count`);
            expect(result).toHaveProperty("body");
            expect(result.body).toHaveProperty("count");
            expect(result.body.count).toBe(20);
        });

        it("Can count documents with criteria (eq). [MongoDB]", async () => {
            const users: User[] = await createUsers(13, 2);
            await createUser("David", "Tennant", 47, 3);
            await createUser("Matt", "Smith", 36, 4);
            const result = await request(server.getApplication()).get(`${baseUrl}/count?lastName=Doctor`);
            expect(result).toHaveProperty("body");
            console.log(result.body);
            expect(result.body).toHaveProperty("count");
            expect(result.body.count).toBe(13);
        });

        it("Can find all documents. [MongoDB]", async () => {
            const users: User[] = await createUsers(25);
            const result = await request(server.getApplication()).get(baseUrl);
            expect(result).toHaveProperty("body");
            expect(result.body).toHaveLength(users.length);
        });

        it("Can find all documents with multiple versions. [MongoDB]", async () => {
            const users: User[] = await createUsers(25, 3);
            const result = await request(server.getApplication()).get(baseUrl);
            expect(result).toHaveProperty("body");
            expect(result.body).toHaveLength(25);
        });

        it("Can find documents with criteria (eq) [MongoDB].", async () => {
            const users: User[] = await createUsers(13, 2);
            await createUser("David", "Tennant", 47, 3);
            await createUser("Matt", "Smith", 36, 6);
            const result = await request(server.getApplication()).get(`${baseUrl}?lastName=Doctor`);
            expect(result).toHaveProperty("body");
            expect(result.body).toHaveLength(13);
            for (const user of result.body) {
                expect(user.lastName).toBe("Doctor");
                expect(user.version).toBe(1);
            }
        });

        it("Can truncate datastore [MongoDB].", async () => {
            const users: User[] = await createUsers(25);
            const result = await request(server.getApplication()).delete(baseUrl);
            expect(result.status).toBe(204);

            const count: number = await repo.count();
            expect(count).toBe(0);
        });
    });
});
