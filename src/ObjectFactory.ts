///////////////////////////////////////////////////////////////////////////////
// Copyright (C) AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import "reflect-metadata";

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

    /** A map for the unique name to the intance of a particular class type. */
    private instances: Map<string, any> = new Map();

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
     * @param name The unique name of the object to retrieve.
     * @returns The object instance associated with the given name if found, otherwise `undefined`.
     */
    public getInstance<T>(name: string): T {
        const obj: T = this.instances.get(name);
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
        // First check to see if an instance was already created for the given name
        if (name && this.instances.has(name)) {
            return this.instances.get(name);
        }

        // If an class type was given extract it's fqn
        if (typeof type !== "string") {
            type = type.name ? type.name : (type.constructor ? type.constructor.name : undefined);
        }

        // Make sure we have a valid type name
        if (!type) {
            throw new Error("No valid type was specified.");
        }

        // Make sure the class has been registered before
        if (!this.classes.has(type)) {
            throw new Error(`Unknown class type: ${type}. Did you register it?`);
        }

        // Look up the class type in our list
        const clazz: any = this.classes.get(type);
        if (!clazz || !clazz.constructor) {
            throw new Error("No class found with name: " + type);
        }

        // Create the new instance using the provided params
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
            this.classes.set(name, clazz);
        }
    }
}