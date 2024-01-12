///////////////////////////////////////////////////////////////////////////////
// Copyright (C) AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import "reflect-metadata";
import { Logger } from "@composer-js/core";
import { ConnectionManager } from "./database/ConnectionManager";
import { DataSource } from "typeorm";
import * as Redis from "ioredis";
const uuid = require("uuid");

interface Entity {
    datastore?: any;
}

/**
 * The `ObjectFactory` is a manager for creating objects based on registered
 * class types. This allows for the tracking of multiple instances of objects
 * so that references can be referenced by unique name.
 *
 * @author Jean-Philippe Steinmetz
 */
export class ObjectFactory {
    /** A map for string fully qualified class names to their class types. */
    public readonly classes: Map<string, any> = new Map();

    /** The global application configuration object. */
    private config: any;

    /** A map for the unique name to the intance of a particular class type. */
    public readonly instances: Map<string, any> = new Map();

    /** The application logging utility. */
    private logger: any;

    constructor(config?: any, logger?: any) {
        this.config = config;
        this.logger = logger ? logger : Logger();
        // Add ourself so it can be injected/retrieved
        this.instances.set(`${ObjectFactory.name}:default`, this);
    }

    /**
     * Destroys the specified objects. If `undefined` is passed in, all objects managed by the factory are destroyed.
     */
    public async destroy(objs?: any | any[]): Promise<void> {
        // If no set of objects was provided we want to destroy everything
        if (!objs) {
            objs = this.instances.values();
        }

        // If only a single object was passed in we need to convert this to an array
        if (!Array.isArray(objs)) {
            objs = [objs];
        }

        // Go through each object and call its destructor, if available
        for (const obj of objs) {
            const name: string = obj.name;

            let destroyFunc: Function | undefined = undefined;
            let proto = Object.getPrototypeOf(obj);
            while (proto) {
                for (const member of Object.getOwnPropertyNames(proto)) {
                    const hasDestructor: boolean = Reflect.getMetadata("cjs:destructor", proto, member);
                    if (hasDestructor) {
                        destroyFunc = obj[member];
                        break;
                    }
                }

                if (destroyFunc) {
                    break;
                }
                proto = Object.getPrototypeOf(proto);
            }

            if (destroyFunc) {
                try {
                    this.logger.debug("Destroying object: " + name);
                    const boundFunc: Function = destroyFunc.bind(obj);
                    const result: any = boundFunc();
                    if (result instanceof Promise) {
                        await result;
                    }
                } catch (err) {
                    this.logger.error("Failed to destroy object: " + name);
                    this.logger.debug(err);
                }
            }
        }
    }

    /**
     * Deletes all instantiated objects.
     */
    public clear(): void {
        this.instances.clear();
    }

    /**
     * Deletes all instantiated objects and registered class types.
     */
    public clearAll(): void {
        this.clear();
        this.classes.clear();
    }

