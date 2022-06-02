**[@composer-js/service-core](../README.md)**

> [Globals](../globals.md) / BackgroundServiceManager

# Class: BackgroundServiceManager

The `BackgroundServiceManager` manages all configured background services in the application. It is responsible for
initializing the jobs, scheduling them and performing any related shutdown tasks. See the `BackgroundService`
class for details on how to create a background service class to be used by this manager.

## Usage
To use the manager instantiate a new object and provide the required constructor arguments. Then simply call the
`startAll` function. When shutting your application down you should call the `stopAll` function.

```
import { BackgroundServiceManager } from "@composer-js/services_manager";

const manager: BackgroundServiceManager = new BackgroundServiceManager(objectFactory, config, logger);
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

* [classLoader](backgroundservicemanager.md#classloader)
* [config](backgroundservicemanager.md#config)
* [jobs](backgroundservicemanager.md#jobs)
* [logger](backgroundservicemanager.md#logger)
* [objectFactory](backgroundservicemanager.md#objectfactory)
* [services](backgroundservicemanager.md#services)

### Methods

* [getService](backgroundservicemanager.md#getservice)
* [start](backgroundservicemanager.md#start)
* [startAll](backgroundservicemanager.md#startall)
* [stop](backgroundservicemanager.md#stop)
* [stopAll](backgroundservicemanager.md#stopall)

## Constructors

### constructor

\+ **new BackgroundServiceManager**(`classLoader`: ClassLoader, `objectFactory`: [ObjectFactory](objectfactory.md), `config`: any, `logger`: any): [BackgroundServiceManager](backgroundservicemanager.md)

*Defined in src/BackgroundServiceManager.ts:43*

#### Parameters:

Name | Type |
------ | ------ |
`classLoader` | ClassLoader |
`objectFactory` | [ObjectFactory](objectfactory.md) |
`config` | any |
`logger` | any |

**Returns:** [BackgroundServiceManager](backgroundservicemanager.md)

## Properties

### classLoader

• `Private` **classLoader**: ClassLoader

*Defined in src/BackgroundServiceManager.ts:38*

___

### config

• `Private` `Readonly` **config**: any

*Defined in src/BackgroundServiceManager.ts:39*

___

### jobs

• `Private` **jobs**: any

*Defined in src/BackgroundServiceManager.ts:40*

___

### logger

• `Private` `Readonly` **logger**: any

*Defined in src/BackgroundServiceManager.ts:41*

___

### objectFactory

• `Private` **objectFactory**: [ObjectFactory](objectfactory.md)

*Defined in src/BackgroundServiceManager.ts:42*

___

### services

• `Private` **services**: any

*Defined in src/BackgroundServiceManager.ts:43*

## Methods

### getService

▸ **getService**(`name`: string): [BackgroundService](backgroundservice.md) \| undefined

*Defined in src/BackgroundServiceManager.ts:57*

Returns the service instance with the given name.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`name` | string | The name of the background service to retrieve.  |

**Returns:** [BackgroundService](backgroundservice.md) \| undefined

___

### start

▸ **start**(`serviceName`: string, `clazz?`: any, ...`args`: any): Promise\<void>

*Defined in src/BackgroundServiceManager.ts:86*

Starts the background service with the given name.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`serviceName` | string | The name of the background service to start. |
`clazz?` | any | The class type of the service to start. If not specified the name is used to lookup the                      class type. |
`...args` | any | The list of arguments to pass into the service constructor  |

**Returns:** Promise\<void>

___

### startAll

▸ **startAll**(): Promise\<void>

*Defined in src/BackgroundServiceManager.ts:64*

Starts all configured background services.

**Returns:** Promise\<void>

___

### stop

▸ **stop**(`serviceName`: string): Promise\<void>

*Defined in src/BackgroundServiceManager.ts:140*

Stops the background service with the given name.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`serviceName` | string | The name of the background service to stop.  |

**Returns:** Promise\<void>

___

### stopAll

▸ **stopAll**(): Promise\<void>

*Defined in src/BackgroundServiceManager.ts:125*

Stops all currently active background services that are owned by the manager.

**Returns:** Promise\<void>
