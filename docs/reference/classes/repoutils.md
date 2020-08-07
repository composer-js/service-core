[@composer-js/service-core](../README.md) › [Globals](../globals.md) › [RepoUtils](repoutils.md)

# Class: RepoUtils

**`author`** Jean-Philippe Steinmetz

## Hierarchy

* **RepoUtils**

## Index

### Methods

* [preprocessBeforeSave](repoutils.md#static-preprocessbeforesave)
* [preprocessBeforeUpdate](repoutils.md#static-preprocessbeforeupdate)
* [searchIdQuery](repoutils.md#static-private-searchidquery)

## Methods

### `Static` preprocessBeforeSave

▸ **preprocessBeforeSave**<**T**>(`repo`: Repository‹T› | MongoRepository‹T›, `obj`: T): *Promise‹T›*

Defined in src/models/RepoUtils.ts:30

Verify object does not exist and update required fields for BaseEntity

**Type parameters:**

▪ **T**: *[BaseEntity](baseentity.md) | SimpleEntity*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`repo` | Repository‹T› &#124; MongoRepository‹T› | Repository used to verify no existing object |
`obj` | T | Object that exentds BaseEntity or SimpleEntity  |

**Returns:** *Promise‹T›*

___

### `Static` preprocessBeforeUpdate

▸ **preprocessBeforeUpdate**<**T**>(`repo`: Repository‹T› | MongoRepository‹T›, `obj`: T): *Promise‹T›*

Defined in src/models/RepoUtils.ts:59

Verify object does exist and update required fields

**Type parameters:**

▪ **T**: *[BaseEntity](baseentity.md) | SimpleEntity*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`repo` | Repository‹T› &#124; MongoRepository‹T› | Repository used to verify no existing object |
`obj` | T | Object that exentds BaseEntity or SimpleEntity  |

**Returns:** *Promise‹T›*

___

### `Static` `Private` searchIdQuery

▸ **searchIdQuery**<**T**>(`repo`: Repository‹T› | MongoRepository‹T›, `obj`: T, `id`: string): *any*

Defined in src/models/RepoUtils.ts:17

Search for existing object based on passed in id

**Type parameters:**

▪ **T**: *[BaseEntity](baseentity.md) | SimpleEntity*

**Parameters:**

Name | Type |
------ | ------ |
`repo` | Repository‹T› &#124; MongoRepository‹T› |
`obj` | T |
`id` | string |

**Returns:** *any*
