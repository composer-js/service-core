**[@composer-js/service-core](../README.md)**

> [Globals](../globals.md) / RepoUtils

# Class: RepoUtils

**`author`** Jean-Philippe Steinmetz

## Hierarchy

* **RepoUtils**

## Index

### Methods

* [preprocessBeforeSave](repoutils.md#preprocessbeforesave)
* [preprocessBeforeUpdate](repoutils.md#preprocessbeforeupdate)

## Methods

### preprocessBeforeSave

▸ `Static`**preprocessBeforeSave**\<T>(`repo`: Repository\<T> \| MongoRepository\<T>, `obj`: T): Promise\<T>

*Defined in src/models/RepoUtils.ts:19*

Verify object does not exist and update required fields for BaseEntity

#### Type parameters:

Name | Type |
------ | ------ |
`T` | [BaseEntity](baseentity.md) \| [SimpleEntity](simpleentity.md) |

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`repo` | Repository\<T> \| MongoRepository\<T> | Repository used to verify no existing object |
`obj` | T | Object that exentds BaseEntity or SimpleEntity  |

**Returns:** Promise\<T>

___

### preprocessBeforeUpdate

▸ `Static`**preprocessBeforeUpdate**\<T>(`repo`: Repository\<T> \| MongoRepository\<T>, `modelClass`: any, `obj`: T, `old?`: T): Promise\<T>

*Defined in src/models/RepoUtils.ts:56*

Verify object does exist and update required fields

#### Type parameters:

Name | Type |
------ | ------ |
`T` | [BaseEntity](baseentity.md) \| [SimpleEntity](simpleentity.md) |

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`repo` | Repository\<T> \| MongoRepository\<T> | Repository used to verify no existing object |
`modelClass` | any | - |
`obj` | T | Object that exentds BaseEntity or SimpleEntity |
`old?` | T | The original object to validate against  |

**Returns:** Promise\<T>
