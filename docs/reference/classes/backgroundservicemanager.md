[@acceleratxr/service-core](../README.md) › [Globals](../globals.md) › [BackgroundServiceManager](backgroundservicemanager.md)

# Class: BackgroundServiceManager

The `BackgroundServiceManager` manages all configured background services in the application. It is responsible for
initializing the jobs, scheduling them and performing any related shutdown tasks. See the `BackgroundService`
class for details on how to create a background service class to be used by this manager.

## Usage
To use the manager instantiate a new object and provide the required constructor arguments. Then simply call the
`startAll` function. When shutting your application down you should call the `stopAll` function.

```
import { BackgroundServiceManager } from "@acceleratxr/services_manager";

const manager: BackgroundServiceManager = new BackgroundServiceManager(objectFactory, scriptManager, config, logger);
await manager.startAll();
...
await manager.stopAll();
```

You may optionally start and stop individual services using the `start` and `stop` functions respectively.

```
await manager.start("MyService");
...
await manger.stop("MyService");
```

**`author`** Jean-Philippe Steinmetz <info@acceleratxr.com>

## Hierarchy

* **BackgroundServiceManager**

## Index

### Constructors

* [constructor](backgroundservicemanager.md#constructor)

### Properties

* [config](backgroundservicemanager.md#private-readonly-config)
* [defaultSchedule](backgroundservicemanager.md#private-readonly-defaultschedule)
* [jobs](backgroundservicemanager.md#private-jobs)
* [logger](backgroundservicemanager.md#private-readonly-logger)
* [objectFactory](backgroundservicemanager.md#private-objectfactory)
* [scriptManager](backgroundservicemanager.md#private-scriptmanager)
* [services](backgroundservicemanager.md#private-services)

### Methods

* [getService](backgroundservicemanager.md#getservice)
* [start](backgroundservicemanager.md#start)
* [startAll](backgroundservicemanager.md#startall)
* [stop](backgroundservicemanager.md#stop)
* [stopAll](backgroundservicemanager.md#stopall)

## Constructors

###  constructor

\+ **new BackgroundServiceManager**(`objectFactory`: [ObjectFactory](objectfactory.md), `scriptManager`: [ScriptManager](scriptmanager.md), `config`: any, `logger`: any): *[BackgroundServiceManager](backgroundservicemanager.md)*

Defined in src/BackgroundServiceManager.ts:44

**Parameters:**

Name | Type |
------ | ------ |
`objectFactory` | [ObjectFactory](objectfactory.md) |
`scriptManager` | [ScriptManager](scriptmanager.md) |
`config` | any |
`logger` | any |

**Returns:** *[BackgroundServiceManager](backgroundservicemanager.md)*

## Properties

### `Private` `Readonly` config

• **config**: *any*

Defined in src/BackgroundServiceManager.ts:38

___

### `Private` `Readonly` defaultSchedule

• **defaultSchedule**: *string*

Defined in src/BackgroundServiceManager.ts:39

___

### `Private` jobs

• **jobs**: *any*

Defined in src/BackgroundServiceManager.ts:40

___

### `Private` `Readonly` logger

• **logger**: *any*

Defined in src/BackgroundServiceManager.ts:41

___

### `Private` objectFactory

• **objectFactory**: *[ObjectFactory](objectfactory.md)*

Defined in src/BackgroundServiceManager.ts:42

___

### `Private` scriptManager

• **scriptManager**: *[ScriptManager](scriptmanager.md)*

Defined in src/BackgroundServiceManager.ts:44

___

### `Private` services

• **services**: *any*

Defined in src/BackgroundServiceManager.ts:43

## Methods

###  getService

▸ **getService**(`name`: string): *[BackgroundService](backgroundservice.md)*

Defined in src/BackgroundServiceManager.ts:59

Returns the service instance with the given name.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | The name of the background service to retrieve.  |

**Returns:** *[BackgroundService](backgroundservice.md)*

___

###  start

▸ **start**(`serviceName`: string, `clazz?`: any): *Promise‹void›*

Defined in src/BackgroundServiceManager.ts:80

Starts the background service with the given name.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`serviceName` | string | The name of the background service to start. |
`clazz?` | any | The class type of the service to start. If not specified the name is used to lookup the                      class type.  |

**Returns:** *Promise‹void›*

___

###  startAll

▸ **startAll**(): *Promise‹void›*

Defined in src/BackgroundServiceManager.ts:66

Starts all configured background services.

**Returns:** *Promise‹void›*

___

###  stop

▸ **stop**(`serviceName`: string): *Promise‹void›*

Defined in src/BackgroundServiceManager.ts:126

Stops the background service with the given name.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`serviceName` | string | The name of the background service to stop.  |

**Returns:** *Promise‹void›*

___

###  stopAll

▸ **stopAll**(): *Promise‹void›*

Defined in src/BackgroundServiceManager.ts:111

Stops all currently active background services that are owned by the manager.

**Returns:** *Promise‹void›*
