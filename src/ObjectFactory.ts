///////////////////////////////////////////////////////////////////////////////
// Copyright (C) AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import "reflect-metadata";
import { Logger } from "@composer-js/core";
import ConnectionManager from "./database/ConnectionManager";
import { Connection } from "typeorm";
import * as Redis from "ioredis";
const uuid = require("uuid");

interface Entity {
    storeName?: any;
}

/**
 * The `ObjectFactory` is a manager for creating objects based on registered
 * class types. This allows for the tracking of multiple instances of objects
 * so that references can be referenced by unique name.
 * 
 * @author Jean-Philippe Steinmetz
 */
export default class ObjectFactory {
    /** A map for string fully qualified class names to their class types. */
    private classes: Map<string, any> = new Map();

    /** The global application configuration object. */
    private config: any;

    /** A map for the unique name to the intance of a particular class type. */
    public readonly instances: Map<string, any> = new Map();

    /** The application logging utility. */
    private logger: any;

    constructor(config?: any, logger?: any) {
        this.config = config;
        this.logger = logger ? logger : Logger();
    }

    /**
     * Destroys the factory including all instantiated objects it is managing.
     */
    public async destroy(): Promise<void> {
        // Go through each managed instance and call its destructor, if available
        this.instances.forEach(async (obj: any) => {
            let destroyFunc: Function | undefined = undefined;
            let proto = Object.getPrototypeOf(obj);
            while (proto) {
                for (const member of Object.getOwnPropertyNames(proto)) {
                    const hasDestructor: boolean = Reflect.getMetadata("axr:destructor", proto, member);
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
        });

        this.clearAll();
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
    public initialize(obj: any): void {
        let proto = Object.getPrototypeOf(obj);
        while (proto) {
            // Search for each type of injectable property
            for (const member of Object.getOwnPropertyNames(proto)) {
                // Inject @Config
                const injectConfig: any = Reflect.getMetadata("axr:injectConfig", proto, member);
                if (injectConfig) {
                    obj[member] = this.config;
                }

                // Inject @Logger
                const injectLogger: any = Reflect.getMetadata("axr:injectLogger", proto, member);
                if (injectLogger) {
                    obj[member] = this.logger;
                }

                // Inject @Repository
                const injectRepo: any = Reflect.getMetadata("axr:injectRepo", proto, member);
                if (injectRepo) {
                    // Look up the connection name from the model class
                    const storeName: string = (injectRepo as Entity).storeName;
                    if (storeName) {
                        const conn: Connection | Redis.Redis | undefined = ConnectionManager.connections.get(storeName);
                        if (conn instanceof Connection) {
                            obj[member] = conn.getRepository(injectRepo);
                        } else {
                            throw new Error("Unable to find database connection with name: " + storeName);
                        }
                    } else {
                        throw new Error(
                            "The model " + injectRepo.name + " must defined as an entity in datastore config."
                        );
                    }
                }

                // Inject @MongoRepository
                const injectMongoRepo: any = Reflect.getMetadata("axr:injectMongoRepo", proto, member);
                if (injectMongoRepo) {
                    // Look up the connection name from the model class
                    const storeName: string = (injectMongoRepo as Entity).storeName;
                    if (storeName) {
                        const conn: Connection | Redis.Redis | undefined = ConnectionManager.connections.get(storeName);
                        if (conn instanceof Connection) {
                            obj[member] = conn.getMongoRepository(injectMongoRepo);
                        } else {
                            throw new Error("Unable to find database connection with name: " + storeName);
                        }
                    } else {
                        throw new Error(
                            "The model " + injectMongoRepo.name + " must defined as an entity in datastore config."
                        );
                    }
                }

                // Inject @RedisConnection
                const injectRedisConn: string = Reflect.getMetadata("axr:injectRedisRepo", proto, member);
                if (injectRedisConn) {
                    const conn: Connection | Redis.Redis | undefined = ConnectionManager.connections.get(
                        injectRedisConn
                    );
                    if (conn) {
                        obj[member] = conn;
                        // The `cache` datastore is a special case that we don't want to fail on if it's missing
                    } else if (injectRedisConn !== "cache") {
                        throw new Error("Unable to find database connection with name: " + injectRedisConn);
                    }
                }

                // Inject @Inject
                const injectObject: any = Reflect.getMetadata("axr:injectObject", proto, member);
                if (injectObject) {
                    // First register the type just in case it hasn't been done yet
                    this.register(injectObject.type);
                    // Now retrieve the instance for the given name
                    const instance: any = this.newInstance(injectObject.type, injectObject.name, ...injectObject.args);

                    obj[member] = instance;
                }
            }

            proto = Object.getPrototypeOf(proto);
        }
    }

    /**
     * Returns the object instance with the given unique name.
     * @param nameOrType The unique name or class type of the object to retrieve.
     * @returns The object instance associated with the given name if found, otherwise `undefined`.
     */
    public getInstance<T>(nameOrType: any): T {
        if (typeof nameOrType !== "string") {
            nameOrType = nameOrType && nameOrType.name ? `${nameOrType.name}.default` : (nameOrType.constructor ? `${nameOrType.constructor.name}.default` : undefined);
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
    public newInstance<T>(type: any, name?: string, ...args: any): T {
        // If an class type was given extract it's fqn
        const className = typeof type === "string"
            ? type
            : (type.name
                ? type.name : (type.constructor ? type.constructor.name : undefined));

        // Generate a name if none was given
        if (!name) {
            name = uuid.v4();
        }

        // Names are namespace specific by type. Prepend the type to the name if not already done.
        if (name && !name.includes(className)) {
            name = `${className}.${name}`;
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

        // Now initialize the object with any injectable defaults
        this.initialize(instance);

        // Store the instance in our list of objects
        if (name) {
            this.instances.set(name, instance);
        }

        return instance;
    }

    /**
     * Registers the given class type for the provided fully qualified name.
     * @param clazz The class type to register.
     * @param fqn The fully qualified name of the class to register. If not specified, the class name will be used.
     */
    public register(clazz: any, fqn?: string): void {
        const name: string = fqn ? fqn : clazz.name;
        if (!this.classes.has(name)) {
            this.logger.info(`Registering class ${name}`);
            this.classes.set(name, clazz);
        }
    }
}