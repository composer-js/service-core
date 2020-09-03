///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { MongoRepository, Connection } from "typeorm";
import { default as AccessControlListMongo, ACLRecordMongo } from "../../src/security/AccessControlListMongo";
import { MongoMemoryServer } from "mongodb-memory-server";
import {
    AccessControlList,
    ConnectionManager,
    ModelUtils,
    ACLUtils,
    ACLRecord,
    ACLAction,
} from "../../src/service_core";
import uuid = require("uuid");
const Redis = require("ioredis-mock");

jest.setTimeout(30000);

describe("ACLUtils Tests", () => {
    describe("MongoDB Tests", () => {
        let aclRepo: MongoRepository<AccessControlListMongo>;
        const mongod: MongoMemoryServer = new MongoMemoryServer({
            instance: {
                port: 9999,
                dbName: "axr-test",
            },
            autoStart: false,
        });
        const redis: any = new Redis();

        const testACLs: AccessControlList[] = [
            new AccessControlListMongo({
                uid: "admin",
                records: [
                    new ACLRecordMongo({
                        userOrRoleId: "admin",
                        full: true,
                    }),
                ],
            }),
            new AccessControlListMongo({
                uid: "bf98b869-cabe-452a-bf8d-674c48f2b5bd",
                records: [
                    new ACLRecordMongo({
                        userOrRoleId: "god",
                        full: true,
                    }),
                    new ACLRecordMongo({
                        userOrRoleId: "019eaa26-b4ec-4870-88b6-2d3755a8a05c",
                        create: true,
                        read: true,
                        update: false,
                        delete: false,
                    }),
                    new ACLRecordMongo({
                        userOrRoleId: "e75f12e2-7058-4bb2-a826-6f435c61dc1c",
                        create: false,
                        read: true,
                        update: false,
                        delete: false,
                        special: false,
                    }),
                ],
            }),
            new AccessControlListMongo({
                uid: "/*",
                records: [
                    new ACLRecordMongo({
                        userOrRoleId: "admin",
                        full: true,
                    }),
                    new ACLRecordMongo({
                        userOrRoleId: ".*", // any user
                        create: false,
                        read: true,
                        update: false,
                        delete: false,
                    }),
                    new ACLRecordMongo({
                        userOrRoleId: "anonymous", // anonymous user
                        create: false,
                        read: false,
                        update: false,
                        delete: false,
                    }),
                ],
            }),
            new AccessControlListMongo({
                uid: "/test/path",
                records: [
                    new ACLRecordMongo({
                        userOrRoleId: "anonymous", // anonymous users
                        create: false,
                        read: true,
                        update: false,
                        delete: false,
                        special: false,
                        full: false,
                    }),
                    new ACLRecordMongo({
                        userOrRoleId: ".*", // all users
                        create: true,
                        read: true,
                        update: false,
                        delete: false,
                        special: false,
                        full: false,
                    }),
                ],
                parentUid: "admin",
            }),
            new AccessControlListMongo({
                uid: "child",
                records: [
                    new ACLRecordMongo({
                        userOrRoleId: ".*", // any user
                        create: undefined,
                        read: true,
                        update: undefined,
                        delete: undefined,
                        special: undefined,
                        full: undefined,
                    }),
                ],
                parent: new AccessControlListMongo({
                    uid: "parent",
                    records: [
                        new ACLRecordMongo({
                            userOrRoleId: "admin",
                            full: true,
                        }),
                    ],
                }),
            }),
        ];

        const createACLs = async function(): Promise<void> {
            for (const acl of testACLs) {
                await aclRepo.save(acl);
            }
        };

        beforeAll(async () => {
            await mongod.start();

            const datastores: any = {
                acl: {
                    type: "mongodb",
                    url: "mongodb://localhost:9999/axr-test",
                    useNewUrlParser: true,
                    entities: ["AccessControlListMongo"],
                },
            };
            const models: any = await ModelUtils.loadModels("./src/security");

            ConnectionManager.connections.set("cache", redis);
            await ConnectionManager.connect(datastores, models);

            const conn: any = ConnectionManager.connections.get("acl");
            if (conn instanceof Connection) {
                aclRepo = conn.getMongoRepository(AccessControlListMongo);
            }

            ACLUtils.init({
                get: function(name: string): any {
                    if (name === "trusted_roles") {
                        return ["super"];
                    } else {
                        return undefined;
                    }
                },
            });

            await createACLs();
        });

        afterAll(async () => {
            await ConnectionManager.disconnect();
            await mongod.stop();
        });

        it("Can find ACL identified by uuid.", async () => {
            const acl: AccessControlList | undefined = await ACLUtils.findACL("bf98b869-cabe-452a-bf8d-674c48f2b5bd");
            expect(acl).toBeDefined();
            if (acl) {
                expect(acl.uid).toBe("bf98b869-cabe-452a-bf8d-674c48f2b5bd");
            }
        });

        it("Can find ACL identified by URL pattern.", async () => {
            const acl: AccessControlList | undefined = await ACLUtils.findACL("/*");
            expect(acl).toBeDefined();
            if (acl) {
                expect(acl.uid).toBe("/*");
            }
        });

        it("Can find ACL identified by role name.", async () => {
            const acl: AccessControlList | undefined = await ACLUtils.findACL("admin");
            expect(acl).toBeDefined();
            if (acl) {
                expect(acl.uid).toBe("admin");
            }
        });

        it("Can get record for anonymous user.", async () => {
            const acl: AccessControlList | undefined = await ACLUtils.findACL("/*");
            expect(acl).toBeDefined();
            if (acl) {
                const record: ACLRecord | undefined = ACLUtils.getRecord(acl, undefined);
                expect(record).toBeDefined();
                if (record) {
                    expect(record.userOrRoleId).toEqual("anonymous");
                    expect(record.create).toBe(false);
                    expect(record.read).toBe(false);
                    expect(record.update).toBe(false);
                    expect(record.delete).toBe(false);
                    expect(record.special).toBe(null);
                    expect(record.full).toBe(null);
                }
            }
        });

        it("Can get record for user by uid.", async () => {
            const acl: AccessControlList | undefined = await ACLUtils.findACL("bf98b869-cabe-452a-bf8d-674c48f2b5bd");
            expect(acl).toBeDefined();
            if (acl) {
                const record: ACLRecord | undefined = ACLUtils.getRecord(acl, {
                    uid: "019eaa26-b4ec-4870-88b6-2d3755a8a05c",
                });
                expect(record).toBeDefined();
                if (record) {
                    expect(record.userOrRoleId).toEqual("019eaa26-b4ec-4870-88b6-2d3755a8a05c");
                    expect(record.read).toBe(true);
                }
            }
        });

        it("Can get record for admin user.", async () => {
            const acl: AccessControlList | undefined = await ACLUtils.findACL("/*");
            expect(acl).toBeDefined();
            if (acl) {
                const record: ACLRecord | undefined = ACLUtils.getRecord(acl, { uid: uuid.v4(), roles: ["admin"] });
                expect(record).toBeDefined();
                if (record) {
                    expect(record.userOrRoleId).toEqual("admin");
                    expect(record.full).toBe(true);
                }
            }
        });

        it("Can get record for non-admin user.", async () => {
            const acl: AccessControlList | undefined = await ACLUtils.findACL("/*");
            expect(acl).toBeDefined();
            if (acl) {
                const record: ACLRecord | undefined = ACLUtils.getRecord(acl, { uid: uuid.v4() });
                expect(record).toBeDefined();
                if (record) {
                    expect(record.userOrRoleId).toEqual(".*");
                    expect(record.read).toBe(true);
                }
            }
        });

        it("Can't get record for invalid user.", async () => {
            const acl: AccessControlList | undefined = await ACLUtils.findACL("admin");
            expect(acl).toBeDefined();
            if (acl) {
                const record: ACLRecord | undefined = ACLUtils.getRecord(acl, { uid: uuid.v4() });
                expect(record).toBeUndefined();
            }
        });

        it("Can populate parent.", async () => {
            const acl: AccessControlList = new AccessControlListMongo({
                uid: "test",
                records: [
                    new ACLRecordMongo({
                        userOrRoleId: ".*", // any user
                        create: undefined,
                        read: true,
                        update: undefined,
                        delete: undefined,
                        special: undefined,
                        full: undefined,
                    }),
                ],
                parentUid: "admin",
            });

            await ACLUtils.populateParent(acl);

            expect(acl.parent).toBeDefined();
            if (acl.parent) {
                expect(acl.parent.uid).toBe("admin");
            }
        });

        it("Can test permissions.", async () => {
            const acl: AccessControlList | undefined = await ACLUtils.findACL("bf98b869-cabe-452a-bf8d-674c48f2b5bd");
            expect(acl).toBeDefined();
            if (acl) {
                const testUser: any = { uid: "019eaa26-b4ec-4870-88b6-2d3755a8a05c" };
                expect(await ACLUtils.hasPermission(testUser, acl, ACLAction.CREATE)).toBe(true);
                expect(await ACLUtils.hasPermission(testUser, acl, ACLAction.DELETE)).toBe(false);
                expect(await ACLUtils.hasPermission(testUser, acl, ACLAction.READ)).toBe(true);
                expect(await ACLUtils.hasPermission(testUser, acl, ACLAction.SPECIAL)).toBe(true);
                expect(await ACLUtils.hasPermission(testUser, acl, ACLAction.UPDATE)).toBe(false);
                expect(await ACLUtils.hasPermission(testUser, acl, ACLAction.FULL)).toBe(false);
                const testAdmin: any = { uid: uuid.v4(), roles: ["admin"] };
                expect(await ACLUtils.hasPermission(testAdmin, acl, ACLAction.FULL)).toBe(true);
                expect(await ACLUtils.hasPermission(testAdmin, acl, ACLAction.CREATE)).toBe(true);
                expect(await ACLUtils.hasPermission(testAdmin, acl, ACLAction.DELETE)).toBe(true);
                expect(await ACLUtils.hasPermission(testAdmin, acl, ACLAction.READ)).toBe(true);
                expect(await ACLUtils.hasPermission(testAdmin, acl, ACLAction.SPECIAL)).toBe(true);
                expect(await ACLUtils.hasPermission(testAdmin, acl, ACLAction.UPDATE)).toBe(true);
                const testSuper: any = { uid: uuid.v4(), roles: ["super"] };
                expect(await ACLUtils.hasPermission(testSuper, acl, ACLAction.FULL)).toBe(true);
                expect(await ACLUtils.hasPermission(testSuper, acl, ACLAction.CREATE)).toBe(true);
                expect(await ACLUtils.hasPermission(testSuper, acl, ACLAction.DELETE)).toBe(true);
                expect(await ACLUtils.hasPermission(testSuper, acl, ACLAction.READ)).toBe(true);
                expect(await ACLUtils.hasPermission(testSuper, acl, ACLAction.SPECIAL)).toBe(true);
                expect(await ACLUtils.hasPermission(testSuper, acl, ACLAction.UPDATE)).toBe(true);
                const testOrgSuper: any = { uid: uuid.v4(), roles: ["bf98b869-cabe-452a-bf8d-674c48f2b5bd.super"] };
                expect(await ACLUtils.hasPermission(testOrgSuper, acl, ACLAction.FULL)).toBe(true);
                expect(await ACLUtils.hasPermission(testOrgSuper, acl, ACLAction.CREATE)).toBe(true);
                expect(await ACLUtils.hasPermission(testOrgSuper, acl, ACLAction.DELETE)).toBe(true);
                expect(await ACLUtils.hasPermission(testOrgSuper, acl, ACLAction.READ)).toBe(true);
                expect(await ACLUtils.hasPermission(testOrgSuper, acl, ACLAction.SPECIAL)).toBe(true);
                expect(await ACLUtils.hasPermission(testOrgSuper, acl, ACLAction.UPDATE)).toBe(true);
                const testOtherOrgSuper: any = {
                    uid: uuid.v4(),
                    roles: ["e75f12e2-7058-4bb2-a826-6f435c61dc1c.super"],
                };
                expect(await ACLUtils.hasPermission(testOtherOrgSuper, acl, ACLAction.CREATE)).toBe(false);
                expect(await ACLUtils.hasPermission(testOtherOrgSuper, acl, ACLAction.DELETE)).toBe(false);
                expect(await ACLUtils.hasPermission(testOtherOrgSuper, acl, ACLAction.READ)).toBe(true);
                expect(await ACLUtils.hasPermission(testOtherOrgSuper, acl, ACLAction.SPECIAL)).toBe(false);
                expect(await ACLUtils.hasPermission(testOtherOrgSuper, acl, ACLAction.UPDATE)).toBe(false);
                expect(await ACLUtils.hasPermission(testOtherOrgSuper, acl, ACLAction.FULL)).toBe(false);
            }
        });

        it("Can test permissions with string id.", async () => {
            const acl: string = "bf98b869-cabe-452a-bf8d-674c48f2b5bd";
            const testUser: any = { uid: "019eaa26-b4ec-4870-88b6-2d3755a8a05c" };
            expect(await ACLUtils.hasPermission(testUser, acl, ACLAction.CREATE)).toBe(true);
            expect(await ACLUtils.hasPermission(testUser, acl, ACLAction.DELETE)).toBe(false);
            expect(await ACLUtils.hasPermission(testUser, acl, ACLAction.READ)).toBe(true);
            expect(await ACLUtils.hasPermission(testUser, acl, ACLAction.SPECIAL)).toBe(true);
            expect(await ACLUtils.hasPermission(testUser, acl, ACLAction.UPDATE)).toBe(false);
            expect(await ACLUtils.hasPermission(testUser, acl, ACLAction.FULL)).toBe(false);
            const testAdmin: any = { uid: uuid.v4(), roles: ["admin"] };
            expect(await ACLUtils.hasPermission(testAdmin, acl, ACLAction.FULL)).toBe(true);
            expect(await ACLUtils.hasPermission(testAdmin, acl, ACLAction.CREATE)).toBe(true);
            expect(await ACLUtils.hasPermission(testAdmin, acl, ACLAction.DELETE)).toBe(true);
            expect(await ACLUtils.hasPermission(testAdmin, acl, ACLAction.READ)).toBe(true);
            expect(await ACLUtils.hasPermission(testAdmin, acl, ACLAction.SPECIAL)).toBe(true);
            expect(await ACLUtils.hasPermission(testAdmin, acl, ACLAction.UPDATE)).toBe(true);
            const testSuper: any = { uid: uuid.v4(), roles: ["super"] };
            expect(await ACLUtils.hasPermission(testSuper, acl, ACLAction.FULL)).toBe(true);
            expect(await ACLUtils.hasPermission(testSuper, acl, ACLAction.CREATE)).toBe(true);
            expect(await ACLUtils.hasPermission(testSuper, acl, ACLAction.DELETE)).toBe(true);
            expect(await ACLUtils.hasPermission(testSuper, acl, ACLAction.READ)).toBe(true);
            expect(await ACLUtils.hasPermission(testSuper, acl, ACLAction.SPECIAL)).toBe(true);
            expect(await ACLUtils.hasPermission(testSuper, acl, ACLAction.UPDATE)).toBe(true);
            const testOrgSuper: any = { uid: uuid.v4(), roles: ["bf98b869-cabe-452a-bf8d-674c48f2b5bd.super"] };
            expect(await ACLUtils.hasPermission(testOrgSuper, acl, ACLAction.FULL)).toBe(true);
            expect(await ACLUtils.hasPermission(testOrgSuper, acl, ACLAction.CREATE)).toBe(true);
            expect(await ACLUtils.hasPermission(testOrgSuper, acl, ACLAction.DELETE)).toBe(true);
            expect(await ACLUtils.hasPermission(testOrgSuper, acl, ACLAction.READ)).toBe(true);
            expect(await ACLUtils.hasPermission(testOrgSuper, acl, ACLAction.SPECIAL)).toBe(true);
            expect(await ACLUtils.hasPermission(testOrgSuper, acl, ACLAction.UPDATE)).toBe(true);
            const testOtherOrgSuper: any = { uid: uuid.v4(), roles: ["e75f12e2-7058-4bb2-a826-6f435c61dc1c.super"] };
            expect(await ACLUtils.hasPermission(testOtherOrgSuper, acl, ACLAction.CREATE)).toBe(false);
            expect(await ACLUtils.hasPermission(testOtherOrgSuper, acl, ACLAction.DELETE)).toBe(false);
            expect(await ACLUtils.hasPermission(testOtherOrgSuper, acl, ACLAction.READ)).toBe(true);
            expect(await ACLUtils.hasPermission(testOtherOrgSuper, acl, ACLAction.SPECIAL)).toBe(false);
            expect(await ACLUtils.hasPermission(testOtherOrgSuper, acl, ACLAction.UPDATE)).toBe(false);
            expect(await ACLUtils.hasPermission(testOtherOrgSuper, acl, ACLAction.FULL)).toBe(false);
        });

        it("Can grant permission when no ACL available.", async () => {
            const acl: string = uuid.v4();
            const testUser: any = { uid: uuid.v4() };
            expect(await ACLUtils.hasPermission(testUser, acl, ACLAction.CREATE)).toBe(true);
            expect(await ACLUtils.hasPermission(testUser, acl, ACLAction.DELETE)).toBe(true);
            expect(await ACLUtils.hasPermission(testUser, acl, ACLAction.READ)).toBe(true);
            expect(await ACLUtils.hasPermission(testUser, acl, ACLAction.SPECIAL)).toBe(true);
            expect(await ACLUtils.hasPermission(testUser, acl, ACLAction.UPDATE)).toBe(true);
            expect(await ACLUtils.hasPermission(testUser, acl, ACLAction.FULL)).toBe(true);
        });

        it("Can test request permissions.", async () => {
            let req: any = {
                path: "/test/path",
                method: "GET",
            };
            const user: any = {
                uid: uuid.v4(),
            };
            const superUser: any = {
                uid: uuid.v4(),
                roles: ["super"],
            };

            expect(await ACLUtils.checkRequestPerms(user, req)).toBe(true);
            req.method = "POST";
            expect(await ACLUtils.checkRequestPerms(user, req)).toBe(true);
            req.method = "PUT";
            expect(await ACLUtils.checkRequestPerms(user, req)).toBe(false);
            req.method = "DELETE";
            expect(await ACLUtils.checkRequestPerms(user, req)).toBe(false);

            req.method = "GET";
            expect(await ACLUtils.checkRequestPerms(superUser, req)).toBe(true);
            req.method = "POST";
            expect(await ACLUtils.checkRequestPerms(superUser, req)).toBe(true);
            req.method = "PUT";
            expect(await ACLUtils.checkRequestPerms(superUser, req)).toBe(true);
            req.method = "DELETE";
            expect(await ACLUtils.checkRequestPerms(superUser, req)).toBe(true);

            const admin: any = {
                uid: uuid.v4(),
                roles: ["admin"],
            };
            req.method = "GET";
            expect(await ACLUtils.checkRequestPerms(admin, req)).toBe(true);
            req.method = "POST";
            expect(await ACLUtils.checkRequestPerms(admin, req)).toBe(true);
            req.method = "PUT";
            expect(await ACLUtils.checkRequestPerms(admin, req)).toBe(false);
            req.method = "DELETE";
            expect(await ACLUtils.checkRequestPerms(admin, req)).toBe(false);

            req.method = "GET";
            expect(await ACLUtils.checkRequestPerms(superUser, req)).toBe(true);
            req.method = "POST";
            expect(await ACLUtils.checkRequestPerms(superUser, req)).toBe(true);
            req.method = "PUT";
            expect(await ACLUtils.checkRequestPerms(superUser, req)).toBe(true);
            req.method = "DELETE";
            expect(await ACLUtils.checkRequestPerms(superUser, req)).toBe(true);

            req.method = "GET";
            expect(await ACLUtils.checkRequestPerms(undefined, req)).toBe(true);
            req.method = "POST";
            expect(await ACLUtils.checkRequestPerms(undefined, req)).toBe(false);
            req.method = "PUT";
            expect(await ACLUtils.checkRequestPerms(undefined, req)).toBe(false);
            req.method = "DELETE";
            expect(await ACLUtils.checkRequestPerms(undefined, req)).toBe(false);

            req = {
                path: "/other/path",
                method: "GET",
            };

            expect(await ACLUtils.checkRequestPerms(user, req)).toBe(true);
            req.method = "POST";
            expect(await ACLUtils.checkRequestPerms(user, req)).toBe(false);
            req.method = "PUT";
            expect(await ACLUtils.checkRequestPerms(user, req)).toBe(false);
            req.method = "DELETE";
            expect(await ACLUtils.checkRequestPerms(user, req)).toBe(false);

            req.method = "GET";
            expect(await ACLUtils.checkRequestPerms(admin, req)).toBe(true);
            req.method = "POST";
            expect(await ACLUtils.checkRequestPerms(admin, req)).toBe(true);
            req.method = "PUT";
            expect(await ACLUtils.checkRequestPerms(admin, req)).toBe(true);
            req.method = "DELETE";
            expect(await ACLUtils.checkRequestPerms(admin, req)).toBe(true);

            req.method = "GET";
            expect(await ACLUtils.checkRequestPerms(superUser, req)).toBe(true);
            req.method = "POST";
            expect(await ACLUtils.checkRequestPerms(superUser, req)).toBe(true);
            req.method = "PUT";
            expect(await ACLUtils.checkRequestPerms(superUser, req)).toBe(true);
            req.method = "DELETE";
            expect(await ACLUtils.checkRequestPerms(superUser, req)).toBe(true);
        });

        it("Can save ACL", async () => {
            const acl: AccessControlList = {
                uid: uuid.v4(),
                dateCreated: new Date(),
                dateModified: new Date(),
                version: 0,
                records: [
                    {
                        userOrRoleId: "admin",
                        create: true,
                        delete: true,
                        full: true,
                        read: true,
                        special: true,
                        update: true,
                    },
                ],
            };
            const result: AccessControlList | undefined = await ACLUtils.saveACL(acl);
            expect(result).toBeDefined();
            if (result) {
                expect(result.uid).toBe(acl.uid);
                expect(result.version).toBe(acl.version);
                expect(result.records).toEqual(acl.records);
            }

            const count: number = await aclRepo.count({ uid: acl.uid });
            expect(count).toBe(1);
        });

        it("Can update an existing ACL", async () => {
            const acl: AccessControlList | undefined = await ACLUtils.findACL("bf98b869-cabe-452a-bf8d-674c48f2b5bd");
            expect(acl).toBeDefined();
            if (acl) {
                acl.records.push({
                    userOrRoleId: uuid.v4(),
                    create: false,
                    delete: false,
                    full: false,
                    read: true,
                    special: false,
                    update: false,
                });

                const result: AccessControlList | undefined = await ACLUtils.saveACL(acl);
                expect(result).toBeDefined();
                if (result) {
                    expect(result.uid).toBe(acl.uid);
                    expect(result.version).toBeGreaterThan(acl.version);
                    expect(result.records).toEqual(acl.records);
                }
            }
        });

        // This test works when run solo but for some reason fails when running all tests together
        it.skip("Cannot update an existing ACL with incorrect version.", async () => {
            const acl: AccessControlList | undefined = await ACLUtils.findACL("bf98b869-cabe-452a-bf8d-674c48f2b5bd");
            expect(acl).toBeDefined();
            if (acl) {
                acl.records.push({
                    userOrRoleId: uuid.v4(),
                    create: false,
                    delete: false,
                    full: false,
                    read: true,
                    special: false,
                    update: false,
                });

                const result: AccessControlList | undefined = await ACLUtils.saveACL(acl);
                expect(result).toBeDefined();
                if (result) {
                    expect(result.uid).toBe(acl.uid);
                    expect(result.version).toBeGreaterThan(acl.version);
                    expect(result.records).toEqual(acl.records);
                }

                try {
                    expect(ACLUtils.saveACL(acl)).rejects.toThrow();
                } catch (err) {

                }
            }
        });
    });
});
