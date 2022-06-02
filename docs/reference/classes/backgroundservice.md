**[@composer-js/service-core](../README.md)**

> [Globals](../globals.md) / BackgroundService

# Class: BackgroundService

The `BackgroundService` is an abstract base class for defining scheduled background services. A background service
executes in the background once on startup or on a set schedule (like a cron job) and performs additional processing.

**`author`** Jean-Philippe Steinmetz <info@acceleratxr.com>

## Hierarchy

* **BackgroundService**

## Index

### Constructors

* [constructor](backgroundservice.md#constructor)

### Properties

* [config](backgroundservice.md#config)
* [logger](backgroundservice.md#logger)

### Methods

* [run](backgroundservice.md#run)
* [start](backgroundservice.md#start)
* [stop](backgroundservice.md#stop)

## Constructors

### constructor

\+ **new BackgroundService**(`config`: any, `logger`: any): [BackgroundService](backgroundservice.md)

*Defined in src/BackgroundService.ts:14*

#### Parameters:

Name | Type |
------ | ------ |
`config` | any |
`logger` | any |

**Returns:** [BackgroundService](backgroundservice.md)

## Properties

### config

• `Protected` **config**: any

*Defined in src/BackgroundService.ts:12*

The global application configuration that the service can reference.

___

### logger

• `Protected` **logger**: any

*Defined in src/BackgroundService.ts:14*

The logging utility to use.

## Methods

### run

▸ `Abstract`**run**(): Promise\<void> \| void

*Defined in src/BackgroundService.ts:24*

The processing function to execute at each scheduled interval.

**Returns:** Promise\<void> \| void

___

### start

▸ `Abstract`**start**(): Promise\<void> \| void

*Defined in src/BackgroundService.ts:29*

Initializes the background service with any defaults.

**Returns:** Promise\<void> \| void

___

### stop

▸ `Abstract`**stop**(): Promise\<void> \| void

*Defined in src/BackgroundService.ts:34*

Shuts down the background allowing the service to complete any outstanding tasks.

**Returns:** Promise\<void> \| void
