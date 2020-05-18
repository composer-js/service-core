///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { default as config } from "./config";
import * as request from "supertest";
import { Server, ConnectionManager, ACLRecord } from "../src/service_core";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "./models/User";
import { MongoRepository, Connection } from "typeorm";
import { JWTUtils } from "@composer-js/core";
import AccessControlListMongo from "../src/security/AccessControlListMongo";
const uuid = require("uuid");

const mongod: MongoMemoryServer = new MongoMemoryServer({
    instance: {
        port: 9999,
    },
    autoStart: false,
});
let repo: MongoRepository<User>;
let aclRepo: MongoRepository<AccessControlListMongo>;
const server: Server = new Server(config, undefined, "./test");

const createUser = async (firstName: string, lastName: string, age: number = 100): Promise<User> => {
    const user: User = new User({
        firstName,
        lastName,
        age,
    });

    const result: User = await repo.save(user);

    const records: ACLRecord[] = [];

    // The user itself has full CRUD access
    records.push({
        userOrRoleId: user.uid,
        create: true,
        read: true,
        update: true,
        delete: true,
        special: false,
        full: false,
    });

    // Guests have create-only access
    records.push({
        userOrRoleId: "anonymous",
        create: true,
        read: false,
        update: false,
        delete: false,
        special: false,
        full: false,
    });

    // Everyone has read-only access
    records.push({
        userOrRoleId: ".*",
        create: false,
        read: true,
        update: false,
        delete: false,
        special: false,
        full: false,
    });

    const acl: any = {
        uid: user.uid,
        dateCreated: new Date(),
        dateModified: new Date(),
        version: 0,
        records,
        parentUid: "User"
    };
    await aclRepo.save(aclRepo.create(acl));

    return result;
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
        let conn: any = ConnectionManager.connections.get("acl");
        if (conn instanceof Connection) {
            aclRepo = conn.getMongoRepository(AccessControlListMongo);
        }
        conn = ConnectionManager.connections.get("mongodb");
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
        it("Can create document (anonymous). [MongoDB]", async () => {
            const user: User = new User({
                firstName: "David",
                lastName: "Tennant",
                age: 47,
            });
            const result = await request(server.getApplication())
                .post("/userswithacl")
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

        it("Can create document (admin). [MongoDB]", async () => {
            const user: User = new User({
                firstName: "David",
                lastName: "Tennant",
                age: 47,
            });
            const token = JWTUtils.createToken(config.get("auth"), {
                uid: uuid.v4(),
                roles: config.get("trusted_roles")
            });
            const result = await request(server.getApplication())
                .post("/userswithacl")
                .send(user)
                .set("Authorization", `jwt ${token}`);
            expect(result.status).toBeGreaterThanOrEqual(200);
            expect(result.status).toBeLessThan(300);
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

        it("Cannot create document (user). [MongoDB]", async () => {
            const user: User = new User({
                firstName: "David",
                lastName: "Tennant",
                age: 47,
            });
            const token = JWTUtils.createToken(config.get("auth"), {
                uid: uuid.v4(),
            });
            const result = await request(server.getApplication())
                .post("/userswithacl")
                .send(user)
                .set("Authorization", `jwt ${token}`);
            expect(result.status).toBe(403);
        });

        it("Can delete document (admin). [MongoDB]", async () => {
            const user: User = await createUser("David", "Tennant", 47);
            const token = JWTUtils.createToken(config.get("auth"), {
                uid: uuid.v4(),
                roles: config.get("trusted_roles")
            });
            const result = await request(server.getApplication())
                .delete("/userswithacl/" + user.uid)
                .set("Authorization", `jwt ${token}`);
            expect(result.status).toBe(204);

            const existing: User | undefined = await repo.findOne({ uid: user.uid });
            expect(existing).toBeUndefined();
        });

        it("Can delete document (me). [MongoDB]", async () => {
            const user: User = await createUser("David", "Tennant", 47);
            const token = JWTUtils.createToken(config.get("auth"), user);
            const result = await request(server.getApplication())
                .delete("/userswithacl/me")
                .set("Authorization", `jwt ${token}`);
            expect(result.status).toBe(204);

            const existing: User | undefined = await repo.findOne({ uid: user.uid });
            expect(existing).toBeUndefined();
        });

        it("Can delete document (self). [MongoDB]", async () => {
            const user: User = await createUser("David", "Tennant", 47);
            const token = JWTUtils.createToken(config.get("auth"), user);
            const result = await request(server.getApplication())
                .delete("/userswithacl/" + user.uid)
                .set("Authorization", `jwt ${token}`);
            expect(result.status).toBe(204);

            const existing: User | undefined = await repo.findOne({ uid: user.uid });
            expect(existing).toBeUndefined();
        });

        it("Cannot delete document (other). [MongoDB]", async () => {
            const user: User = await createUser("David", "Tennant", 47);
            const token = JWTUtils.createToken(config.get("auth"), {
                uid: uuid.v4()
            });
            const result = await request(server.getApplication())
                .delete("/userswithacl/" + user.uid)
                .set("Authorization", `jwt ${token}`);
            expect(result.status).toBe(403);

            const existing: User | undefined = await repo.findOne({ uid: user.uid });
            expect(existing).toBeDefined();
        });

        it("Cannot delete document (anonymous). [MongoDB]", async () => {
            const user: User = await createUser("David", "Tennant", 47);
            const result = await request(server.getApplication())
                .delete("/userswithacl/" + user.uid);
            expect(result.status).toBe(403);

            const existing: User | undefined = await repo.findOne({ uid: user.uid });
            expect(existing).toBeDefined();
        });

        it("Can find document by id (admin). [MongoDB]", async () => {
            const user: User = await createUser("David", "Tennant", 47);
            const token = JWTUtils.createToken(config.get("auth"), {
                uid: uuid.v4(),
                roles: config.get("trusted_roles")
            });
            const result = await request(server.getApplication())
                .get("/userswithacl/" + user.uid)
                .set("Authorization", `jwt ${token}`);
            expect(result.status).toBeGreaterThanOrEqual(200);
            expect(result.status).toBeLessThan(300);
            expect(result).toHaveProperty("body");
            expect(result.body.uid).toEqual(user.uid);
            expect(result.body.version).toEqual(user.version);
            expect(result.body.firstName).toEqual(user.firstName);
            expect(result.body.lastName).toEqual(user.lastName);
            expect(result.body.age).toEqual(user.age);
        });

        it("Can find document by id (me). [MongoDB]", async () => {
            const user: User = await createUser("David", "Tennant", 47);
            const token = JWTUtils.createToken(config.get("auth"), user);
            const result = await request(server.getApplication())
                .get("/userswithacl/me")
                .set("Authorization", `jwt ${token}`);
            expect(result.status).toBeGreaterThanOrEqual(200);
            expect(result.status).toBeLessThan(300);
            expect(result).toHaveProperty("body");
            expect(result.body.uid).toEqual(user.uid);
            expect(result.body.version).toEqual(user.version);
            expect(result.body.firstName).toEqual(user.firstName);
            expect(result.body.lastName).toEqual(user.lastName);
            expect(result.body.age).toEqual(user.age);
        });

        it("Can find document by id (self). [MongoDB]", async () => {
            const user: User = await createUser("David", "Tennant", 47);
            const token = JWTUtils.createToken(config.get("auth"), user);
            const result = await request(server.getApplication())
                .get("/userswithacl/" + user.uid)
                .set("Authorization", `jwt ${token}`);
            expect(result.status).toBeGreaterThanOrEqual(200);
            expect(result.status).toBeLessThan(300);
            expect(result).toHaveProperty("body");
            expect(result.body.uid).toEqual(user.uid);
            expect(result.body.version).toEqual(user.version);
            expect(result.body.firstName).toEqual(user.firstName);
            expect(result.body.lastName).toEqual(user.lastName);
            expect(result.body.age).toEqual(user.age);
        });

        it("Can find document by id (other). [MongoDB]", async () => {
            const user: User = await createUser("David", "Tennant", 47);
            const token = JWTUtils.createToken(config.get("auth"), {
                uid: uuid.v4()
            });
            const result = await request(server.getApplication())
                .get("/userswithacl/" + user.uid)
                .set("Authorization", `jwt ${token}`);
            expect(result.status).toBeGreaterThanOrEqual(200);
            expect(result.status).toBeLessThan(300);
            expect(result).toHaveProperty("body");
            expect(result.body.uid).toEqual(user.uid);
            expect(result.body.version).toEqual(user.version);
            expect(result.body.firstName).toEqual(user.firstName);
            expect(result.body.lastName).toEqual(user.lastName);
            expect(result.body.age).toEqual(user.age);
        });

        it("Cannot find document by id (anonymous). [MongoDB]", async () => {
            const user: User = await createUser("David", "Tennant", 47);
            const result = await request(server.getApplication())
                .get("/userswithacl/" + user.uid);
            expect(result.status).toBe(403);
        });

        it("Can update document (admin). [MongoDB]", async () => {
            const user: User = await createUser("David", "Tennant", 47);
            user.firstName = "Matt";
            user.lastName = "Smith";
            user.age = 36;
            const token = JWTUtils.createToken(config.get("auth"), {
                uid: uuid.v4(),
                roles: config.get("trusted_roles")
            });
            const result = await request(server.getApplication())
                .put("/userswithacl/" + user.uid)
                .set("Authorization", `jwt ${token}`)
                .send(user);
            expect(result.status).toBeGreaterThanOrEqual(200);
            expect(result.status).toBeLessThan(300);
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

        it("Can update document (me). [MongoDB]", async () => {
            const user: User = await createUser("David", "Tennant", 47);
            user.firstName = "Matt";
            user.lastName = "Smith";
            user.age = 36;
            const token = JWTUtils.createToken(config.get("auth"), user);
            const result = await request(server.getApplication())
                .put("/userswithacl/me")
                .set("Authorization", `jwt ${token}`)
                .send(user);
            expect(result.status).toBeGreaterThanOrEqual(200);
            expect(result.status).toBeLessThan(300);
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

        it("Can update document (self). [MongoDB]", async () => {
            const user: User = await createUser("David", "Tennant", 47);
            user.firstName = "Matt";
            user.lastName = "Smith";
            user.age = 36;
            const token = JWTUtils.createToken(config.get("auth"), user);
            const result = await request(server.getApplication())
                .put("/userswithacl/" + user.uid)
                .set("Authorization", `jwt ${token}`)
                .send(user);
            expect(result.status).toBeGreaterThanOrEqual(200);
            expect(result.status).toBeLessThan(300);
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

        it("Cannot update document (other). [MongoDB]", async () => {
            const user: User = await createUser("David", "Tennant", 47);
            user.firstName = "Matt";
            user.lastName = "Smith";
            user.age = 36;
            const token = JWTUtils.createToken(config.get("auth"), {
                uid: uuid.v4()
            });
            const result = await request(server.getApplication())
                .put("/userswithacl/" + user.uid)
                .set("Authorization", `jwt ${token}`)
                .send(user);
            expect(result.status).toBe(403);

            const existing: User | undefined = await repo.findOne({ uid: user.uid });
            expect(existing).toBeDefined();
            if (existing) {
                expect(existing.uid).toBe(user.uid);
                expect(existing.version).toBe(user.version);
                expect(existing.firstName).toBe("David");
                expect(existing.lastName).toBe("Tennant");
                expect(existing.age).toBe(47);
            }
        });

        it("Cannot update document (anonymous). [MongoDB]", async () => {
            const user: User = await createUser("David", "Tennant", 47);
            user.firstName = "Matt";
            user.lastName = "Smith";
            user.age = 36;
            const result = await request(server.getApplication())
                .put("/userswithacl/" + user.uid)
                .send(user);
            expect(result.status).toBe(403);

            const existing: User | undefined = await repo.findOne({ uid: user.uid });
            expect(existing).toBeDefined();
            if (existing) {
                expect(existing.uid).toBe(user.uid);
                expect(existing.version).toBe(user.version);
                expect(existing.firstName).toBe("David");
                expect(existing.lastName).toBe("Tennant");
                expect(existing.age).toBe(47);
            }
        });
    });

    describe("Multiple Document Tests [MongoDB]", () => {
        it("Can count documents (admin). [MongoDB]", async () => {
            const users: User[] = await createUsers(20);
            const token = JWTUtils.createToken(config.get("auth"), {
                uid: uuid.v4(),
                roles: config.get("trusted_roles")
            });
            const result = await request(server.getApplication())
                .get("/userswithacl/count")
                .set("Authorization", `jwt ${token}`);
            expect(result.status).toBeGreaterThanOrEqual(200);
            expect(result.status).toBeLessThan(300);
            expect(result).toHaveProperty("body");
            expect(result.body).toHaveProperty("count");
            expect(result.body.count).toBe(users.length);
        });

        it("Can count documents (user). [MongoDB]", async () => {
            const users: User[] = await createUsers(20);
            const token = JWTUtils.createToken(config.get("auth"), {
                uid: uuid.v4()
            });
            const result = await request(server.getApplication())
                .get("/userswithacl/count")
                .set("Authorization", `jwt ${token}`);
            expect(result.status).toBeGreaterThanOrEqual(200);
            expect(result.status).toBeLessThan(300);
            expect(result).toHaveProperty("body");
            expect(result.body).toHaveProperty("count");
            expect(result.body.count).toBe(users.length);
        });

        it("Cannot count documents (anonymous). [MongoDB]", async () => {
            const users: User[] = await createUsers(20);
            const result = await request(server.getApplication())
                .get("/userswithacl/count");
            expect(result.status).toBe(403);
        });

        it("Can count documents with criteria (eq) (admin). [MongoDB]", async () => {
            const users: User[] = await createUsers(13);
            await createUser("David", "Tennant", 47);
            await createUser("Matt", "Smith", 36);
            const token = JWTUtils.createToken(config.get("auth"), {
                uid: uuid.v4(),
                roles: config.get("trusted_roles")
            });
            const result = await request(server.getApplication())
                .get("/userswithacl/count?lastName=Doctor")
                .set("Authorization", `jwt ${token}`);
            expect(result.status).toBeGreaterThanOrEqual(200);
            expect(result.status).toBeLessThan(300);
            expect(result).toHaveProperty("body");
            console.log(result.body);
            expect(result.body).toHaveProperty("count");
            expect(result.body.count).toBe(users.length);
        });

        it("Can count documents with criteria (eq) (user). [MongoDB]", async () => {
            const users: User[] = await createUsers(13);
            await createUser("David", "Tennant", 47);
            await createUser("Matt", "Smith", 36);
            const token = JWTUtils.createToken(config.get("auth"), {
                uid: uuid.v4()
            });
            const result = await request(server.getApplication())
                .get("/userswithacl/count?lastName=Doctor")
                .set("Authorization", `jwt ${token}`);
            expect(result.status).toBeGreaterThanOrEqual(200);
            expect(result.status).toBeLessThan(300);
            expect(result).toHaveProperty("body");
            console.log(result.body);
            expect(result.body).toHaveProperty("count");
            expect(result.body.count).toBe(users.length);
        });

        it("Cannot count documents with criteria (eq) (anonymouos). [MongoDB]", async () => {
            const users: User[] = await createUsers(13);
            await createUser("David", "Tennant", 47);
            await createUser("Matt", "Smith", 36);
            const result = await request(server.getApplication()).get("/userswithacl/count?lastName=Doctor");
            expect(result.status).toBe(403);
        });

        it("Can find all documents (admin). [MongoDB]", async () => {
            const users: User[] = await createUsers(25);
            const token = JWTUtils.createToken(config.get("auth"), {
                uid: uuid.v4(),
                roles: config.get("trusted_roles")
            });
            const result = await request(server.getApplication())
                .get("/userswithacl")
                .set("Authorization", `jwt ${token}`);
            expect(result.status).toBeGreaterThanOrEqual(200);
            expect(result.status).toBeLessThan(300);
            expect(result).toHaveProperty("body");
            expect(result.body).toHaveLength(users.length);
        });

        it("Can find all documents (user). [MongoDB]", async () => {
            const users: User[] = await createUsers(25);
            const token = JWTUtils.createToken(config.get("auth"), {
                uid: uuid.v4()
            });
            const result = await request(server.getApplication())
                .get("/userswithacl")
                .set("Authorization", `jwt ${token}`);
            expect(result.status).toBeGreaterThanOrEqual(200);
            expect(result.status).toBeLessThan(300);
            expect(result).toHaveProperty("body");
            expect(result.body).toHaveLength(users.length);
        });

        it("Cannot find all documents (anonymous). [MongoDB]", async () => {
            const users: User[] = await createUsers(25);
            const result = await request(server.getApplication()).get("/userswithacl");
            expect(result.status).toBe(403);
        });

        it("Can find documents with criteria (eq) (admin) [MongoDB].", async () => {
            const users: User[] = await createUsers(13);
            await createUser("David", "Tennant", 47);
            await createUser("Matt", "Smith", 36);
            const token = JWTUtils.createToken(config.get("auth"), {
                uid: uuid.v4(),
                roles: config.get("trusted_roles")
            });
            const result = await request(server.getApplication())
                .get("/userswithacl?lastName=Doctor")
                .set("Authorization", `jwt ${token}`);
            expect(result.status).toBeGreaterThanOrEqual(200);
            expect(result.status).toBeLessThan(300);
            expect(result).toHaveProperty("body");
            expect(result.body).toHaveLength(users.length);
            for (const user of result.body) {
                expect(user.lastName).toBe("Doctor");
            }
        });

        it("Can find documents with criteria (eq) (user) [MongoDB].", async () => {
            const users: User[] = await createUsers(13);
            await createUser("David", "Tennant", 47);
            await createUser("Matt", "Smith", 36);
            const token = JWTUtils.createToken(config.get("auth"), {
                uid: uuid.v4()
            });
            const result = await request(server.getApplication())
                .get("/userswithacl?lastName=Doctor")
                .set("Authorization", `jwt ${token}`);
            expect(result.status).toBeGreaterThanOrEqual(200);
            expect(result.status).toBeLessThan(300);
            expect(result).toHaveProperty("body");
            expect(result.body).toHaveLength(users.length);
            for (const user of result.body) {
                expect(user.lastName).toBe("Doctor");
            }
        });

        it("Cannot find documents with criteria (eq) (anonymous) [MongoDB].", async () => {
            const users: User[] = await createUsers(13);
            await createUser("David", "Tennant", 47);
            await createUser("Matt", "Smith", 36);
            const result = await request(server.getApplication()).get("/userswithacl?lastName=Doctor");
            expect(result.status).toBe(403);
        });

        it("Can truncate datastore (admin) [MongoDB].", async () => {
            const users: User[] = await createUsers(25);
            const token = JWTUtils.createToken(config.get("auth"), {
                uid: uuid.v4(),
                roles: config.get("trusted_roles")
            });
            const result = await request(server.getApplication())
                .delete("/userswithacl")
                .set("Authorization", `jwt ${token}`);
            expect(result.status).toBe(204);

            const count: number = await repo.count();
            expect(count).toBe(0);
        });

        it("Cannot truncate datastore (user) [MongoDB].", async () => {
            const users: User[] = await createUsers(25);
            const token = JWTUtils.createToken(config.get("auth"), {
                uid: uuid.v4()
            });
            const result = await request(server.getApplication())
                .delete("/userswithacl")
                .set("Authorization", `jwt ${token}`);
            expect(result.status).toBe(403);

            const count: number = await repo.count();
            expect(count).toBe(users.length);
        });

        it("Cannot truncate datastore (anonymous) [MongoDB].", async () => {
            const users: User[] = await createUsers(25);
            const result = await request(server.getApplication()).delete("/userswithacl");
            expect(result.status).toBe(403);

            const count: number = await repo.count();
            expect(count).toBe(users.length);
        });
    });
});
