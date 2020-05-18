///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////

/**
 * Utility functions for sending push notifications to registered clients.
 *
 * @author Jean-Philippe Steinmetz
 */
class NotificationUtils {
    private socketio: any = null;

    /**
     * Initializes the utility using the given configuration.
     *
     * @param {any} config The configuration to use for initialization.
     */
    constructor(config: any) {
        this.socketio = require("socket.io-emitter")(config.redis).of(config.namespace);
    }

    /**
     * Broadcasts a given message to all users.
     *
     * @param {any} type The type of message being sent.
     * @param {any} message The message contents to send to all users.
     * @param {bool} volatile Set to true if the message can be dropped (unreliable).
     */
    public broadcastMessage(type: any, message: any, volatile: boolean): void {
        if (this.socketio) {
            if (volatile) {
                this.socketio.to("allusers").volatile.emit(type, message);
            } else {
                this.socketio.to("allusers").emit(type, message);
            }
        } else {
            throw new Error("Socket.io not configured or failed to connect.");
        }
    }

    /**
     * Sends a given message to the room or user with the specified uid.
     *
     * @param {string} uid The universally unique identifier of the room or user to send the message to.
     * @param {string} type The type of message being sent.
     * @param {string} message The message contents to send to the room or user.
     * @param {bool} volatile Set to true if the message can be dropped (unreliable).
     */
    public sendMessage(uid: string, type: string, message: any, volatile: boolean): void {
        if (this.socketio) {
            if (volatile) {
                this.socketio.to(uid).volatile.emit(type, message);
            } else {
                this.socketio.to(uid).emit(type, message);
            }
        } else {
            throw new Error("Socket.io not configured or failed to connect.");
        }
    }
}

export default NotificationUtils;
