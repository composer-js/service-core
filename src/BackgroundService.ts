///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2019 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
/**
 * The `BackgroundService` is an abstract base class for defining scheduled background services. A background service
 * executes in the background once on startup or on a set schedule (like a cron job) and performs additional processing.
 *
 * @author Jean-Philippe Steinmetz <info@acceleratxr.com>
 */
export abstract class BackgroundService {
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
    public abstract run(): Promise<void> | void;

    /**
     * Initializes the background service with any defaults.
     */
    public abstract start(): Promise<void> | void;

    /**
     * Shuts down the background allowing the service to complete any outstanding tasks.
     */
    public abstract stop(): Promise<void> | void;
}
