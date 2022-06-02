**[@composer-js/service-core](../README.md)**

> [Globals](../globals.md) / SimpleMongoEntity

# Class: SimpleMongoEntity

Provides a simple base class for all entity's that will be persisted with TypeORM in a MongoDB database. Unlike
`BaseMongoEntity` this class does not provide optimistic locking or date created and modified tracking.

**`author`** Jean-Philippe Steinmetz <info@acceleratxr.com>

## Hierarchy

* [SimpleEntity](simpleentity.md)

  ↳ **SimpleMongoEntity**

## Index

### Constructors

* [constructor](simplemongoentity.md#constructor)

### Properties

* [\_id](simplemongoentity.md#_id)
* [uid](simplemongoentity.md#uid)

## Constructors

### constructor

\+ **new SimpleMongoEntity**(`other?`: any): [SimpleMongoEntity](simplemongoentity.md)

*Overrides [SimpleEntity](simpleentity.md).[constructor](simpleentity.md#constructor)*

*Defined in src/models/SimpleMongoEntity.ts:18*

#### Parameters:

Name | Type |
------ | ------ |
`other?` | any |

**Returns:** [SimpleMongoEntity](simplemongoentity.md)

## Properties

### \_id

• `Optional` **\_id**: [ObjectID](../globals.md#objectid)

*Defined in src/models/SimpleMongoEntity.ts:18*

The internal unique identifier used by MongoDB.

___

### uid

•  **uid**: string = uuid.v4()

*Inherited from [SimpleEntity](simpleentity.md).[uid](simpleentity.md#uid)*

*Defined in src/models/SimpleEntity.ts:21*

The universally unique identifier of the entity.
