///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { default as config } from "./config";
import * as request from "supertest";
import { Server, ConnectionManager } from "../src/service_core";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "./models/User";
import { MongoRepository, Connection } from "typeorm";

const mongod: MongoMemoryServer = new MongoMemoryServer({
    instance: {
        port: 9999,
        dbName: "axr-test",
    },
    autoStart: false,
});
let repo: MongoRepository<User>;
const server: Server = new Server(config, undefined, "./test");

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

jest.setTimeout(120000);
describe("ModelRoute Tests [MongoDB]", () => {
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
                .post("/users")
                .send(user);
            expect(result).toHaveProperty("body");
            expect(result.body.uid).toEqual(user.uid);
            expect(result.body.version).toEqual(user.version);
            expect(result.body.firstName).toEqual(user.firstName);
            expect(result.body.lastName).toEqual(user.lastName);
            expect(result.body.age).toEqual(user.age);

            const stored: User | undefined = await repo.findOne({ uid: result.body.uid });
            expect(stored).toBeDefined();
            if (stored) {
                expect(stored.uid).toEqual(user.uid);
                expect(stored.version).toEqual(user.version);
                expect(stored.firstName).toEqual(user.firstName);
                expect(stored.lastName).toEqual(user.lastName);
                expect(stored.age).toEqual(user.age);
            }
        });

        it("Can delete document. [MongoDB]", async () => {
            const user: User = await createUser("David", "Tennant", 47);
            const result = await request(server.getApplication()).delete("/users/" + user.uid);
            expect(result.status).toBe(204);

            const existing: User | undefined = await repo.findOne({ uid: user.uid });
            expect(existing).toBeUndefined();
        });

        it("Can find document by id. [MongoDB]", async () => {
            const user: User = await createUser("David", "Tennant", 47);
            const result = await request(server.getApplication())
                .get("/users/" + user.uid)
                .send();
            expect(result).toHaveProperty("body");
            expect(result.body.uid).toEqual(user.uid);
            expect(result.body.version).toEqual(user.version);
            expect(result.body.firstName).toEqual(user.firstName);
            expect(result.body.lastName).toEqual(user.lastName);
            expect(result.body.age).toEqual(user.age);
        });

        it("Can update document. [MongoDB]", async () => {
            const user: User = await createUser("David", "Tennant", 47);
            user.firstName = "Matt";
            user.lastName = "Smith";
            user.age = 36;
            const result = await request(server.getApplication())
                .put("/users/" + user.uid)
                .send(user);
            expect(result).toHaveProperty("body");
            expect(result.body).toHaveProperty("uid");
            expect(result.body.uid).toBe(user.uid);
            expect(result.body.version).toBeGreaterThan(user.version);
            expect(result.body.firstName).toBe(user.firstName);
            expect(result.body.lastName).toBe(user.lastName);
            expect(result.body.age).toBe(user.age);

            const existing: User | undefined = await repo.findOne({ uid: user.uid });
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
            const result = await request(server.getApplication()).get("/users/count");
            expect(result).toHaveProperty("body");
            expect(result.body).toHaveProperty("count");
            expect(result.body.count).toBe(users.length);
        });

        it("Can count documents with criteria (eq). [MongoDB]", async () => {
            const users: User[] = await createUsers(13);
            await createUser("David", "Tennant", 47);
            await createUser("Matt", "Smith", 36);
            const result = await request(server.getApplication()).get("/users/count?lastName=Doctor");
            expect(result).toHaveProperty("body");
            console.log(result.body);
            expect(result.body).toHaveProperty("count");
            expect(result.body.count).toBe(users.length);
        });

        it("Can find all documents. [MongoDB]", async () => {
            const users: User[] = await createUsers(25);
            const result = await request(server.getApplication()).get("/users");
            expect(result).toHaveProperty("body");
            expect(result.body).toHaveLength(users.length);
        });

        it("Can find documents with criteria (eq) [MongoDB].", async () => {
            const users: User[] = await createUsers(13);
            await createUser("David", "Tennant", 47);
            await createUser("Matt", "Smith", 36);
            const result = await request(server.getApplication()).get("/users?lastName=Doctor");
            expect(result).toHaveProperty("body");
            expect(result.body).toHaveLength(users.length);
            for (const user of result.body) {
                expect(user.lastName).toBe("Doctor");
            }
        });

        it("Can truncate datastore [MongoDB].", async () => {
            const users: User[] = await createUsers(25);
            const result = await request(server.getApplication()).delete("/users");
            expect(result.status).toBe(204);

            const count: number = await repo.count();
            expect(count).toBe(0);
        });
    });
});
