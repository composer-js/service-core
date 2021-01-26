**[@composer-js/service-core](../README.md)**

> [Globals](../globals.md) / BaseMongoEntity

# Class: BaseMongoEntity

Provides a common base class for all entity's that will be persisted with TypeORM in a MongoDB database.

**`author`** Jean-Philippe Steinmetz <info@acceleratxr.com>

## Hierarchy

* [BaseEntity](baseentity.md)

  ↳ **BaseMongoEntity**

  ↳↳ [AccessControlListMongo](accesscontrollistmongo.md)

## Index

### Constructors

* [constructor](basemongoentity.md#constructor)

### Properties

* [\_id](basemongoentity.md#_id)
* [dateCreated](basemongoentity.md#datecreated)
* [dateModified](basemongoentity.md#datemodified)
* [uid](basemongoentity.md#uid)
* [version](basemongoentity.md#version)

## Constructors

### constructor

\+ **new BaseMongoEntity**(`other?`: any): [BaseMongoEntity](basemongoentity.md)

*Overrides [BaseEntity](baseentity.md).[constructor](baseentity.md#constructor)*

*Defined in src/models/BaseMongoEntity.ts:18*

#### Parameters:

Name | Type |
------ | ------ |
`other?` | any |

**Returns:** [BaseMongoEntity](basemongoentity.md)

## Properties

### \_id

• `Optional` **\_id**: ObjectID

*Defined in src/models/BaseMongoEntity.ts:18*

The internal unique identifier used by MongoDB.

___

### dateCreated

•  **dateCreated**: Date = new Date()

*Inherited from [BaseEntity](baseentity.md).[dateCreated](baseentity.md#datecreated)*

*Defined in src/models/BaseEntity.ts:30*

The date and time that the entity was created.

___

### dateModified

•  **dateModified**: Date = new Date()

*Inherited from [BaseEntity](baseentity.md).[dateModified](baseentity.md#datemodified)*

*Defined in src/models/BaseEntity.ts:36*

The date and time that the entity was last modified.

___

### uid

•  **uid**: string = uuid.v4()

*Inherited from [BaseEntity](baseentity.md).[uid](baseentity.md#uid)*

*Defined in src/models/BaseEntity.ts:24*

The universally unique identifier of the entity.

___

### version

•  **version**: number = 0

*Inherited from [BaseEntity](baseentity.md).[version](baseentity.md#version)*

*Defined in src/models/BaseEntity.ts:42*

The optimistic lock version.
