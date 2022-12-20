[@acceleratxr/service-core](../README.md) › [Globals](../globals.md) › [ConnectionManager](connectionmanager.md)

# Class: ConnectionManager

Provides database connection management.

**`author`** Jean-Philippe Steinmetz

## Hierarchy

* **ConnectionManager**

## Index

### Properties

* [connections](connectionmanager.md#static-connections)

### Methods

* [connect](connectionmanager.md#static-connect)
* [disconnect](connectionmanager.md#static-disconnect)

## Properties

### `Static` connections

▪ **connections**: *Map‹string, DataSource | Redis.Redis›* = new Map()

Defined in src/database/ConnectionManager.ts:16

## Methods

### `Static` connect

▸ **connect**(`datastores`: any, `models`: Map‹string, any›): *Promise‹void›*

Defined in src/database/ConnectionManager.ts:24

Attempts to initiate all database connections as defined in the config.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`datastores` | any | - |
`models` | Map‹string, any› | A map of model names and associated class definitions to establish database connections for.  |

**Returns:** *Promise‹void›*

___

### `Static` disconnect

▸ **disconnect**(): *Promise‹void›*

Defined in src/database/ConnectionManager.ts:99

Attempts to disconnect all active database connections.

**Returns:** *Promise‹void›*
