///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { default as config } from "../config";
import * as request from "supertest";
import { Server, ConnectionManager } from "../../src/service_core";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoRepository, Connection } from "typeorm";
import AccessControlListMongo, { ACLRecordMongo } from "../../src/security/AccessControlListMongo";
import { JWTUtils } from "@composer-js/core";
const uuid = require("uuid");

const mongod: MongoMemoryServer = new MongoMemoryServer({
    instance: {
        port: 9999,
        dbName: "axr-test",
    },
    autoStart: false,
});
let repo: MongoRepository<AccessControlListMongo>;
const server: Server = new Server(config, undefined, "./test");

const createACL = async (
    records: ACLRecordMongo[] = [],
    parentUid: string | undefined = undefined
): Promise<AccessControlListMongo> => {
    const acl: AccessControlListMongo = new AccessControlListMongo({
        records,
        parentUid,
    });

    return await repo.save(acl);
};

const createACLs = async (
    num: number,
    records: ACLRecordMongo[] = [],
    parentUid: string | undefined = undefined
): Promise<AccessControlListMongo[]> => {
    const results: AccessControlListMongo[] = [];

    for (let i = 1; i <= num; i++) {
        results.push(await createACL(records, parentUid));
    }

    return results;
};

jest.setTimeout(120000);
describe("ACLRouteMongo Tests", () => {
    const admin: any = {
        uid: uuid.v4(),
        roles: ["admin"],
    };
    const adminToken: string = JWTUtils.createToken(config.get("auth"), admin);
    const user: any = {
        uid: uuid.v4(),
    };
    const userToken: string = JWTUtils.createToken(config.get("auth"), user);

    beforeAll(async () => {
        await mongod.start();
        await server.start();
        const conn: any = ConnectionManager.connections.get("acl");
        if (conn instanceof Connection) {
            repo = conn.getMongoRepository(AccessControlListMongo);
        }
    });

    afterAll(async () => {
        await server.stop();
        await mongod.stop();
    });

    beforeEach(async () => {
        try {
            // Don't delete the default ACLs initialized by the server
            await repo.deleteMany({uid: { $nin: ["default_User", "User"] } });
        } catch (err) {
            // The error "ns not found" occurs when the collection doesn't exist yet. We can ignore this error.
            if (err.message != "ns not found") {
                throw err;
            }
        }
    });

    it("Can create ACL document.", async () => {
        const acl: AccessControlListMongo = new AccessControlListMongo({
            records: [
                new ACLRecordMongo({
                    userOrRoleId: "admin",
                    full: true,
                }),
                new ACLRecordMongo({
                    userOrRoleId: ".*",
                    create: true,
                    read: true,
                    update: false,
                    delete: false,
                }),
            ],
        });
        const result = await request(server.getApplication())
            .post("/acls")
            .send(acl)
            .set("Authorization", "jwt " + adminToken);
        expect(result).toHaveProperty("body");
        const resultACL: AccessControlListMongo = new AccessControlListMongo(result.body);
        expect(resultACL.uid).toEqual(acl.uid);
        expect(resultACL.version).toEqual(acl.version);
        expect(resultACL.records).toHaveLength(acl.records.length);
        for (const record of acl.records) {
            let found: boolean = false;
            for (const r2 of resultACL.records) {
                if (record.userOrRoleId === r2.userOrRoleId) {
                    found = true;
                    expect(record.create).toEqual(r2.create);
                    expect(record.delete).toEqual(r2.delete);
                    expect(record.full).toEqual(r2.full);
                    expect(record.read).toEqual(r2.read);
                    expect(record.special).toEqual(r2.special);
                    expect(record.update).toEqual(r2.update);
                    break;
                }
            }
            expect(found).toBeTruthy();
        }

        const stored: AccessControlListMongo | undefined = await repo.findOne({ uid: result.body.uid });
        expect(stored).toBeDefined();
        if (stored) {
            expect(stored.uid).toEqual(acl.uid);
            expect(stored.version).toEqual(acl.version);
            expect(stored.records).toHaveLength(acl.records.length);
            for (const record of acl.records) {
                let found: boolean = false;
                for (const r2 of stored.records) {
                    if (record.userOrRoleId === r2.userOrRoleId) {
                        found = true;
                        expect(record.create).toEqual(r2.create);
                        expect(record.delete).toEqual(r2.delete);
                        expect(record.full).toEqual(r2.full);
                        expect(record.read).toEqual(r2.read);
                        expect(record.special).toEqual(r2.special);
                        expect(record.update).toEqual(r2.update);
                        break;
                    }
                }
                expect(found).toBeTruthy();
            }
        }
    });

    it("Cannot create ACL document as non-admin.", async () => {
        const acl: AccessControlListMongo = new AccessControlListMongo({
            records: [
                new ACLRecordMongo({
                    userOrRoleId: "admin",
                    full: true,
                }),
                new ACLRecordMongo({
                    userOrRoleId: ".*",
                    create: true,
                    read: true,
                    update: false,
                    delete: false,
                }),
            ],
        });
        const result = await request(server.getApplication())
            .post("/acls")
            .send(acl)
            .set("Authorization", "jwt " + userToken);
        expect(result.status).toBe(403);

        const stored: AccessControlListMongo | undefined = await repo.findOne({ uid: acl.uid });
        expect(stored).toBeUndefined();
    });

    it("Cannot create ACL document as anonymous.", async () => {
        const acl: AccessControlListMongo = new AccessControlListMongo({
            records: [
                new ACLRecordMongo({
                    userOrRoleId: "admin",
                    full: true,
                }),
                new ACLRecordMongo({
                    userOrRoleId: ".*",
                    create: true,
                    read: true,
                    update: false,
                    delete: false,
                }),
            ],
        });
        const result = await request(server.getApplication())
            .post("/acls")
            .send(acl);
        expect(result.status).toBe(403);

        const stored: AccessControlListMongo | undefined = await repo.findOne({ uid: acl.uid });
        expect(stored).toBeUndefined();
    });

    it("Can delete ACL document.", async () => {
        const acl: AccessControlListMongo = await createACL();
        const result = await request(server.getApplication())
            .delete("/acls/" + acl.uid)
            .set("Authorization", "jwt " + adminToken);
        expect(result.status).toBe(204);

        const existing: AccessControlListMongo | undefined = await repo.findOne({ uid: acl.uid });
        expect(existing).toBeUndefined();
    });

    it("Cannot delete a default_ ACL document.", async () => {
        const result = await request(server.getApplication())
            .delete("/acls/default_User")
            .set("Authorization", "jwt " + adminToken);
        expect(result.status).toBe(403);

        const results: any[] = await repo.find();
        const count: number = await repo.count({ uid: "default_User" });
        expect(count).toBe(1);
    });
    it("Cannot delete ACL document as non-admin.", async () => {
        const acl: AccessControlListMongo = await createACL([
            new ACLRecordMongo({
                userOrRoleId: "admin",
                full: true,
            }),
            new ACLRecordMongo({
                userOrRoleId: ".*",
                create: false,
                read: true,
                update: false,
                delete: false,
            }),
            new ACLRecordMongo({
                userOrRoleId: "anonymous",
                create: false,
                read: true,
                update: false,
                delete: false,
            }),
        ]);
        const result = await request(server.getApplication())
            .delete("/acls/" + acl.uid)
            .set("Authorization", "jwt " + userToken);
        expect(result.status).toBe(403);

        const existing: AccessControlListMongo | undefined = await repo.findOne({ uid: acl.uid });
        expect(existing).toBeDefined();
    });

    it("Cannot delete ACL document as anonymous.", async () => {
        const acl: AccessControlListMongo = await createACL([
            new ACLRecordMongo({
                userOrRoleId: "admin",
                full: true,
            }),
            new ACLRecordMongo({
                userOrRoleId: ".*",
                create: false,
                read: true,
                update: false,
                delete: false,
            }),
            new ACLRecordMongo({
                userOrRoleId: "anonymous",
                create: false,
                read: true,
                update: false,
                delete: false,
            }),
        ]);
        const result = await request(server.getApplication()).delete("/acls/" + acl.uid);
        expect(result.status).toBe(403);

        const existing: AccessControlListMongo | undefined = await repo.findOne({ uid: acl.uid });
        expect(existing).toBeDefined();
    });

    it("Can find ACL document by id.", async () => {
        const acl: AccessControlListMongo = await createACL();
        const result = await request(server.getApplication())
            .get("/acls/" + acl.uid)
            .send()
            .set("Authorization", "jwt " + adminToken);
        expect(result).toHaveProperty("body");
        expect(result.body.uid).toEqual(acl.uid);
        expect(result.body.version).toEqual(acl.version);
    });

    it("Can update ACL document.", async () => {
        const acl: AccessControlListMongo = await createACL([
            new ACLRecordMongo({
                userOrRoleId: "admin",
                full: true,
            }),
        ]);
        acl.records.push(
            new ACLRecordMongo({
                userOrRoleId: ".*",
                create: true,
                read: true,
                update: false,
                delete: false,
            })
        );
        const result = await request(server.getApplication())
            .put("/acls/" + acl.uid)
            .send(acl)
            .set("Authorization", "jwt " + adminToken);
        expect(result).toHaveProperty("body");
        const resultACL: AccessControlListMongo = new AccessControlListMongo(result.body);
        expect(resultACL.uid).toBe(acl.uid);
        expect(resultACL.version).toBeGreaterThan(acl.version);
        for (const record of acl.records) {
            let found: boolean = false;
            for (const r2 of resultACL.records) {
                if (record.userOrRoleId === r2.userOrRoleId) {
                    found = true;
                    expect(record.create).toEqual(r2.create);
                    expect(record.delete).toEqual(r2.delete);
                    expect(record.full).toEqual(r2.full);
                    expect(record.read).toEqual(r2.read);
                    expect(record.special).toEqual(r2.special);
                    expect(record.update).toEqual(r2.update);
                    break;
                }
            }
            expect(found).toBeTruthy();
        }

        const existing: AccessControlListMongo | undefined = await repo.findOne({ uid: acl.uid });
        expect(existing).toBeDefined();
        if (existing) {
            expect(existing.uid).toBe(result.body.uid);
            expect(existing.version).toBe(result.body.version);
            for (const record of existing.records) {
                let found: boolean = false;
                for (const r2 of result.body.records) {
                    if (record.userOrRoleId === r2.userOrRoleId) {
                        found = true;
                        expect(record.create).toEqual(r2.create);
                        expect(record.delete).toEqual(r2.delete);
                        expect(record.full).toEqual(r2.full);
                        expect(record.read).toEqual(r2.read);
                        expect(record.special).toEqual(r2.special);
                        expect(record.update).toEqual(r2.update);
                        break;
                    }
                }
                expect(found).toBeTruthy();
            }
        }
    });

    it("Can update ACL document as non-admin with permission.", async () => {
        const acl: AccessControlListMongo = await createACL([
            new ACLRecordMongo({
                userOrRoleId: "admin",
                full: true,
            }),
            new ACLRecordMongo({
                userOrRoleId: ".*",
                create: true,
                read: true,
                update: true,
                delete: false,
            }),
        ]);
        acl.records.push(
            new ACLRecordMongo({
                userOrRoleId: "anonymous",
                create: false,
                read: true,
                update: false,
                delete: false,
            })
        );
        const result = await request(server.getApplication())
            .put("/acls/" + acl.uid)
            .send(acl)
            .set("Authorization", "jwt " + userToken);
        const resultACL: AccessControlListMongo = new AccessControlListMongo(result.body);
        expect(resultACL.uid).toBe(acl.uid);
        expect(resultACL.version).toBeGreaterThan(acl.version);
        for (const record of acl.records) {
            let found: boolean = false;
            for (const r2 of resultACL.records) {
                if (record.userOrRoleId === r2.userOrRoleId) {
                    found = true;
                    expect(record.create).toEqual(r2.create);
                    expect(record.delete).toEqual(r2.delete);
                    expect(record.full).toEqual(r2.full);
                    expect(record.read).toEqual(r2.read);
                    expect(record.special).toEqual(r2.special);
                    expect(record.update).toEqual(r2.update);
                    break;
                }
            }
            expect(found).toBeTruthy();
        }

        const existing: AccessControlListMongo | undefined = await repo.findOne({ uid: acl.uid });
        expect(existing).toBeDefined();
        if (existing) {
            expect(existing.uid).toBe(result.body.uid);
            expect(existing.version).toBe(result.body.version);
            for (const record of existing.records) {
                let found: boolean = false;
                for (const r2 of result.body.records) {
                    if (record.userOrRoleId === r2.userOrRoleId) {
                        found = true;
                        expect(record.create).toEqual(r2.create);
                        expect(record.delete).toEqual(r2.delete);
                        expect(record.full).toEqual(r2.full);
                        expect(record.read).toEqual(r2.read);
                        expect(record.special).toEqual(r2.special);
                        expect(record.update).toEqual(r2.update);
                        break;
                    }
                }
                expect(found).toBeTruthy();
            }
        }
    });

    it("Cannot update ACL document as non-admin without permission.", async () => {
        const acl: AccessControlListMongo = await createACL([
            new ACLRecordMongo({
                userOrRoleId: "admin",
                full: true,
            }),
            new ACLRecordMongo({
                userOrRoleId: ".*",
                create: false,
                read: true,
                update: false,
                delete: false,
            }),
        ]);
        acl.records.push(
            new ACLRecordMongo({
                userOrRoleId: "anonymous",
                create: false,
                read: true,
                update: false,
                delete: false,
            })
        );
        const result = await request(server.getApplication())
            .put("/acls/" + acl.uid)
            .send(acl)
            .set("Authorization", "jwt " + userToken);
        expect(result.status).toBe(403);
    });

    it("Cannot update ACL document as anonymous.", async () => {
        const acl: AccessControlListMongo = await createACL([
            new ACLRecordMongo({
                userOrRoleId: "admin",
                full: true,
            }),
            new ACLRecordMongo({
                userOrRoleId: ".*",
                create: false,
                read: true,
                update: false,
                delete: false,
            }),
            new ACLRecordMongo({
                userOrRoleId: "anonymous",
                create: false,
                read: true,
                update: false,
                delete: false,
            }),
        ]);
        acl.records.push(
            new ACLRecordMongo({
                userOrRoleId: ".*",
                create: true,
                read: true,
                update: false,
                delete: false,
            })
        );
        const result = await request(server.getApplication())
            .put("/acls/" + acl.uid)
            .send(acl);
        expect(result.status).toBe(403);
    });

    it("Cannot update default_ ACL document.", async () => {
        const acl: AccessControlListMongo | undefined = await repo.findOne({uid: "default_User"});
        expect(acl).toBeDefined();
        if (acl) {
            acl.records = [];

            const result = await request(server.getApplication())
                .put("/acls/" + acl.uid)
                .set("Authorization", "jwt " + adminToken)
                .send(acl);
            expect(result.status).toBe(403);
        }
    });

    it("Can find all ACL documents.", async () => {
        const acls: AccessControlListMongo[] = await createACLs(5);
        const result = await request(server.getApplication())
            .get("/acls")
            .set("Authorization", "jwt " + adminToken);
        expect(result).toHaveProperty("body");
        // Add two to the ACL length to cover default_User and User
        expect(result.body).toHaveLength(acls.length + 2);
    });

    it("Can find ACL documents with criteria (eq).", async () => {
        const parentUid: string = uuid.v4();
        const acls: AccessControlListMongo[] = await createACLs(5, [], parentUid);
        await createACLs(5, [], uuid.v4());
        await createACLs(5, [], uuid.v4());
        const result = await request(server.getApplication())
            .get("/acls?parentUid=" + parentUid)
            .set("Authorization", "jwt " + adminToken);
        expect(result).toHaveProperty("body");
        expect(result.body).toHaveLength(acls.length);
        for (const acl of result.body) {
            expect(acl.parentUid).toBe(parentUid);
        }
    });
});
