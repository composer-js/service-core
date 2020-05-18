///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2019 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import config from "./config";
import BackgroundServiceManager from "../src/BackgroundServiceManager";
import { Logger } from "../src/Logger";
import MyFirstService from "./jobs/MyFirstService";
import MySecondService from "./jobs/MySecondService";
import MyThirdService from "./jobs/MyThirdService";

const logger = Logger();
jest.setTimeout(10000);

describe("BackgroundServiceManager Tests", () => {
    it("Can start/stop single background service.", async (done: Function) => {
        const manager: BackgroundServiceManager = new BackgroundServiceManager("./test", config, logger);
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

        setTimeout(async () => {
            const service: MyFirstService = manager.getService("MyFirstService") as MyFirstService;
            expect(service).toBeDefined();
            expect(service.counter).toBeGreaterThanOrEqual(5);
            expect(service.started).toBe(true);
            expect(service.stopped).toBe(false);

            await manager.stop("MyFirstService");
            expect(service.started).toBe(false);
            expect(service.stopped).toBe(true);
            done();
        }, 5000);
    });
    it("Can start/stop multiple background services.", async (done: Function) => {
        const manager: BackgroundServiceManager = new BackgroundServiceManager("./test", config, logger);
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
        expect(service3.counter).toBe(0);
        expect(service3.started).toBe(true);
        expect(service3.stopped).toBe(false);

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
            expect(service3.started).toBe(false);
            expect(service3.stopped).toBe(true);
            done();
        }, 5000);
    });
});
