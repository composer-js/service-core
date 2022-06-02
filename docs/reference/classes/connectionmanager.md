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

* [buildConnectionUri](connectionmanager.md#buildconnectionuri)
* [connect](connectionmanager.md#connect)
* [disconnect](connectionmanager.md#disconnect)

## Properties

### connections

▪ `Static` **connections**: Map\<string, Connection \| Redis.Redis> = new Map()

*Defined in src/database/ConnectionManager.ts:16*

## Methods

### buildConnectionUri

▸ `Static` `Private`**buildConnectionUri**(`config`: any): string

*Defined in src/database/ConnectionManager.ts:21*

Builds a compatible connection URI for the database by the provided configuration.

#### Parameters:

Name | Type |
------ | ------ |
`config` | any |

**Returns:** string

___

### connect

▸ `Static`**connect**(`datastores`: any, `models`: Map\<string, any>): Promise\<void>

*Defined in src/database/ConnectionManager.ts:39*

Attempts to initiate all database connections as defined in the config.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`datastores` | any | - |
`models` | Map\<string, any> | A map of model names and associated class definitions to establish database connections for.  |

**Returns:** Promise\<void>

___

### disconnect

▸ `Static`**disconnect**(): Promise\<void>

*Defined in src/database/ConnectionManager.ts:110*

Attempts to disconnect all active database connections.

**Returns:** Promise\<void>
