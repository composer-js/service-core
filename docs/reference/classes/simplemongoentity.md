[@composer-js/service-core](../README.md) › [Globals](../globals.md) › [SimpleMongoEntity](simplemongoentity.md)

# Class: SimpleMongoEntity

Provides a simple base class for all entity's that will be persisted with TypeORM in a MongoDB database. Unlike
`BaseMongoEntity` this class does not provide optimistic locking or date created and modified tracking.

**`author`** Jean-Philippe Steinmetz <info@acceleratxr.com>

## Hierarchy

* BaseEntity

  ↳ **SimpleMongoEntity**

## Index

### Constructors

* [constructor](simplemongoentity.md#constructor)

### Properties

* [_id](simplemongoentity.md#optional-_id)
* [uid](simplemongoentity.md#uid)

## Constructors

###  constructor

\+ **new SimpleMongoEntity**(`other?`: any): *[SimpleMongoEntity](simplemongoentity.md)*

*Overrides void*

Defined in src/models/SimpleMongoEntity.ts:18

**Parameters:**

Name | Type |
------ | ------ |
`other?` | any |

**Returns:** *[SimpleMongoEntity](simplemongoentity.md)*

## Properties

### `Optional` _id

• **_id**? : *ObjectID*

Defined in src/models/SimpleMongoEntity.ts:18

The internal unique identifier used by MongoDB.

___

###  uid

• **uid**: *string* = uuid.v4()

*Inherited from [SimpleMongoEntity](simplemongoentity.md).[uid](simplemongoentity.md#uid)*

Defined in src/models/SimpleEntity.ts:21

The universally unique identifier of the entity.