    /**
     * Scans the given object for any properties with the @Inject decorator and assigns the correct values.
     * @param obj The object to initialize with injected defaults
     */
    public async initialize(obj: any): Promise<void> {
        let proto = Object.getPrototypeOf(obj);
        while (proto) {
            // Search for each type of injectable property
            for (const member of Object.getOwnPropertyNames(proto)) {
                // Inject @Config
                const injectConfig: any = Reflect.getMetadata("cjs:injectConfig", proto, member);
                if (injectConfig) {
                    const defaultValue: any = Reflect.getMetadata("cjs:injectConfigDefault", proto, member);
                    // If the value is a string, then it must be a path to a specific variable desired
                    if (typeof injectConfig === "string") {
                        const value: any = this.config.get(injectConfig);
                        if (value !== undefined) {
                            obj[member] = value;
                        } else if (defaultValue !== undefined) {
                            obj[member] = defaultValue;
                        } else {
                            throw new Error("No configuration variable is defined at path: " + injectConfig);
                        }
                    } else {
                        // No specific variable is desired, inject the whole config object
                        obj[member] = this.config;
                    }
                }

                // Inject @Logger
                const injectLogger: any = Reflect.getMetadata("cjs:injectLogger", proto, member);
                if (injectLogger) {
                    obj[member] = this.logger;
                }

                const connectionManager: ConnectionManager | undefined = this.getInstance(ConnectionManager);

                // Inject @Repository
                const injectRepo: any = Reflect.getMetadata("cjs:injectRepo", proto, member);
                if (injectRepo) {
                    // Look up the connection name from the model class
                    const datastore: string = (injectRepo as Entity).datastore;
                    if (datastore) {
                        const conn: DataSource | Redis.Redis | undefined = connectionManager?.connections.get(datastore);
                        if (conn instanceof DataSource) {
                            obj[member] = conn.getRepository(injectRepo);
                        } else {
                            throw new Error("Unable to find database connection with name: " + datastore);
                        }
                    } else {
                        throw new Error(
                            "The model " + injectRepo.name + " must defined as an entity in datastore config."
                        );
                    }
                }

                // Inject @MongoRepository
                const injectMongoRepo: any = Reflect.getMetadata("cjs:injectMongoRepo", proto, member);
                if (injectMongoRepo) {
                    // Look up the connection name from the model class
                    const datastore: string = (injectMongoRepo as Entity).datastore;
                    if (datastore) {
                        const conn: DataSource | Redis.Redis | undefined = connectionManager?.connections.get(datastore);
                        if (conn instanceof DataSource) {
                            obj[member] = conn.getMongoRepository(injectMongoRepo);
                        } else {
                            throw new Error("Unable to find database connection with name: " + datastore);
                        }
                    } else {
                        throw new Error(
                            "The model " + injectMongoRepo.name + " must defined as an entity in datastore config."
                        );
                    }
                }

                // Inject @RedisConnection
                const injectRedisConn: string = Reflect.getMetadata("cjs:injectRedisRepo", proto, member);
                if (injectRedisConn) {
                    const conn: any = connectionManager?.connections.get(
                        injectRedisConn
                    );
                    if (conn) {
                        // Always create a copy of the redis connection so that the user can subscribe/publish
                        // to redis pubsub channels without error. We must also check that it is possible to duplicate
                        // the connection.
                        obj[member] = conn.duplicate ? conn.duplicate() : conn;
                        // The `cache` datastore is a special case that we don't want to fail on if it's missing
                    } else if (injectRedisConn !== "cache") {
                        throw new Error("Unable to find database connection with name: " + injectRedisConn);
                    }
                }

                // Inject @Inject
                const injectObject: any = Reflect.getMetadata("cjs:injectObject", proto, member);
                if (injectObject) {
                    // First register the type just in case it hasn't been done yet
                    this.register(injectObject.type);
                    // Now retrieve the instance for the given name
                    const instance: any = await this.newInstance(injectObject.type, injectObject.name, ...injectObject.args);

                    obj[member] = instance;
                }
            }

            // Set the cache TTL if set on the model
            if (proto.modelClass && proto.modelClass.cacheTTL) {
                obj.cacheTTL = proto.modelClass.cacheTTL;
            }

            // Set the trackChanges if set on the model
            if (proto.modelClass && proto.modelClass.trackChanges) {
                obj.trackChanges = proto.modelClass.trackChanges;
            }

            proto = Object.getPrototypeOf(proto);
        }

        // Call any @Init functions
        const initFuncs: Function[] = this.getInitMethods(obj);
        for (const func of initFuncs) {
            const result: any = func.bind(obj)();
            if (result instanceof Promise) {
                await result;
            }
        }
    }

    /**
     * Searches an object for one or more functions that implement a `@Init` decorator.
     *
     * @param obj The object to search.
     * @returns The list of functions that implements the `@Init` decorator if found, otherwise undefined.
     */
    public getInitMethods(obj: any): Function[] {
        const results: Function[] = [];

        for (const member in obj) {
            const initialize: boolean = Reflect.getMetadata("cjs:initialize", obj, member);
            if (initialize) {
                results.push(obj[member]);
                break;
            }
        }

        let proto = Object.getPrototypeOf(obj);
        while (proto) {
            for (const member of Object.getOwnPropertyNames(proto)) {
                const initialize: boolean = Reflect.getMetadata("cjs:initialize", proto, member);
                if (initialize) {
                    results.push(obj[member]);
                    break;
                }
            }
            proto = Object.getPrototypeOf(proto);
        }

        return results;
    }

