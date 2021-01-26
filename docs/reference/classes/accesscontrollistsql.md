**[@composer-js/service-core](../README.md)**

> [Globals](../globals.md) / AccessControlListSQL

# Class: AccessControlListSQL

Implementation of the `AccessControlList` interface for use with SQL databases.

## Hierarchy

* [BaseEntity](baseentity.md)

  ↳ **AccessControlListSQL**

## Implements

* [AccessControlList](../interfaces/accesscontrollist.md)

## Index

### Constructors

* [constructor](accesscontrollistsql.md#constructor)

### Properties

* [dateCreated](accesscontrollistsql.md#datecreated)
* [dateModified](accesscontrollistsql.md#datemodified)
* [parent](accesscontrollistsql.md#parent)
* [parentUid](accesscontrollistsql.md#parentuid)
* [records](accesscontrollistsql.md#records)
* [uid](accesscontrollistsql.md#uid)
* [version](accesscontrollistsql.md#version)

## Constructors

### constructor

\+ **new AccessControlListSQL**(`other?`: any): [AccessControlListSQL](accesscontrollistsql.md)

*Overrides [BaseEntity](baseentity.md).[constructor](baseentity.md#constructor)*

*Defined in src/security/AccessControlListSQL.ts:65*

#### Parameters:

Name | Type |
------ | ------ |
`other?` | any |

**Returns:** [AccessControlListSQL](accesscontrollistsql.md)

## Properties

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

*Defined in src/security/AccessControlListSQL.ts:58*

___

### parentUid

• `Optional` **parentUid**: string \| undefined

*Implementation of [AccessControlList](../interfaces/accesscontrollist.md).[parentUid](../interfaces/accesscontrollist.md#parentuid)*

*Defined in src/security/AccessControlListSQL.ts:62*

___

### records

•  **records**: [ACLRecordSQL](aclrecordsql.md)[] = []

*Implementation of [AccessControlList](../interfaces/accesscontrollist.md).[records](../interfaces/accesscontrollist.md#records)*

*Defined in src/security/AccessControlListSQL.ts:65*

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
