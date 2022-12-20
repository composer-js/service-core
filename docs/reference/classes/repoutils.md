[@acceleratxr/service-core](../README.md) › [Globals](../globals.md) › [RepoUtils](repoutils.md)

# Class: RepoUtils

**`author`** Jean-Philippe Steinmetz

## Hierarchy

* **RepoUtils**

## Index

### Methods

* [preprocessBeforeSave](repoutils.md#static-preprocessbeforesave)
* [preprocessBeforeUpdate](repoutils.md#static-preprocessbeforeupdate)

## Methods

### `Static` preprocessBeforeSave

▸ **preprocessBeforeSave**‹**T**›(`repo`: Repository‹T› | MongoRepository‹T›, `obj`: T): *Promise‹T›*

Defined in src/models/RepoUtils.ts:19

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

▸ **preprocessBeforeUpdate**‹**T**›(`repo`: Repository‹T› | MongoRepository‹T›, `obj`: T, `old?`: T): *Promise‹T›*

Defined in src/models/RepoUtils.ts:50

Verify object does exist and update required fields

**Type parameters:**

▪ **T**: *[BaseEntity](baseentity.md) | SimpleEntity*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`repo` | Repository‹T› &#124; MongoRepository‹T› | Repository used to verify no existing object |
`obj` | T | Object that exentds BaseEntity or SimpleEntity |
`old?` | T | The original object to validate against  |

**Returns:** *Promise‹T›*
