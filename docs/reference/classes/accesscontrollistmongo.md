[@composer-js/service-core](../README.md) › [Globals](../globals.md) › [AccessControlListMongo](accesscontrollistmongo.md)

# Class: AccessControlListMongo

Implementation of the `AccessControlList` interface for use with MongoDB databases.

## Hierarchy

  ↳ [BaseMongoEntity](basemongoentity.md)

  ↳ **AccessControlListMongo**

## Implements

* [AccessControlList](../interfaces/accesscontrollist.md)

## Index

### Constructors

* [constructor](accesscontrollistmongo.md#constructor)

### Properties

* [_id](accesscontrollistmongo.md#optional-_id)
* [dateCreated](accesscontrollistmongo.md#datecreated)
* [dateModified](accesscontrollistmongo.md#datemodified)
* [parent](accesscontrollistmongo.md#optional-parent)
* [parentUid](accesscontrollistmongo.md#optional-parentuid)
* [records](accesscontrollistmongo.md#records)
* [uid](accesscontrollistmongo.md#uid)
* [version](accesscontrollistmongo.md#version)

## Constructors

###  constructor

\+ **new AccessControlListMongo**(`other?`: any): *[AccessControlListMongo](accesscontrollistmongo.md)*

*Overrides [BaseMongoEntity](basemongoentity.md).[constructor](basemongoentity.md#constructor)*

Defined in src/security/AccessControlListMongo.ts:64

**Parameters:**

Name | Type |
------ | ------ |
`other?` | any |

**Returns:** *[AccessControlListMongo](accesscontrollistmongo.md)*

## Properties

### `Optional` _id

• **_id**? : *ObjectID*

*Inherited from [BaseMongoEntity](basemongoentity.md).[_id](basemongoentity.md#optional-_id)*

Defined in src/models/BaseMongoEntity.ts:17

The internal unique identifier used by MongoDB.

___

###  dateCreated

• **dateCreated**: *Date* = new Date()

*Implementation of [AccessControlList](../interfaces/accesscontrollist.md).[dateCreated](../interfaces/accesscontrollist.md#datecreated)*

*Inherited from [BaseEntity](baseentity.md).[dateCreated](baseentity.md#datecreated)*

Defined in src/models/BaseEntity.ts:30

The date and time that the entity was created.

___

###  dateModified

• **dateModified**: *Date* = new Date()

*Implementation of [AccessControlList](../interfaces/accesscontrollist.md).[dateModified](../interfaces/accesscontrollist.md#datemodified)*

*Inherited from [BaseEntity](baseentity.md).[dateModified](baseentity.md#datemodified)*

Defined in src/models/BaseEntity.ts:36

The date and time that the entity was last modified.

___

### `Optional` parent

• **parent**? : *[AccessControlList](../interfaces/accesscontrollist.md)*

*Implementation of [AccessControlList](../interfaces/accesscontrollist.md).[parent](../interfaces/accesscontrollist.md#optional-parent)*

Defined in src/security/AccessControlListMongo.ts:57

___

### `Optional` parentUid

• **parentUid**? : *string | undefined*

*Implementation of [AccessControlList](../interfaces/accesscontrollist.md).[parentUid](../interfaces/accesscontrollist.md#optional-parentuid)*

Defined in src/security/AccessControlListMongo.ts:61

___

###  records

• **records**: *[ACLRecordMongo](aclrecordmongo.md)[]* = []

*Implementation of [AccessControlList](../interfaces/accesscontrollist.md).[records](../interfaces/accesscontrollist.md#records)*

Defined in src/security/AccessControlListMongo.ts:64

___

###  uid

• **uid**: *string* = uuid.v4()

*Implementation of [AccessControlList](../interfaces/accesscontrollist.md).[uid](../interfaces/accesscontrollist.md#uid)*

*Inherited from [BaseEntity](baseentity.md).[uid](baseentity.md#uid)*

Defined in src/models/BaseEntity.ts:24

The universally unique identifier of the entity.

___

###  version

• **version**: *number* = 0

*Implementation of [AccessControlList](../interfaces/accesscontrollist.md).[version](../interfaces/accesscontrollist.md#version)*

*Inherited from [BaseEntity](baseentity.md).[version](baseentity.md#version)*

Defined in src/models/BaseEntity.ts:42

The optimistic lock version.