    /**
     * Returns the object instance with the given unique name. Unique names take the form `<ClassName>:<InstanceName>`.
     * It is possible to only specifiy the `<ClassName>`, doing so will automatically look for the `<ClassName>:default`
     * instance. It is also possible to pass the class type directly, in which case the instance will be searched by
     * `<ClassName>:default`.
     * @param nameOrType The unique name or class type of the object to retrieve.
     * @returns The object instance associated with the given name if found, otherwise `undefined`.
     */
    public getInstance<T>(nameOrType: any): T | undefined {
        if (typeof nameOrType === "string") {
            // Add `:default` to the name if no explicit name was provided
            if (!nameOrType.includes(":")) {
                nameOrType += ":default";
            }
        } else {
            nameOrType = nameOrType && nameOrType.name ? `${nameOrType.name}:default` : (nameOrType.constructor ? `${nameOrType.constructor.name}:default` : undefined);
        }

        // Make sure we have a valid type name
        if (!nameOrType) {
            throw new Error("No valid nameOrType was specified.");
        }

        const obj: T = this.instances.get(nameOrType);
        return obj;
    }

    /**
     * Creates a new instance of the class specified with the provided unique name or type and constructor arguments. If an existing
     * object has already been created with the given name, that instance is returned, otherwise a new instance is created
     * using the provided arguments.
     *
     * @param type The fully qualified name or type of the class to instantiate. If a type is given it's class name will be inferred
     *              via the constructor name.
     * @param name The unique name to give the class instance. Set to `undefined` if you wish to force a new object
     *              is created.
     * @param args The set of constructor arguments to use during construction
     */
    public async newInstance<T>(type: any, name?: string, ...args: any): Promise<T> {
        // If an class type was given extract it's fqn
        const className = typeof type === "string"
            ? type
            : (type.fqn || type.name || type.constructor.name);

        // Generate a name if none was given
        if (!name) {
            name = uuid.v4();
        }

        // Names are namespace specific by type. Prepend the type to the name if not already done.
        if (name && !name.includes(className)) {
            name = `${className}:${name}`;
        }

        // First check to see if an instance was already created for the given name
        if (name && this.instances.has(name)) {
            return this.instances.get(name);
        }

        // Make sure we have a valid type name
        if (!className) {
            throw new Error("No valid type was specified.");
        }

        // Make sure the class has been registered if a type was provided
        if (typeof type !== "string") {
            this.register(type);
        }

        // Look up the class type in our list
        const clazz: any = this.classes.get(className);
        if (!clazz || !clazz.constructor) {
            throw new Error("No class found with name: " + className);
        }

        // Create the new instance using the provided params
        this.logger.debug(`Creating new instance of class [${className}] with name [${name}]`);
        const instance: T = new clazz(...args);

        // Save the name to the object
        Object.defineProperty(instance as any, "_name", {
            enumerable: false,
            writable: false,
            value: name,
        })

        // Also store the fqn for reference
        Object.defineProperty(instance as any, "_fqn", {
            enumerable: false,
            writable: false,
            value: className,
        })

        // Store the instance in our list of objects
        if (name) {
            this.instances.set(name, instance);
        }

        // Now initialize the object with any injectable defaults. This must happen after we add the instance
        // to our internal map so that circular dependencies due not cause endless cycles of creation/initialization.
        await this.initialize(instance);

        return instance;
    }

    /**
     * Registers the given class type for the provided fully qualified name.
     * @param clazz The class type to register.
     * @param fqn The fully qualified name of the class to register. If not specified, the class name will be used.
     */
    public register(clazz: any, fqn?: string): void {
        const name: string = fqn ? fqn : (clazz.fqn || clazz.name);
        if (!this.classes.has(name)) {
            this.logger.info(`Registering class ${name}`);
            this.classes.set(name, clazz);
        }
    }
}