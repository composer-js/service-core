[@acceleratxr/service-core](../README.md) › [Globals](../globals.md) › [BackgroundService](backgroundservice.md)

# Class: BackgroundService

The `BackgroundService` is an abstract base class for defining scheduled background services. A background service
executes in the background on a set schedule (like a cron job) and performs additional processing.

**`author`** Jean-Philippe Steinmetz <info@acceleratxr.com>

## Hierarchy

* **BackgroundService**

## Index

### Constructors

* [constructor](backgroundservice.md#constructor)

### Properties

* [config](backgroundservice.md#protected-config)
* [logger](backgroundservice.md#protected-logger)

### Accessors

* [schedule](backgroundservice.md#schedule)

### Methods

* [run](backgroundservice.md#abstract-run)
* [start](backgroundservice.md#abstract-start)
* [stop](backgroundservice.md#abstract-stop)

## Constructors

###  constructor

\+ **new BackgroundService**(`config`: any, `logger`: any): *[BackgroundService](backgroundservice.md)*

Defined in src/BackgroundService.ts:14

**Parameters:**

Name | Type |
------ | ------ |
`config` | any |
`logger` | any |

**Returns:** *[BackgroundService](backgroundservice.md)*

## Properties

### `Protected` config

• **config**: *any*

Defined in src/BackgroundService.ts:12

The global application configuration that the service can reference.

___

### `Protected` logger

• **logger**: *any*

Defined in src/BackgroundService.ts:14

The logging utility to use.

## Accessors

###  schedule

• **get schedule**(): *string | undefined*

Defined in src/BackgroundService.ts:24

Returns the desired execution interval that this service should be scheduled with.

**Returns:** *string | undefined*

## Methods

### `Abstract` run

▸ **run**(): *void*

Defined in src/BackgroundService.ts:29

The processing function to execute at each scheduled interval.

**Returns:** *void*

___

### `Abstract` start

▸ **start**(): *Promise‹void›*

Defined in src/BackgroundService.ts:34

Initializes the background service with any defaults.

**Returns:** *Promise‹void›*

___

### `Abstract` stop

▸ **stop**(): *Promise‹void›*

Defined in src/BackgroundService.ts:39

Shuts down the background allowing the service to complete any outstanding tasks.

**Returns:** *Promise‹void›*
