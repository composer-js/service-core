///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import * as fs from "fs";
import * as path from "path";

/**
 * The ClassLoader provides a container for loading and managing TypeScript and JavaScript classes from disk. Loaded
 * classes are referenced by name and package. The package is derived from the folder the class was loaded from
 * relative to the root. It is expected that each file defines their class as the only export and the name of the file
 * is the same as the class itself.
 *
 * For example, given the class fully qualified class name `com.company.MyClass` would load a TypeScript or JavaScript
 * file from disk. In the case of a TypeScript class, the file `com/company/MyClass.ts` is loaded whose contents
 * would look like the following.
 *
 * ```javascript
 * class MyClass {
 *     // ...
 * }
 *
 * export default MyClass;
 * ```
 *
 * In the case of a JavaScript class, the file `com/company/MyClass.js` is loaded whose contents would look like the
 * following.
 *
 * ```javascript
 * `use strict`;
 *
 * class MyClass {
 *     // ...
 * }
 *
 * modules.exports = MyClass;
 * ```
 *
 * @author Jean-Philippe Steinmetz
 */
class ClassLoader {
    /** The map containnig all loaded classes. */
    protected classes: Map<string, any> = new Map<string, any>();
    /** Indicates if TypeScript classes should be loaded. */
    protected includeTypeScript: boolean = true;
    /** Indicates if JavaScript classes should be loaded. */
    protected includeJavaScript: boolean = true;
    /** The path to the root directory containing all classes on disk. */
    protected rootDir: string = ".";

    /**
     * Creates a new instance of `ClassLoader` with the specified defaults.
     *
     * @param rootDir The root directory to load all classes from.
     * @param includeJavaScript Set to `true` to load all TypeScript classes from the given `rootDir`, otherwise set
     *                          to `false.
     * @param includeTypeScript Set to `true` to load all JavaScript classes from the given `rootDir`, otherwise set
     *                          to `false.
     */
    constructor(rootDir: string, includeJavaScript: boolean = true, includeTypeScript: boolean = true) {
        this.rootDir = path.resolve(rootDir);
        this.includeJavaScript = includeJavaScript;
        this.includeTypeScript = includeTypeScript;
    }

    /**
     * Returns the class with the specified fully qualified name.
     *
     * @param fqn The fully qualified name of the class to return.
     * @returns The class definition for the given fully qualified name if found, otherwise `undefined`.
     */
    public GetClass(fqn: string): any | undefined {
        return this.classes.get(fqn);
    }

    /**
     * Returns the map containing all classes that have been loaded.
     */
    public GetClasses(): Map<string, any> {
        return this.classes;
    }

    /**
     * Returns `true` if a class exists with the specified fully qualified name.
     *
     * @param fqn The fully qualified name of the class to search.
     * @returns `true` if a class definition exists for the given fully qualified name, otherwise `false`.
     */
    public HasClass(fqn: string): any | undefined {
        return this.classes.get(fqn) ? true : false;
    }

    /**
     * Loads all TypeScript classes contained in the directory specified. The folder must be a child
     * directory to the `rootDir` parameter passed in to the constructor.
     *
     * @param dir The directory, relative to `rootDir`, containing TypeScript classes to load.
     */
    public async Load(dir: string = ""): Promise<void> {
        let fqp: string = path.resolve(path.join(this.rootDir, dir));
        let files: any[] = fs.readdirSync(fqp, { withFileTypes: true });
        for (let file of files) {
            let extension = path.extname(file.name);
            if (!extension) {
                extension = file.name;
            }

            let relpath: string = path.relative(this.rootDir, fqp);
            let fullpath: string = path.resolve(path.join(this.rootDir, relpath, file.name.split(".")[0]));
            let pkg: string = relpath.replace(new RegExp("\\" + path.sep, "g"), ".");
            let fqn: string = (pkg.length > 0 ? pkg + "." : "") + file.name.split(".")[0];

            if (file.isDirectory()) {
                let subdir: string = path.join(dir, file.name);
                await this.Load(subdir);
            } else if (this.includeJavaScript && extension === ".js") {
                let clazz = require(fullpath);
                if (clazz) {
                    this.classes.set(fqn, clazz.default);
                } else {
                    throw new Error("Failed to load class file: " + fullpath);
                }
            } else if (this.includeTypeScript && extension === ".ts") {
                let clazz = require(fullpath);
                if (clazz) {
                    this.classes.set(fqn, clazz.default);
                } else {
                    throw new Error("Failed to load class file: " + fullpath);
                }
            }
        }
    }
}

export default ClassLoader;
