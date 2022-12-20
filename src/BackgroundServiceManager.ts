///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2019 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { BackgroundService } from "./BackgroundService";
import * as schedule from "node-schedule";
import { ObjectFactory } from "./ObjectFactory";

/**
 * The `BackgroundServiceManager` manages all configured background services in the application. It is responsible for
 * initializing the jobs, scheduling them and performing any related shutdown tasks. See the `BackgroundService`
 * class for details on how to create a background service class to be used by this manager.
 *
 * ## Usage
 * To use the manager instantiate a new object and provide the required constructor arguments. Then simply call the
 * `startAll` function. When shutting your application down you should call the `stopAll` function.
 *
 * ```
 * import { BackgroundServiceManager } from "@acceleratxr/services_manager";
 *
 * const manager: BackgroundServiceManager = new BackgroundServiceManager(objectFactory, scriptManager, config, logger);
 * await manager.startAll();
 * ...
 * await manager.stopAll();
 * ```
 *
 * You may optionally start and stop individual services using the `start` and `stop` functions respectively.
 *
 * ```
 * await manager.start("MyService");
 * ...
 * await manger.stop("MyService");
 * ```
 * @author Jean-Philippe Steinmetz <info@acceleratxr.com>
 */
export class BackgroundServiceManager {
    private readonly config: any;
    private classes: Map<string, any> = new Map();
    private jobs: any = {};
    private readonly logger: any;
    private objectFactory: ObjectFactory;
    private services: any = {};

    constructor(objectFactory: ObjectFactory, classes: Map<string, any>, config: any, logger: any) {
        this.classes = classes;
        this.config = config;
        this.logger = logger;
        this.objectFactory = objectFactory;
    }

    /**
     * Returns the service instance with the given name.
     *
     * @param name The name of the background service to retrieve.
     */
    public getService(name: string): BackgroundService | undefined {
        return this.services[name];
    }

    /**
     * Starts all configured background services.
     */
    public async startAll(): Promise<void> {
        if (this.classes) {
            for (const clazz of this.classes.values()) {
                await this.start(clazz.name, clazz);
            }
        }
    }

    /**
     * Starts the background service with the given name.
     *
     * @param serviceName The name of the background service to start.
     * @param clazz The class type of the service to start. If not specified the name is used to lookup the
     *                      class type.
     * @param args The list of arguments to pass into the service constructor
     */
    public async start(serviceName: string, clazz?: any, ...args: any): Promise<void> {
        // Check that the job hasn't already been started
        if (this.jobs[serviceName]) {
            return;
        }

        // Look for the class definition with the given name if not already given
        if (!clazz) {
            this.classes.forEach((clazzDef: any, name: string) => {
                if (name.match(new RegExp(`.*${serviceName}.*`))) {
                    clazz = clazzDef;
                }
            });
        }

        if (clazz) {
            try {
                this.logger.info("Starting service " + serviceName + "...");

                // Instantiate the service class
                const service: BackgroundService = await this.objectFactory.newInstance(clazz, serviceName, this.config, this.logger, ...args) as BackgroundService;
                this.services[serviceName] = service;

                // Initialize the service
                await service.start();

                // Schedule the service for background execution
                if (service.schedule) {
                    this.jobs[serviceName] = schedule.scheduleJob(service.schedule, service.run.bind(service));
                } else {
                    // One time execution services are run once and then immediately cleaned up
                    await service.run();
                    await service.stop();
                    await this.objectFactory.destroy(service);
                }
            } catch (err) {
                this.logger.error(`Failed to start service: ${serviceName}`);
                this.logger.debug(err);
            }
        }
    }

    /**
     * Stops all currently active background services that are owned by the manager.
     */
    public async stopAll(): Promise<void> {
        for (const jobName in this.jobs) {
            await this.stop(jobName);
        }

        // Clear the local state
        this.jobs = {};
        this.services = {};
    }

    /**
     * Stops the background service with the given name.
     *
     * @param serviceName The name of the background service to stop.
     */
    public async stop(serviceName: string): Promise<void> {
        this.logger.info("Stopping background service " + serviceName + "...");

        // Cancel the background execution schedule
        if (this.jobs[serviceName]) {
            this.jobs[serviceName].cancel(false);
        }

        // Shut it down
        if (this.services[serviceName]) {
            await this.services[serviceName].stop();
        }
    }
}
