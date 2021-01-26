**[@composer-js/service-core](../README.md)**

> [Globals](../globals.md) / ConnectionManager

# Class: ConnectionManager

Provides database connection management.

**`author`** Jean-Philippe Steinmetz

## Hierarchy

* **ConnectionManager**

## Index

### Properties

* [connections](connectionmanager.md#connections)

### Methods

* [connect](connectionmanager.md#connect)
* [disconnect](connectionmanager.md#disconnect)

## Properties

### connections

▪ `Static` **connections**: Map\<string, Connection \| Redis.Redis> = new Map()

*Defined in src/database/ConnectionManager.ts:16*

## Methods

### connect

▸ `Static`**connect**(`datastores`: any, `models`: any): Promise\<void>

*Defined in src/database/ConnectionManager.ts:24*

Attempts to initiate all database connections as defined in the config.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`datastores` | any | - |
`models` | any | A map of model names and associated class definitions to establish database connections for.  |

**Returns:** Promise\<void>

___

### disconnect

▸ `Static`**disconnect**(): Promise\<void>

*Defined in src/database/ConnectionManager.ts:85*

Attempts to disconnect all active database connections.

**Returns:** Promise\<void>
