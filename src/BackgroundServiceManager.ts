///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2019 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import BackgroundService from "./BackgroundService";
import * as schedule from "node-schedule";
import ClassLoader from "./ClassLoader";
import * as path from "path";

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
 * const manager: BackgroundServiceManager = new BackgroundServiceManager(".", config, logger);
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
 *
 * ## Configuration
 * Background services are defined in the global configuration file under the key `jobs`. The `jobs` object is a
 * standard map where the key is the service name (class/module name). Each configured service must have the
 * `schedule` property defined. If not, the `jobs.defaultSchedule` is applied for that service.
 *
 * Example:
 * ```
 * {
 *     jobs: {
 *         defaultSchedule: "* * * * * *",
 *         MyService: {
 *             schedule: "* * * * * *"
 *         },
 *     }
 * }
 * ```
 *
 * @author Jean-Philippe Steinmetz <info@acceleratxr.com>
 */
export default class BackgroundServiceManager {
    private classLoader: ClassLoader;
    private readonly config: any;
    private jobs: any = {};
    private loaded: boolean = false;
    private readonly logger: any;
    private services: any = {};

    constructor(basePath: string, config: any, logger: any) {
        this.config = config;
        this.logger = logger;
        this.classLoader = new ClassLoader(path.join(basePath, "jobs"));
    }

    /**
     * Returns the service instance with the given name.
     *
     * @param name The name of the background service to retrieve.
     */
    public getService(name: string): BackgroundService {
        return this.services[name];
    }

    /**
     * Starts all configured background services.
     */
    public async startAll(): Promise<void> {
        const jobConfig: any = this.config.get("jobs");

        // Load all background service classes
        if (!this.loaded) {
            await this.classLoader.Load();
            this.loaded = true;
        }

        // Go through all configured jobs. Each entry will correspond to a loaded class.
        for (const jobName in jobConfig) {
            // Ignore protected config variables
            if (jobName === "defaultSchedule") {
                continue;
            }

            // Start the background service
            await this.start(jobName);
        }
    }

    /**
     * Starts the background service with the given name.
     *
     * @param serviceName The name of the background service to start.
     */
    public async start(serviceName: string): Promise<void> {
        const jobConfig: any = this.config.get("jobs:" + serviceName);
        if (!jobConfig) {
            throw new Error("No configuration for background service " + serviceName);
        }

        // Load all background service classes
        if (!this.loaded) {
            await this.classLoader.Load();
            this.loaded = true;
        }

        if (this.classLoader.HasClass(serviceName)) {
            this.logger.info("Starting service " + serviceName + "...");

            // Instantiate the service class
            const clazz: any = this.classLoader.GetClass(serviceName);
            const service: BackgroundService = new clazz(this.config, this.logger) as BackgroundService;
            this.services[serviceName] = service;

            // Initialize the service
            await service.start();

            // Schedule the service for background execution
            const interval: string = jobConfig.schedule ? jobConfig.schedule : this.config.get("jobs:defaultSchedule");
            this.jobs[serviceName] = schedule.scheduleJob(interval, service.run.bind(service));
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
