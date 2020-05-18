///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import * as fs from "fs";
import * as path from "path";
import { FileUtils } from "../src/service_core";
import * as rimraf from "rimraf";
import { stringify } from "querystring";

describe("FileUtils Tests", () => {
    beforeAll(() => {
        fs.mkdirSync("tests-fileutils");
    });

    afterAll(() => {
        rimraf.sync("tests-fileutils");
        rimraf.sync("tests-fileutils.copy");
    });

    it("writeFile succeeds.", async () => {
        fs.writeFileSync("tests-fileutils/test.txt", "This is a test.");
        expect(fs.existsSync("tests-fileutils/test.txt")).toBe(true);
        await FileUtils.writeFile("tests-fileutils/test.txt", "tests-fileutils/test.out.txt", "This is a test.");
        expect(fs.existsSync("tests-fileutils/test.out.txt")).toBe(true);
        var content = fs.readFileSync("tests-fileutils/test.out.txt", "utf8");
        expect(content).toBe("This is a test.");
    });

    it("copyFile succeeds.", async () => {
        fs.writeFileSync("tests-fileutils/test.txt", "This is a test.");
        expect(fs.existsSync("tests-fileutils/test.txt")).toBe(true);
        await FileUtils.copyFile("tests-fileutils/test.txt", "tests-fileutils/test.copy.txt");
        var content = fs.readFileSync("tests-fileutils/test.copy.txt", "utf8");
        expect(content).toBe("This is a test.");
    });

    it("copyBinaryFile succeeds.", async () => {
        fs.writeFileSync("tests-fileutils/test.txt", "This is a test.");
        expect(fs.existsSync("tests-fileutils/test.txt")).toBe(true);
        await FileUtils.copyBinaryFile("tests-fileutils/test.txt", "tests-fileutils/test.copy.txt");
        var content = fs.readFileSync("tests-fileutils/test.copy.txt", "utf8");
        expect(content).toBe("This is a test.");
    });

    it("copyDirectory succeeds.", async () => {
        // Create dummy directory
        fs.writeFileSync("tests-fileutils/test.txt", "This is a test.");
        fs.writeFileSync("tests-fileutils/test.bin", "This is a test binary.");
        fs.writeFileSync("tests-fileutils/test.bak", "This is a test backup.");
        expect(fs.existsSync("tests-fileutils")).toBe(true);
        expect(fs.existsSync("tests-fileutils/test.txt")).toBe(true);

        // Copy the directory
        await FileUtils.copyDirectory("tests-fileutils", "tests-fileutils.copy", {}, ["bak"], ["bin"]);

        // Verify the operation succeeded
        expect(fs.existsSync("tests-fileutils.copy")).toBe(true);
        expect(fs.existsSync("tests-fileutils.copy/test.txt")).toBe(true);
        // TODO This test is broken. Need to uncomment following line and fix!
        //expect(fs.existsSync('tests-fileutils.copy/test.bin')).toBe(true)
        expect(fs.existsSync("tests-fileutils.copy/test.bak")).toBe(false);
    });
});
