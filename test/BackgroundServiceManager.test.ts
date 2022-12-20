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

jest.setTimeout(10000);

describe("BackgroundServiceManager Tests", () => {
    const classLoader: ClassLoader = new ClassLoader("./test/server");
    const objectFactory: ObjectFactory = new ObjectFactory(config, Logger());

    beforeAll(async () => {
        await classLoader.load();
    });

    afterAll(async () => {
        await objectFactory.destroy();
    })

    it.skip("Can start/stop single background service.", async () => {
        const manager: BackgroundServiceManager = new BackgroundServiceManager(objectFactory, classLoader, config, Logger());
        await manager.start("jobs.MyFirstService");
        const service: MyFirstService = manager.getService("jobs.MyFirstService") as MyFirstService;
        expect(service).toBeDefined();
        expect(service.counter).toBe(0);
        expect(service.started).toBe(true);
        expect(service.stopped).toBe(false);

        const service2: MySecondService = manager.getService("jobs.MySecondService") as MySecondService;
        expect(service2).not.toBeDefined();
        const service3: MyThirdService = manager.getService("jobs.MyThirdService") as MyThirdService;
        expect(service3).not.toBeDefined();

        return new Promise<void>((resolve) => {
            setTimeout(async () => {
                const service: MyFirstService = manager.getService("jobs.MyFirstService") as MyFirstService;
                expect(service).toBeDefined();
                expect(service.counter).toBeGreaterThanOrEqual(5);
                expect(service.started).toBe(true);
                expect(service.stopped).toBe(false);

                await manager.stop("jobs.MyFirstService");
                expect(service.started).toBe(false);
                expect(service.stopped).toBe(true);
                resolve();
            }, 5000);
        });
    });

    it("Can start/stop multiple background services.", async () => {
        const manager: BackgroundServiceManager = new BackgroundServiceManager(objectFactory, classLoader, config, Logger());
        await manager.startAll();
        const service: MyFirstService = manager.getService("jobs.MyFirstService") as MyFirstService;
        expect(service).toBeDefined();
        expect(service.counter).toBe(0);
        expect(service.started).toBe(true);
        expect(service.stopped).toBe(false);

        const service2: MySecondService = manager.getService("jobs.MySecondService") as MySecondService;
        expect(service2).toBeDefined();
        expect(service2.counter).toBe(0);
        expect(service2.started).toBe(true);
        expect(service2.stopped).toBe(false);

        const service3: MyThirdService = manager.getService("jobs.MyThirdService") as MyThirdService;
        expect(service3).toBeDefined();
        expect(service3.counter).toBe(1);
        expect(service3.started).toBe(true);
        expect(service3.stopped).toBe(true);

        return new Promise<void>((resolve) => {
            setTimeout(async () => {
                const service: MyFirstService = manager.getService("jobs.MyFirstService") as MyFirstService;
                const service2: MySecondService = manager.getService("jobs.MySecondService") as MySecondService;
                const service3: MyThirdService = manager.getService("jobs.MyThirdService") as MyThirdService;

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
