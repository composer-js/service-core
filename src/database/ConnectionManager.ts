////////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Logger } from "@composer-js/core";
import * as Redis from "ioredis";
import * as typeorm from "typeorm";

const logger = Logger();

/**
 * Provides database connection management.
 *
 * @author Jean-Philippe Steinmetz
 */
class ConnectionManager {
    public static connections: Map<string, typeorm.Connection | Redis.Redis> = new Map();

    /**
     * Attempts to initiate all database connections as defined in the config.
     *
     * @param datastore A map of configured datastores to be passed to the underlying engine.
     * @param models A map of model names and associated class definitions to establish database connections for.
     */
    public static async connect(datastores: any, models: any): Promise<void> {
        const processedModels: Map<string, string> = new Map();
        // Go through each datastore in the configuration and attempt to make a connection
        for (const name in datastores) {
            const datastore: any = datastores[name];

            // It's possible that the connection was already configured during a previous run. In that case we will
            // attempt to reconnect instead of creating a new connection.
            let connection: typeorm.Connection | Redis.Redis | undefined = this.connections.get(name);
            try {
                if (!connection) {
                    connection = typeorm.getConnection(name);
                }
            } catch (err) {
                // We don't care if a connection was not found
            }

            if (connection) {
                if (connection instanceof typeorm.Connection && !connection.isConnected) {
                    await connection.connect();
                }
            } else {
                datastore.name = name;

                logger.info("Connecting to database " + name + "...");

                if (datastore.type === "redis") {
                    connection = await new Redis(datastore.url, datastore.options);
                } else {
                    // Make an array of all entities associated with this connection
                    const entities: any[] = [];
                    for (const className in models) {
                        const clazz = models[className];
                        const ds: string = Reflect.getMetadata("axr:datastore", clazz);
                        // Search for the associated datastore with the model via either config or @Model decorator
                        if (ds === name || (datastore.entities && datastore.entities.includes(className))) {
                            const processedDatastore = processedModels.get(className);
                            if (processedDatastore) {
                                throw new Error(
                                    `Model ${className} already defined as an entity for ${processedDatastore}`
                                );
                            }
                            clazz.datastore = name;
                            entities.push(clazz);
                            processedModels.set(className, name);
                        }
                    }
                    datastore.entities = entities;

                    connection = await typeorm.createConnection(datastore);
                    if (datastore.runMigrations) {
                        await connection.runMigrations();
                    }
                }
            }

            this.connections.set(name, connection);
        }
    }

    /**
     * Attempts to disconnect all active database connections.
     */
    public static async disconnect(): Promise<void> {
        for (const conn of this.connections.values()) {
            if (conn) {
                if (conn instanceof typeorm.Connection && conn.isConnected) {
                    await conn.close();
                } else if (conn instanceof Redis && conn.status === "connected") {
                    conn.disconnect();
                }
            }
        }

        this.connections.clear();
    }
}

export default ConnectionManager;
