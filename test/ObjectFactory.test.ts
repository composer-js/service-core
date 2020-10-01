///////////////////////////////////////////////////////////////////////////////
// Copyright (C) AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import ObjectFactory from "../src/ObjectFactory";
import { Inject, Destroy } from "../src/decorators/ObjectDecorators";

class TestClassA {
    @Destroy
    public destroy(): void {
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
    }

    @Destroy
    public async destroy(): Promise<void> {
        this.dep = undefined;
    }
}

describe("ObjectFactory Tests", () => {
    const factory: ObjectFactory = new ObjectFactory();

    beforeEach(() => {
        factory.register(TestClassA);
        factory.register(TestClassB, TestClassB.name);
        factory.register(TestClassC);
    });

    afterEach(async () => {
        await factory.destroy();
    })

    it("Can create new class instances by name.", () => {
        const instance: TestClassA = factory.newInstance(TestClassA.name, "myInstance");
        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(TestClassA);
    });

    it("Can create new class instances by type.", () => {
        const instance: TestClassA = factory.newInstance(TestClassA, "myInstance");
        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(TestClassA);
    });

    it("Can initialize existing objects.", () => {
        const instance2: TestClassC = new TestClassC();
        factory.initialize(instance2);
        expect(instance2.dep).toBeDefined();
        expect(instance2.dep).toBeInstanceOf(TestClassA);
    });

    it("Can create new class instances with constructor arguments.", () => {
        const instance: TestClassB = factory.newInstance(TestClassB.name, "myInstance", "hello", 1);
        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(TestClassB);
        expect(instance.arg1).toBe("hello");
        expect(instance.arg2).toBe(1);
    });

    it("Can force creation of new class instances.", () => {
        const instance: TestClassB = factory.newInstance(TestClassB.name, "myInstance", "hello", 1);
        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(TestClassB);
        expect(instance.arg1).toBe("hello");
        expect(instance.arg2).toBe(1);

        const instance2: TestClassB = factory.newInstance(TestClassB.name, undefined, "world", 100);
        expect(instance2).toBeDefined();
        expect(instance2).toBeInstanceOf(TestClassB);
        expect(instance2.arg1).toBe("world");
        expect(instance2.arg2).toBe(100);
    });

    it("Can retrieve existing class instances by name.", () => {
        const instance: TestClassA = factory.newInstance(TestClassA.name, "myInstance");
        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(TestClassA);

        const instance2: TestClassA = factory.newInstance(TestClassA.name, "myInstance");
        expect(instance2).toBeDefined();
        expect(instance2).toBeInstanceOf(TestClassA);
        expect(instance).toBe(instance2);

        const instance3: TestClassA = factory.getInstance("TestClassA.myInstance");
        expect(instance3).toBeDefined();
        expect(instance3).toBeInstanceOf(TestClassA);
        expect(instance).toBe(instance3);
    });

    it("Can retrieve existing class instances by type.", () => {
        const instance: TestClassA = factory.newInstance(TestClassA, "default");
        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(TestClassA);

        const instance2: TestClassA = factory.getInstance(TestClassA);
        expect(instance2).toBeDefined();
        expect(instance2).toBeInstanceOf(TestClassA);
        expect(instance).toBe(instance2);

        const instance3: TestClassA = factory.getInstance("TestClassA.default");
        expect(instance3).toBeDefined();
        expect(instance3).toBeInstanceOf(TestClassA);
        expect(instance).toBe(instance3);
    });
});