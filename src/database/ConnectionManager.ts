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
            let connection: typeorm.Connection | Redis.Redis | undefined = undefined;
            try {
                connection = typeorm.getConnection(name);
            } catch (err) {
                // We don't care if a connection was not found
            }

            if (connection) {
                if (!connection.isConnected) {
                    await connection.connect();
                }
            } else {
                datastore.name = name;

                logger.info("Connecting to database " + name + "...");

                if (datastore.type === "redis") {
                    connection = await new Redis(datastore.url, datastore.options);
                } else {
                    if (!datastore.entities) {
                        throw new Error("Datastore must have entities defined.");
                    }

                    // Make an array of all entities associated with this connection
                    const entities: any[] = [];
                    for (const className in models) {
                        const clazz = models[className];
                        if (datastore.entities.includes(className)) {
                            const processedDatastore = processedModels.get(className);
                            if (processedDatastore) {
                                throw new Error(
                                    `Model ${className} already defined as an entity for ${processedDatastore}`
                                );
                            }
                            clazz.storeName = name;
                            entities.push(clazz);
                            processedModels.set(className, name);
                        }
                    }
                    if (datastore.entities.length != entities.length) {
                        const missingEntities: string[] = datastore.entities.filter(
                            (left: any) => !entities.map(entity => entity.name).includes(left)
                        );
                        throw new Error(
                            "Mismatched datastore entities. Following entities do not have Models defined : [" +
                            missingEntities +
                            "]"
                        );
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
