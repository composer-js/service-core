///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import ClassLoader from "./ClassLoader";
import "reflect-metadata";

/**
 * The `RouteScanner` is a utility class for loading all class files from a specified file path on the system that has
 * the `@Route` decorator. The resulting scan returns the list of all matching classes that can be instantiated and
 * registered to an Express application.
 *
 * @author Jean-Philippe Steinmetz
 */
class RoutesScanner {
    /** The class loader used to search and load route classes. */
    protected classLoader: ClassLoader;
    /** The OpenAPI specification to reference. */
    protected apiSpec: any = null;

    /**
     * Instantiates a new RoutesScanner with the given defaults.
     * @param path The file path to use when searching for route classes.
     */
    constructor(path: string) {
        this.classLoader = new ClassLoader(path);
    }

    /**
     * Determines if the provided class implements the `@Route` decorator.
     *
     * @param clazz The class to check.
     * @returns `true` if the class implements the `@Route` decorator, otherwise `false`.
     */
    private implementsRoute(clazz: any): boolean {
        const routePaths: string[] = Reflect.getMetadata("axr:routePaths", clazz.prototype);
        return routePaths != undefined;
    }

    /**
     * Scans the file system for all classes that implement the `@Route` decorator and returns the list of all found
     * route class definitions.
     */
    public async scan(): Promise<Array<any>> {
        let routes: Array<any> = new Array();

        // First scan the file system for all classes
        await this.classLoader.Load();

        // Go through each class and determine which ones implements the `@Route` decorator.
        for (let clazz of this.classLoader.GetClasses().values()) {
            if (this.implementsRoute(clazz)) {
                routes.push(clazz);
            }
        }

        return routes;
    }
}

export default RoutesScanner;
