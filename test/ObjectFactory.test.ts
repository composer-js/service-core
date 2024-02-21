///////////////////////////////////////////////////////////////////////////////
// Copyright (C) AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import config from "./config";
import { ObjectFactory } from "../src/ObjectFactory";
import { Inject, Destroy } from "../src/decorators/ObjectDecorators";
import { Logger } from "@composer-js/core";
import { CircularClassA } from "./factory/CircularClassA";
import { CircularClassB } from "./factory/CircularClassB";

class TestClassA {
    @Destroy
    public destroy(): void {
        // no-op
    }
}

class TestClassB {
    public arg1: string;
    public arg2: number;

    constructor(arg1: string, arg2: number) {
        this.arg1 = arg1;
        this.arg2 = arg2;
    }

    @Destroy
    public async destroy(): Promise<void> {
        this.arg1 = "";
        this.arg2 = -1;
    }
}

class TestClassC {
    @Inject(TestClassA)
    public dep?: TestClassA;

    constructor() {
        // no-op
    }

    @Destroy
    public async destroy(): Promise<void> {
        this.dep = undefined;
    }
}

describe("ObjectFactory Tests", () => {
    const factory: ObjectFactory = new ObjectFactory(config, Logger());

    beforeEach(() => {
        factory.register(TestClassA);
        factory.register(TestClassB, TestClassB.name);
        factory.register(TestClassC);
        factory.register(CircularClassA);
        factory.register(CircularClassB);
    });

    afterEach(async () => {
        await factory.destroy();
    })

    it("Can create new class instances by name.", async () => {
        const instance: TestClassA = await factory.newInstance(TestClassA.name, "myInstance");
        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(TestClassA);
        expect(instance).toHaveProperty("_name");
        expect(instance["_name"]).toBe(`${TestClassA.name}:myInstance`);
        expect(instance).toHaveProperty("_fqn");
        expect(instance["_fqn"]).toBe(TestClassA.name);
    });

    it("Can create new class instances by type.", async () => {
        const instance: TestClassA = await factory.newInstance(TestClassA, "myInstance");
        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(TestClassA);
        expect(instance["_name"]).toBe(`${TestClassA.name}:myInstance`);
        expect(instance).toHaveProperty("_fqn");
        expect(instance["_fqn"]).toBe(TestClassA.name);
    });

    it("Can create new default class instances by name with circular dependencies.", async () => {
        const instance: CircularClassA = await factory.newInstance(CircularClassA.name, "default");
        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(CircularClassA);

        const dep: CircularClassB | undefined = factory.getInstance(CircularClassB);
        expect(dep).toBeDefined();
    });

    it("Can create new default class instances by type with circular dependencies.", async () => {
        const instance: CircularClassB = await factory.newInstance(CircularClassB, "default");
        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(CircularClassB);

        const dep: CircularClassA | undefined = factory.getInstance(CircularClassA);
        expect(dep).toBeDefined();
    });

    it("Can initialize existing objects.", async () => {
        const instance2: TestClassC = new TestClassC();
        await factory.initialize(instance2);
        expect(instance2.dep).toBeDefined();
        expect(instance2.dep).toBeInstanceOf(TestClassA);
    });

    it("Can create new class instances with constructor arguments.", async () => {
        const instance: TestClassB = await factory.newInstance(TestClassB.name, "myInstance", "hello", 1);
        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(TestClassB);
        expect(instance.arg1).toBe("hello");
        expect(instance.arg2).toBe(1);
    });

    it("Can force creation of new class instances.", async () => {
        const instance: TestClassB = await factory.newInstance(TestClassB.name, "myInstance", "hello", 1);
        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(TestClassB);
        expect(instance.arg1).toBe("hello");
        expect(instance.arg2).toBe(1);

        const instance2: TestClassB = await factory.newInstance(TestClassB.name, undefined, "world", 100);
        expect(instance2).toBeDefined();
        expect(instance2).toBeInstanceOf(TestClassB);
        expect(instance2.arg1).toBe("world");
        expect(instance2.arg2).toBe(100);
    });

    it("Can retrieve existing class instances by name.", async () => {
        const instance: TestClassA = await factory.newInstance(TestClassA.name, "myInstance");
        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(TestClassA);

        const instance2: TestClassA = await factory.newInstance(TestClassA.name, "myInstance");
        expect(instance2).toBeDefined();
        expect(instance2).toBeInstanceOf(TestClassA);
        expect(instance).toBe(instance2);

        const instance3: TestClassA = factory.getInstance("TestClassA:myInstance");
        expect(instance3).toBeDefined();
        expect(instance3).toBeInstanceOf(TestClassA);
        expect(instance).toBe(instance3);
    });

    it("Can retrieve existing class instances by type.", async () => {
        const instance: TestClassA = await factory.newInstance(TestClassA, "default");
        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(TestClassA);

        const instance2: TestClassA = factory.getInstance(TestClassA);
        expect(instance2).toBeDefined();
        expect(instance2).toBeInstanceOf(TestClassA);
        expect(instance).toBe(instance2);

        const instance3: TestClassA = factory.getInstance("TestClassA:default");
        expect(instance3).toBeDefined();
        expect(instance3).toBeInstanceOf(TestClassA);
        expect(instance).toBe(instance3);
    });

    it("Can retrieve existing class instances by type name.", async () => {
        const instance: TestClassA = await factory.newInstance(TestClassA, "default");
        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(TestClassA);

        const instance2: TestClassA = factory.getInstance(TestClassA.name);
        expect(instance2).toBeDefined();
        expect(instance2).toBeInstanceOf(TestClassA);
        expect(instance).toBe(instance2);

        const instance3: TestClassA = factory.getInstance("TestClassA:default");
        expect(instance3).toBeDefined();
        expect(instance3).toBeInstanceOf(TestClassA);
        expect(instance).toBe(instance3);
    });
});
