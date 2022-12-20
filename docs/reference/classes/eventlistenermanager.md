[@acceleratxr/service-core](../README.md) › [Globals](../globals.md) › [EventListenerManager](eventlistenermanager.md)

# Class: EventListenerManager

The `EventListenerManager` is responsible for managing event handlers and processing of incoming
events from the configured redis pubsub channels. An event handler is any function that has been
decorated with the `@OnEvent` decorator and registered with this manager. Once registered, any event
that is received corresponding to the list of types specified in the decorator arguments will be
sent to the designated function(s). If no type is specified, the handler function will be called
for any event that is received.

**`author`** Jean-Philippe Steinmetz <info@acceleratxr.com>

## Hierarchy

* **EventListenerManager**

## Index

### Constructors

* [constructor](eventlistenermanager.md#constructor)

### Properties

* [config](eventlistenermanager.md#private-config)
* [handlers](eventlistenermanager.md#private-handlers)
* [logger](eventlistenermanager.md#private-logger)
* [objectFactory](eventlistenermanager.md#private-objectfactory)
* [redis](eventlistenermanager.md#private-redis)
* [scriptManager](eventlistenermanager.md#private-scriptmanager)

### Methods

* [addEventHandler](eventlistenermanager.md#private-addeventhandler)
* [destroy](eventlistenermanager.md#destroy)
* [onEvent](eventlistenermanager.md#private-onevent)
* [register](eventlistenermanager.md#register)

## Constructors

###  constructor

\+ **new EventListenerManager**(`config`: any, `logger`: any, `objectFactory`: [ObjectFactory](objectfactory.md), `redis`: Redis, `scriptManager`: [ScriptManager](scriptmanager.md)): *[EventListenerManager](eventlistenermanager.md)*

Defined in src/EventListenerManager.ts:26

**Parameters:**

Name | Type |
------ | ------ |
`config` | any |
`logger` | any |
`objectFactory` | [ObjectFactory](objectfactory.md) |
`redis` | Redis |
`scriptManager` | [ScriptManager](scriptmanager.md) |

**Returns:** *[EventListenerManager](eventlistenermanager.md)*

## Properties

### `Private` config

• **config**: *any*

Defined in src/EventListenerManager.ts:21

___

### `Private` handlers

• **handlers**: *Map‹string, Function[]›* = new Map()

Defined in src/EventListenerManager.ts:24

___

### `Private` logger

• **logger**: *any*

Defined in src/EventListenerManager.ts:22

___

### `Private` objectFactory

• **objectFactory**: *[ObjectFactory](objectfactory.md)*

Defined in src/EventListenerManager.ts:23

___

### `Private` redis

• **redis**: *Redis*

Defined in src/EventListenerManager.ts:25

___

### `Private` scriptManager

• **scriptManager**: *[ScriptManager](scriptmanager.md)*

Defined in src/EventListenerManager.ts:26

## Methods

### `Private` addEventHandler

▸ **addEventHandler**(`event`: string, `func`: Function): *void*

Defined in src/EventListenerManager.ts:96

Adds the given function to the list of designated event handlers for the specified type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | string | The type of event to add a handler for |
`func` | Function | The function to add  |

**Returns:** *void*

___

###  destroy

▸ **destroy**(): *Promise‹void›*

Defined in src/EventListenerManager.ts:67

**Returns:** *Promise‹void›*

___

### `Private` onEvent

▸ **onEvent**(`evt`: Event): *void*

Defined in src/EventListenerManager.ts:75

Handler function for events that arrive from redis.

**Parameters:**

Name | Type |
------ | ------ |
`evt` | Event |

**Returns:** *void*

___

###  register

▸ **register**(`obj`: any): *void*

Defined in src/EventListenerManager.ts:115

Registers the given object to be notified of events that arrive.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`obj` | any | The object to register for event handling.  |

**Returns:** *void*
