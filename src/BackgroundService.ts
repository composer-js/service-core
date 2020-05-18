///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2019 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
/**
 * The `BackgroundService` is an abstract base class for defining scheduled background services. A background service
 * executes in the background on a set schedule (like a cron job) and performs additional processing.
 *
 * @author Jean-Philippe Steinmetz <info@acceleratxr.com>
 */
export default abstract class BackgroundService {
    /** The global application configuration that the service can reference. */
    protected config: any;
    /** The logging utility to use. */
    protected logger: any;

    constructor(config: any, logger: any) {
        this.config = config;
        this.logger = logger;
    }

    /**
     * The processing function to execute at each scheduled interval.
     */
    public abstract run(): void;

    /**
     * Initializes the background service with any defaults.
     */
    public abstract async start(): Promise<void>;

    /**
     * Shuts down the background allowing the service to complete any outstanding tasks.
     */
    public abstract async stop(): Promise<void>;
}
