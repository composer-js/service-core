**[@composer-js/service-core](../README.md)**

> [Globals](../globals.md) / ACLRecordMongo

# Class: ACLRecordMongo

Implementation of the `ACLRecord` interface for use with MongoDB databases.

## Hierarchy

* **ACLRecordMongo**

## Implements

* [ACLRecord](../interfaces/aclrecord.md)

## Index

### Constructors

* [constructor](aclrecordmongo.md#constructor)

### Properties

* [create](aclrecordmongo.md#create)
* [delete](aclrecordmongo.md#delete)
* [full](aclrecordmongo.md#full)
* [read](aclrecordmongo.md#read)
* [special](aclrecordmongo.md#special)
* [update](aclrecordmongo.md#update)
* [userOrRoleId](aclrecordmongo.md#userorroleid)

## Constructors

### constructor

\+ **new ACLRecordMongo**(`other?`: any): [ACLRecordMongo](aclrecordmongo.md)

*Defined in src/security/AccessControlListMongo.ts:34*

#### Parameters:

Name | Type |
------ | ------ |
`other?` | any |

**Returns:** [ACLRecordMongo](aclrecordmongo.md)

## Properties

### create

•  **create**: boolean \| null

*Implementation of [ACLRecord](../interfaces/aclrecord.md).[create](../interfaces/aclrecord.md#create)*

*Defined in src/security/AccessControlListMongo.ts:19*

___

### delete

•  **delete**: boolean \| null

*Implementation of [ACLRecord](../interfaces/aclrecord.md).[delete](../interfaces/aclrecord.md#delete)*

*Defined in src/security/AccessControlListMongo.ts:28*

___

### full

•  **full**: boolean \| null

*Implementation of [ACLRecord](../interfaces/aclrecord.md).[full](../interfaces/aclrecord.md#full)*

*Defined in src/security/AccessControlListMongo.ts:34*

___

### read

•  **read**: boolean \| null

*Implementation of [ACLRecord](../interfaces/aclrecord.md).[read](../interfaces/aclrecord.md#read)*

*Defined in src/security/AccessControlListMongo.ts:22*

___

### special

•  **special**: boolean \| null

*Implementation of [ACLRecord](../interfaces/aclrecord.md).[special](../interfaces/aclrecord.md#special)*

*Defined in src/security/AccessControlListMongo.ts:31*

___

### update

•  **update**: boolean \| null

*Implementation of [ACLRecord](../interfaces/aclrecord.md).[update](../interfaces/aclrecord.md#update)*

*Defined in src/security/AccessControlListMongo.ts:25*

___

### userOrRoleId

•  **userOrRoleId**: string

*Implementation of [ACLRecord](../interfaces/aclrecord.md).[userOrRoleId](../interfaces/aclrecord.md#userorroleid)*

*Defined in src/security/AccessControlListMongo.ts:16*
