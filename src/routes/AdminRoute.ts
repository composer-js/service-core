///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { JWTPayload, JWTUser, JWTUtils, UserUtils } from "@composer-js/core";
import Redis, { ScanStream } from "ioredis";
import * as Transport from "winston-transport";
import { Config, Logger } from "../decorators/ObjectDecorators"
import { Auth, ContentType, Get, Init, RedisConnection, Route, Socket, User, WebSocket } from "../decorators/RouteDecorators";
import ws from "ws";

/**
 * Implements a Winston transport that pipes incoming log messages to a configured redis pubsub channel.
 */
export class RedisTransport extends Transport {
    private channel: string;
    private redis: Redis;

    constructor(opts: any) {
        super(opts);
        this.channel = opts.channelName;
        this.redis = opts.redis;
    }

    public close(): void {
        this.redis.disconnect();
    }

    public log(info: any, next: Function): any {
        this.redis.publish(this.channel, JSON.stringify(info));
        next();
    }
}

/**
 * The `AdminRoute` provides a default `/admin` endpoint that gives trusted users the following abilities:
 * 
 * * Clear cache via `GET /admin/clear-cache`
 * * Live tail the service logs via `GET /admin/logs`
 * * Retrieve service dependencies via `GET /admin/dependencies`
 * * Retrieve service release notes via `GET /admin/release-notes`
 * * Restart the service via `GET /admin/restart`
 *
 * @author Jean-Philippe Steinmetz
 */
@Route("/admin")
export class AdminRoute {
    @RedisConnection("cache")
    protected cacheClient?: Redis;

    @Logger
    private logger: any;

    @Config("auth")
    private authConfig: any;

    @Config("datastores:logs", null)
    private logsConnConfig: any;

    /** The underlying ReleaseNotes specification. */
    private releaseNotes: string;

    @Config("service_name")
    private serviceName?: string;

    @Config("trusted_roles")
    private trustedRoles: string[] = [];

    /**
     * Constructs a new `ReleaseNotesRoute` object with the specified defaults.
     *
     * @param apiSpec The ReleaseNotes specification object to serve.
     */
    constructor(releaseNotes: string) {
        this.releaseNotes = releaseNotes;
    }

    @Init
    private async init(): Promise<void> {
        if (this.logsConnConfig) {
            const channelName: string = this.serviceName + "-logs";
            this.logger.add(new RedisTransport({
                channelName,
                redis: await new Redis(this.logsConnConfig.url, this.logsConnConfig.options)
            }));
        } else {
            this.logger.warn("Could not initialize `/admin/logs` route. The `logs` datastore is not not configured.");
        }
    }

    @Auth(["jwt"])
    @Get("/clear-cache")
    private async clearCache(@User user?: JWTUser): Promise<any> {
        if (!user || !UserUtils.hasRoles(user, this.trustedRoles)) {
            const error: any = new Error("User does not have permission to perform this action.");
            error.status = 403;
            throw error;
        }

        if (this.cacheClient) {
            const task: Promise<void> = new Promise((resolve, reject) => {
                const stream: ScanStream | undefined = this.cacheClient?.scanStream({ match: "db.cache.*" });
                if (stream) {
                    let keys: string[] = [];
                    stream.on("data", (k: string[]) => {
                        keys = keys.concat(k);
                    });
                    stream.on("end", () => {
                        this.cacheClient?.unlink(keys);
                    });
                }
            });
            await task;
        }
    }

    @WebSocket("/logs")
    private async logs(@Socket ws: ws, @User user?: JWTUser): Promise<void> {
        if (!this.logsConnConfig) {
            throw new Error("Logs connection config is not set.");
        }
        if (!this.serviceName) {
            throw new Error("serviceName is not set.");
        }
        if (!this.trustedRoles) {
            throw new Error("trustedRoles is not set.");
        }

        if (user && user.uid && UserUtils.hasRoles(user, this.trustedRoles)) {
            this.registerSocket(ws, user);
        } else {
            // If no user has auth'd yet then wait for a login message to arrive.
            ws.once("message", async (data: any, isBinary: boolean) => {
                if (!isBinary) {
                    try {
                        // Decode the incoming message
                        const message: any = JSON.parse(data);

                        // Ensure that this is a login request
                        if (message.type === "LOGIN") {
                            // Is the provided auth token valid?
                            const payload: JWTPayload = JWTUtils.decodeToken(this.authConfig, message.data);
                            const user: JWTUser | null = payload && payload.profile ? payload.profile as JWTUser : null;
                            if (user && user.uid && UserUtils.hasRoles(user, this.trustedRoles || [])) {
                                await this.registerSocket(ws, user);
                                ws.send(JSON.stringify({ type: "LOGIN_RESPONSE", data: "OK" }));
                            } else {
                                ws.close(1002, "User does not have permission to perform this action.");
                            }
                        } else {
                            ws.close(1002, "Invalid message or request.");    
                        }
                    } catch (err: any) {
                        ws.close(1002, "Invalid message or authentication token.");
                    }
                }
            });
        }
    }

    private async registerSocket(ws: ws, user: JWTUser): Promise<void> {
        // Create a new redis connection for this client
        const redis: Redis = await new Redis(this.logsConnConfig.url, this.logsConnConfig.options);

        const channelName: string = this.serviceName + "-logs";
        try {
            await redis.subscribe(channelName);
            this.logger.info(`User ${user.uid} successfully subscribed to logging channel.`);
            redis.on("message", (channel: string, message: string) => {
                // Forward the message to the client
                ws.send(message, (err) => {
                    if (err) {
                        this.logger.error(`Failed to forward message to client ${user.uid}.`);
                        this.logger.debug(err);
                    }
                });
            });
        } catch (err: any) {
            this.logger.error(`User ${user.uid} failed to subscribe to logging channel.`);
            this.logger.debug(err);
            ws.close();
        }
        ws.on("close", async (code: number, reason: string) => {
            // Unsubscribe from all redis pub/sub channels
            await redis.unsubscribe(channelName);
            // Disconnect the redis client
            redis.disconnect();
        });
    }

    @Auth("jwt")
    @Get("/release-notes")
    @ContentType("text/x-rst")
    private get(@User user?: JWTUser): any {
        if (!this.trustedRoles) {
            throw new Error("trustedRoles is not set.");
        }

        if (user && user.uid && UserUtils.hasRoles(user, this.trustedRoles)) {
            return this.releaseNotes;
        } else {
            const error: any = new Error("User does not have permission to perform this action.");
            error.status = 403;
            throw error;
        }
    }

    @Auth(["jwt"])
    @Get("/restart")
    private restart(@User user?: JWTUser): any {
        if (!user || !UserUtils.hasRoles(user, this.trustedRoles)) {
            const error: any = new Error("User does not have permission to perform this action.");
            error.status = 403;
            throw error;
        }

        // Send the kill signal. This will cause the system to clean up and then will be automatically restarted
        // by Docker/Kubernetes.
        this.logger.info("Restarting service...");
        process.kill(process.pid, "SIGINT");
    }
}
