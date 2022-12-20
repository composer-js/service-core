///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2019 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import config from "./config";
import { BackgroundServiceManager } from "../src/BackgroundServiceManager";
import { ClassLoader, Logger } from "@composer-js/core";
import MyFirstService from "./server/jobs/MyFirstService";
import MySecondService from "./server/jobs/MySecondService";
import MyThirdService from "./server/jobs/MyThirdService";
import { ObjectFactory } from "../src/service_core";
import { MongoMemoryServer } from "mongodb-memory-server";

const mongod: MongoMemoryServer = new MongoMemoryServer({
    instance: {
        port: 9999,
        dbName: "axr-test",
    },
});

jest.setTimeout(10000);

describe.skip("BackgroundServiceManager Tests", () => {
    const classes: Map<string, any> = new Map();
    const objectFactory: ObjectFactory = new ObjectFactory(config, Logger());
    
    beforeAll(async () => {
        await mongod.start();
        const classLoader: ClassLoader = new ClassLoader("./test");
        await classLoader.load();
        classLoader.getClasses().forEach((clazz: any, name: string) => {
            if (name.startsWith("jobs.")) {
                classes.set(name, clazz);
            }
        });
    });

    afterAll(async () => {
        await mongod.stop();
        await objectFactory.destroy();
    })

    it("Can start/stop single background service.", async () => {
        const manager: BackgroundServiceManager = new BackgroundServiceManager(objectFactory, classes, config, Logger());
        await manager.start("MyFirstService");
        const service: MyFirstService = manager.getService("MyFirstService") as MyFirstService;
        expect(service).toBeDefined();
        expect(service.counter).toBe(0);
        expect(service.started).toBe(true);
        expect(service.stopped).toBe(false);

        const service2: MySecondService = manager.getService("MySecondService") as MySecondService;
        expect(service2).not.toBeDefined();
        const service3: MyThirdService = manager.getService("MyThirdService") as MyThirdService;
        expect(service3).not.toBeDefined();

        return new Promise<void>((resolve) => {
            setTimeout(async () => {
                const service: MyFirstService = manager.getService("MyFirstService") as MyFirstService;
                expect(service).toBeDefined();
                expect(service.counter).toBeGreaterThanOrEqual(5);
                expect(service.started).toBe(true);
                expect(service.stopped).toBe(false);

                await manager.stop("MyFirstService");
                expect(service.started).toBe(false);
                expect(service.stopped).toBe(true);
                resolve();
            }, 5000);
        });
    });

    it("Can start/stop multiple background services.", async () => {
        const manager: BackgroundServiceManager = new BackgroundServiceManager(objectFactory, classes, config, Logger());
        await manager.startAll();
        const service: MyFirstService = manager.getService("MyFirstService") as MyFirstService;
        expect(service).toBeDefined();
        expect(service.counter).toBe(0);
        expect(service.started).toBe(true);
        expect(service.stopped).toBe(false);

        const service2: MySecondService = manager.getService("MySecondService") as MySecondService;
        expect(service2).toBeDefined();
        expect(service2.counter).toBe(0);
        expect(service2.started).toBe(true);
        expect(service2.stopped).toBe(false);

        const service3: MyThirdService = manager.getService("MyThirdService") as MyThirdService;
        expect(service3).toBeDefined();
        expect(service3.counter).toBe(1);
        expect(service3.started).toBe(true);
        expect(service3.stopped).toBe(true);

        return new Promise<void>((resolve) => {
            setTimeout(async () => {
                const service: MyFirstService = manager.getService("MyFirstService") as MyFirstService;
                const service2: MySecondService = manager.getService("MySecondService") as MySecondService;
                const service3: MyThirdService = manager.getService("MyThirdService") as MyThirdService;

                await manager.stopAll();

                expect(service.counter).toBeGreaterThanOrEqual(5);
                expect(service2.counter).toBeGreaterThanOrEqual(5);
                expect(service3.counter).toBeLessThan(5);
                expect(service.started).toBe(false);
                expect(service.stopped).toBe(true);
                expect(service2.started).toBe(false);
                expect(service2.stopped).toBe(true);
                expect(service3.started).toBe(true);
                expect(service3.stopped).toBe(true);
                resolve();
            }, 5000);
        });
    });
});
