[@composer-js/service-core](../README.md) › [Globals](../globals.md) › [NotificationUtils](notificationutils.md)

# Class: NotificationUtils

Utility functions for sending push notifications to registered clients.

**`author`** Jean-Philippe Steinmetz

## Hierarchy

* **NotificationUtils**

## Index

### Constructors

* [constructor](notificationutils.md#constructor)

### Properties

* [socketio](notificationutils.md#private-socketio)

### Methods

* [broadcastMessage](notificationutils.md#broadcastmessage)
* [sendMessage](notificationutils.md#sendmessage)

## Constructors

###  constructor

\+ **new NotificationUtils**(`config`: any): *[NotificationUtils](notificationutils.md)*

Defined in src/NotificationsUtils.ts:11

Initializes the utility using the given configuration.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`config` | any | The configuration to use for initialization.  |

**Returns:** *[NotificationUtils](notificationutils.md)*

## Properties

### `Private` socketio

• **socketio**: *any* = null

Defined in src/NotificationsUtils.ts:11

## Methods

###  broadcastMessage

▸ **broadcastMessage**(`type`: any, `message`: any, `volatile`: boolean): *void*

Defined in src/NotificationsUtils.ts:29

Broadcasts a given message to all users.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | any | The type of message being sent. |
`message` | any | The message contents to send to all users. |
`volatile` | boolean | Set to true if the message can be dropped (unreliable).  |

**Returns:** *void*

___

###  sendMessage

▸ **sendMessage**(`uid`: string, `type`: string, `message`: any, `volatile`: boolean): *void*

Defined in src/NotificationsUtils.ts:49

Sends a given message to the room or user with the specified uid.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`uid` | string | The universally unique identifier of the room or user to send the message to. |
`type` | string | The type of message being sent. |
`message` | any | The message contents to send to the room or user. |
`volatile` | boolean | Set to true if the message can be dropped (unreliable).  |

**Returns:** *void*
