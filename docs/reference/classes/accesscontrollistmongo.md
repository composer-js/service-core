**[@composer-js/service-core](../README.md)**

> [Globals](../globals.md) / AccessControlListMongo

# Class: AccessControlListMongo

Implementation of the `AccessControlList` interface for use with MongoDB databases.

## Hierarchy

* [BaseMongoEntity](basemongoentity.md)

  ↳ **AccessControlListMongo**

## Implements

* [AccessControlList](../interfaces/accesscontrollist.md)

## Index

### Constructors

* [constructor](accesscontrollistmongo.md#constructor)

### Properties

* [\_id](accesscontrollistmongo.md#_id)
* [dateCreated](accesscontrollistmongo.md#datecreated)
* [dateModified](accesscontrollistmongo.md#datemodified)
* [parent](accesscontrollistmongo.md#parent)
* [parentUid](accesscontrollistmongo.md#parentuid)
* [records](accesscontrollistmongo.md#records)
* [uid](accesscontrollistmongo.md#uid)
* [version](accesscontrollistmongo.md#version)

## Constructors

### constructor

\+ **new AccessControlListMongo**(`other?`: any): [AccessControlListMongo](accesscontrollistmongo.md)

*Overrides [BaseMongoEntity](basemongoentity.md).[constructor](basemongoentity.md#constructor)*

*Defined in src/security/AccessControlListMongo.ts:65*

#### Parameters:

Name | Type |
------ | ------ |
`other?` | any |

**Returns:** [AccessControlListMongo](accesscontrollistmongo.md)

## Properties

### \_id

• `Optional` **\_id**: ObjectID

*Inherited from [BaseMongoEntity](basemongoentity.md).[_id](basemongoentity.md#_id)*

*Defined in src/models/BaseMongoEntity.ts:18*

The internal unique identifier used by MongoDB.

___

### dateCreated

•  **dateCreated**: Date = new Date()

*Implementation of [AccessControlList](../interfaces/accesscontrollist.md).[dateCreated](../interfaces/accesscontrollist.md#datecreated)*

*Inherited from [BaseEntity](baseentity.md).[dateCreated](baseentity.md#datecreated)*

*Defined in src/models/BaseEntity.ts:30*

The date and time that the entity was created.

___

### dateModified

•  **dateModified**: Date = new Date()

*Implementation of [AccessControlList](../interfaces/accesscontrollist.md).[dateModified](../interfaces/accesscontrollist.md#datemodified)*

*Inherited from [BaseEntity](baseentity.md).[dateModified](baseentity.md#datemodified)*

*Defined in src/models/BaseEntity.ts:36*

The date and time that the entity was last modified.

___

### parent

• `Optional` **parent**: [AccessControlList](../interfaces/accesscontrollist.md)

*Implementation of [AccessControlList](../interfaces/accesscontrollist.md).[parent](../interfaces/accesscontrollist.md#parent)*

*Defined in src/security/AccessControlListMongo.ts:58*

___

### parentUid

• `Optional` **parentUid**: string \| undefined

*Implementation of [AccessControlList](../interfaces/accesscontrollist.md).[parentUid](../interfaces/accesscontrollist.md#parentuid)*

*Defined in src/security/AccessControlListMongo.ts:62*

___

### records

•  **records**: [ACLRecordMongo](aclrecordmongo.md)[] = []

*Implementation of [AccessControlList](../interfaces/accesscontrollist.md).[records](../interfaces/accesscontrollist.md#records)*

*Defined in src/security/AccessControlListMongo.ts:65*

___

### uid

•  **uid**: string = uuid.v4()

*Implementation of [AccessControlList](../interfaces/accesscontrollist.md).[uid](../interfaces/accesscontrollist.md#uid)*

*Inherited from [BaseEntity](baseentity.md).[uid](baseentity.md#uid)*

*Defined in src/models/BaseEntity.ts:24*

The universally unique identifier of the entity.

___

### version

•  **version**: number = 0

*Implementation of [AccessControlList](../interfaces/accesscontrollist.md).[version](../interfaces/accesscontrollist.md#version)*

*Inherited from [BaseEntity](baseentity.md).[version](baseentity.md#version)*

*Defined in src/models/BaseEntity.ts:42*

The optimistic lock version.
