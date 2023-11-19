///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { JWTPayload, JWTUser, JWTUtils, UserUtils } from "@composer-js/core";
import Redis, { ScanStream } from "ioredis";
import * as Transport from "winston-transport";
import { Config, Logger } from "../decorators/ObjectDecorators"
import { Auth, ContentType, Get, Init, Route, Socket, User, WebSocket } from "../decorators/RouteDecorators";
import { RedisConnection } from "../decorators/DatabaseDecorators";
import ws, { createWebSocketStream } from "ws";

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
    /** A map of user uid's to active sockets. */
    private activeSockets: Map<string,any[]> = new Map();

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

    @Auth(["jwt"])
    @WebSocket("/inspect")
    private async inspect(@Socket socket: ws, @User user: JWTUser): Promise<void> {
        if (!UserUtils.hasRoles(user, this.trustedRoles)) {
            socket.close(1002, "User does not have permission to perform this action.");
            return;
        }

        // Create a websocket connection to the debug inspector and forward all traffic between the two
        const sDuplex = createWebSocketStream(socket);
        const iws: ws = new ws("ws://localhost:9229");
        const iDuplex = createWebSocketStream(iws);
        sDuplex.pipe(iDuplex);
        iDuplex.pipe(sDuplex);

        // Add the sockets to our tracked list
        const socks: any[] = this.activeSockets.get(user.uid) || [];
        socks.push(sDuplex);
        socks.push(iDuplex);
        this.activeSockets.set(user.uid, socks);

        socket.on("close", async (code: number, reason: string) => {
            iws.close();

            // Remove the sockets from our tracked list
            const socks: any[] = this.activeSockets.get(user.uid) || [];
            socks.splice(socks.indexOf(sDuplex));
            socks.splice(socks.indexOf(iDuplex));
            this.activeSockets.set(user.uid, socks);
        });
    }

    @Auth(["jwt"])
    @WebSocket("/logs")
    private async logs(@Socket socket: ws, @User user: JWTUser): Promise<void> {
        if (!UserUtils.hasRoles(user, this.trustedRoles)) {
            socket.close(1002, "User does not have permission to perform this action.");
            return;
        }
        if (!this.logsConnConfig) {
            socket.close(1002, "Logs connection config is not set.");
            return;
        }
        if (!this.serviceName) {
            socket.close(1002, "serviceName is not set.");
            return;
        }

        // Create a new redis connection for this client
        const redis: Redis = await new Redis(this.logsConnConfig.url, this.logsConnConfig.options);

        const channelName: string = this.serviceName + "-logs";
        try {
            await redis.subscribe(channelName);
            this.logger.info(`User ${user.uid} successfully subscribed to logging channel.`);
            redis.on("message", (channel: string, message: string) => {
                // Forward the message to the client
                socket.send(message, (err) => {
                    if (err) {
                        this.logger.error(`Failed to forward message to client ${user.uid}, channel=${channel}.`);
                        this.logger.debug(err);
                    }
                });
            });
            socket.send(JSON.stringify({ id: 0, type: "SUBSCRIBED", success: true, data: channelName }));

            socket.on("close", async (code: number, reason: string) => {
                // Unsubscribe from all redis pub/sub channels
                await redis.unsubscribe(channelName);
                // Disconnect the redis client
                redis.disconnect();
    
                // Remove the socket from our tracked list
                const socks: any[] = this.activeSockets.get(user.uid) || [];
                socks.splice(socks.indexOf(socket), 1);
                this.activeSockets.set(user.uid, socks);
            });
    
            // Add the socket to our tracked list
            const socks: any[] = this.activeSockets.get(user.uid) || [];
            socks.push(socket);
            this.activeSockets.set(user.uid, socks);
        } catch (err: any) {
            this.logger.error(`User ${user.uid} failed to subscribe to logging channel.`);
            this.logger.debug(err);
            socket.close();

            // Remove the socket from our tracked list
            const socks: any[] = this.activeSockets.get(user.uid) || [];
            socks.splice(socks.indexOf(socket), 1);
            this.activeSockets.set(user.uid, socks);
        }
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
