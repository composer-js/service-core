**[@composer-js/service-core](../README.md)**

> [Globals](../globals.md) / SimpleEntity

# Class: SimpleEntity

Provides a simple base class for all entity's that will be persisted with TypeORM. Unlike `BaseEntity` this class
does not provide optimistic locking or date created and modified tracking.

**`author`** Jean-Philippe Steinmetz <info@acceleratxr.com>

## Hierarchy

* **SimpleEntity**

  ↳ [SimpleMongoEntity](simplemongoentity.md)

## Index

### Constructors

* [constructor](simpleentity.md#constructor)

### Properties

* [uid](simpleentity.md#uid)

## Constructors

### constructor

\+ **new SimpleEntity**(`other?`: any): [SimpleEntity](simpleentity.md)

*Defined in src/models/SimpleEntity.ts:21*

#### Parameters:

Name | Type |
------ | ------ |
`other?` | any |

**Returns:** [SimpleEntity](simpleentity.md)

## Properties

### uid

•  **uid**: string = uuid.v4()

*Defined in src/models/SimpleEntity.ts:21*

The universally unique identifier of the entity.
