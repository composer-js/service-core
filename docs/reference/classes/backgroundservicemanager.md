[@composer-js/service-core](../README.md) › [Globals](../globals.md) › [BackgroundServiceManager](backgroundservicemanager.md)

# Class: BackgroundServiceManager

The `BackgroundServiceManager` manages all configured background services in the application. It is responsible for
initializing the jobs, scheduling them and performing any related shutdown tasks. See the `BackgroundService`
class for details on how to create a background service class to be used by this manager.

## Usage
To use the manager instantiate a new object and provide the required constructor arguments. Then simply call the
`startAll` function. When shutting your application down you should call the `stopAll` function.

```
import { BackgroundServiceManager } from "@acceleratxr/services_manager";

const manager: BackgroundServiceManager = new BackgroundServiceManager(".", config, logger);
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

## Configuration
Background services are defined in the global configuration file under the key `jobs`. The `jobs` object is a
standard map where the key is the service name (class/module name). Each configured service must have the
`schedule` property defined. If not, the `jobs.defaultSchedule` is applied for that service.

Example:
```
{
    jobs: {
        defaultSchedule: "* * * * * *",
        MyService: {
            schedule: "* * * * * *"
        },
    }
}
```

**`author`** Jean-Philippe Steinmetz <info@acceleratxr.com>

## Hierarchy

* **BackgroundServiceManager**

## Index

### Constructors

* [constructor](backgroundservicemanager.md#constructor)

### Properties

* [classLoader](backgroundservicemanager.md#private-classloader)
* [config](backgroundservicemanager.md#private-readonly-config)
* [jobs](backgroundservicemanager.md#private-jobs)
* [loaded](backgroundservicemanager.md#private-loaded)
* [logger](backgroundservicemanager.md#private-readonly-logger)
* [services](backgroundservicemanager.md#private-services)

### Methods

* [getService](backgroundservicemanager.md#getservice)
* [start](backgroundservicemanager.md#start)
* [startAll](backgroundservicemanager.md#startall)
* [stop](backgroundservicemanager.md#stop)
* [stopAll](backgroundservicemanager.md#stopall)

## Constructors

###  constructor

\+ **new BackgroundServiceManager**(`basePath`: string, `config`: any, `logger`: any): *[BackgroundServiceManager](backgroundservicemanager.md)*

Defined in src/BackgroundServiceManager.ts:60

**Parameters:**

Name | Type |
------ | ------ |
`basePath` | string |
`config` | any |
`logger` | any |

**Returns:** *[BackgroundServiceManager](backgroundservicemanager.md)*

## Properties

### `Private` classLoader

• **classLoader**: *ClassLoader*

Defined in src/BackgroundServiceManager.ts:55

___

### `Private` `Readonly` config

• **config**: *any*

Defined in src/BackgroundServiceManager.ts:56

___

### `Private` jobs

• **jobs**: *any*

Defined in src/BackgroundServiceManager.ts:57

___

### `Private` loaded

• **loaded**: *boolean* = false

Defined in src/BackgroundServiceManager.ts:58

___

### `Private` `Readonly` logger

• **logger**: *any*

Defined in src/BackgroundServiceManager.ts:59

___

### `Private` services

• **services**: *any*

Defined in src/BackgroundServiceManager.ts:60

## Methods

###  getService

▸ **getService**(`name`: string): *[BackgroundService](backgroundservice.md)*

Defined in src/BackgroundServiceManager.ts:73

Returns the service instance with the given name.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | The name of the background service to retrieve.  |

**Returns:** *[BackgroundService](backgroundservice.md)*

___

###  start

▸ **start**(`serviceName`: string): *Promise‹void›*

Defined in src/BackgroundServiceManager.ts:106

Starts the background service with the given name.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`serviceName` | string | The name of the background service to start.  |

**Returns:** *Promise‹void›*

___

###  startAll

▸ **startAll**(): *Promise‹void›*

Defined in src/BackgroundServiceManager.ts:80

Starts all configured background services.

**Returns:** *Promise‹void›*

___

###  stop

▸ **stop**(`serviceName`: string): *Promise‹void›*

Defined in src/BackgroundServiceManager.ts:153

Stops the background service with the given name.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`serviceName` | string | The name of the background service to stop.  |

**Returns:** *Promise‹void›*

___

###  stopAll

▸ **stopAll**(): *Promise‹void›*

Defined in src/BackgroundServiceManager.ts:138

Stops all currently active background services that are owned by the manager.

**Returns:** *Promise‹void›*
