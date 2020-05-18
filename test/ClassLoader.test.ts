///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import * as fs from "fs";
import * as path from "path";
import ClassLoader from "../src/ClassLoader";
import * as rimraf from "rimraf";
import * as util from "util";

const mkdirp = util.promisify(require("mkdirp"));

describe("ClassLoader Tests", () => {
    beforeAll(async () => {
        const jsMyClass: string = `
\`use strict\`;

class MyClass {
    contructor() {
    }
}

module.exports.default = MyClass;
        `;

        const tsMyClass: string = `
class MyClass {
    contructor() {
    }
}

export default MyClass;
        `;

        await mkdirp("./test-classes/com/company/javascript");
        await mkdirp("./test-classes/com/company/typescript");
        fs.writeFileSync("./test-classes/dummy.txt", "This is a test");
        fs.writeFileSync("./test-classes/MyJavaScriptClass.js", jsMyClass);
        fs.writeFileSync("./test-classes/com/company/javascript/MyClass.js", jsMyClass);
        fs.writeFileSync("./test-classes/com/company/dummy.txt", "This is a test");
        fs.writeFileSync("./test-classes/MyTypeScriptClass.ts", tsMyClass);
        fs.writeFileSync("./test-classes/com/company/typescript/MyClass.ts", tsMyClass);
        fs.writeFileSync("./test-classes/com/company/typescript/dummy.txt", "This is a test");
    });

    afterAll(() => {
        rimraf.sync("./test-classes");
    });

    it("Can load classes.", async () => {
        let loader: ClassLoader = new ClassLoader("./test-classes");
        expect(loader).toBeDefined();
        await loader.Load();
        let classes: Map<string, any> = loader.GetClasses();
        expect(classes).toBeDefined();
        expect(classes.size).toBe(4);
        expect(loader.GetClass("MyJavaScriptClass")).toBeDefined();
        expect(loader.GetClass("com.company.javascript.MyClass")).toBeDefined();
        expect(loader.GetClass("MyTypeScriptClass")).toBeDefined();
        expect(loader.GetClass("com.company.typescript.MyClass")).toBeDefined();
    });

    it("Can load JavaScript classes only.", async () => {
        let loader: ClassLoader = new ClassLoader("./test-classes", true, false);
        expect(loader).toBeDefined();
        await loader.Load();
        let classes: Map<string, any> = loader.GetClasses();
        expect(classes).toBeDefined();
        expect(classes.size).toBe(2);
        expect(loader.GetClass("MyJavaScriptClass")).toBeDefined();
        expect(loader.GetClass("com.company.javascript.MyClass")).toBeDefined();
    });

    it("Can load TypeScript classes only.", async () => {
        let loader: ClassLoader = new ClassLoader("./test-classes", false, true);
        expect(loader).toBeDefined();
        await loader.Load();
        let classes: Map<string, any> = loader.GetClasses();
        expect(classes).toBeDefined();
        expect(classes.size).toBe(2);
        expect(loader.GetClass("MyTypeScriptClass")).toBeDefined();
        expect(loader.GetClass("com.company.typescript.MyClass")).toBeDefined();
    });

    it("Can load from sub-directory only.", async () => {
        let loader: ClassLoader = new ClassLoader("./test-classes");
        expect(loader).toBeDefined();
        await loader.Load("com");
        let classes: Map<string, any> = loader.GetClasses();
        expect(classes).toBeDefined();
        expect(classes.size).toBe(2);
        expect(loader.GetClass("com.company.javascript.MyClass")).toBeDefined();
        expect(loader.GetClass("com.company.typescript.MyClass")).toBeDefined();
    });
});
