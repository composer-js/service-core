**[@composer-js/service-core](../README.md)**

> [Globals](../globals.md) / BaseEntity

# Class: BaseEntity

Provides a common base class for all entity's that will be persisted with TypeORM.

Note that the `@CreateDateColumn`, `@UpdateDateColumn`, and `@VersionColumn` decorators from TypeORM are not supported
because they are not implemented in TypeORM's MongoDB support. They are instead implemented directly by this
library as part of `ModelRoute`.

**`author`** Jean-Philippe Steinmetz <info@acceleratxr.com>

## Hierarchy

* **BaseEntity**

  ↳ [BaseMongoEntity](basemongoentity.md)

## Index

### Constructors

* [constructor](baseentity.md#constructor)

### Properties

* [dateCreated](baseentity.md#datecreated)
* [dateModified](baseentity.md#datemodified)
* [uid](baseentity.md#uid)
* [version](baseentity.md#version)

## Constructors

### constructor

\+ **new BaseEntity**(`other?`: any): [BaseEntity](baseentity.md)

*Defined in src/models/BaseEntity.ts:42*

#### Parameters:

Name | Type |
------ | ------ |
`other?` | any |

**Returns:** [BaseEntity](baseentity.md)

## Properties

### dateCreated

•  **dateCreated**: Date = new Date()

*Defined in src/models/BaseEntity.ts:30*

The date and time that the entity was created.

___

### dateModified

•  **dateModified**: Date = new Date()

*Defined in src/models/BaseEntity.ts:36*

The date and time that the entity was last modified.

___

### uid

•  **uid**: string = uuid.v4()

*Defined in src/models/BaseEntity.ts:24*

The universally unique identifier of the entity.

___

### version

•  **version**: number = 0

*Defined in src/models/BaseEntity.ts:42*

The optimistic lock version.
