**[@composer-js/service-core](../README.md)**

> [Globals](../globals.md) / ACLRecord

# Interface: ACLRecord

The `ACLRecord` interface describes a single permissions entry in an `AccessControlList` that grants or denies
a set of permissions to a single user or role.

Each permission can be one of the following actions:
- `Create` - The user or role can create a new record or object.
- `Read` - The user or role can read the record or object.
- `Update` - The user or role can modify existing records or objects.
- `Delete` - The user or role can delete existing records or objects.
- `Special` - The user or role has special prilieges to edit the ACL permissions.
- `Full` - The user or role has total control over the record or object and supersedes any of the above.

**`author`** Jean-Philippe Steinmetz <info@acceleratxr.com>

## Hierarchy

* **ACLRecord**

## Implemented by

* [ACLRecordMongo](../classes/aclrecordmongo.md)
* [ACLRecordSQL](../classes/aclrecordsql.md)

## Index

### Properties

* [create](aclrecord.md#create)
* [delete](aclrecord.md#delete)
* [full](aclrecord.md#full)
* [read](aclrecord.md#read)
* [special](aclrecord.md#special)
* [update](aclrecord.md#update)
* [userOrRoleId](aclrecord.md#userorroleid)

## Properties

### create

•  **create**: boolean \| null

*Defined in src/security/AccessControlList.ts:42*

Indicates that the user or role has permission to create new records of the entity.

___

### delete

•  **delete**: boolean \| null

*Defined in src/security/AccessControlList.ts:57*

Indicates that the user or role has permission to delete existing records of the entity.

___

### full

•  **full**: boolean \| null

*Defined in src/security/AccessControlList.ts:69*

Indicates that the user or role has total control over records of the entity. This supersedes all of the above
permissions.

___

### read

•  **read**: boolean \| null

*Defined in src/security/AccessControlList.ts:47*

Indicates that the user or role has permission to read records of the entity.

___

### special

•  **special**: boolean \| null

*Defined in src/security/AccessControlList.ts:63*

Indicates that the user or role has special permission over records of the entity. The exact meaning of this
may vary by service.

___

### update

•  **update**: boolean \| null

*Defined in src/security/AccessControlList.ts:52*

Indicates that the user or role has permission to modify existing records of the entity.

___

### userOrRoleId

•  **userOrRoleId**: string

*Defined in src/security/AccessControlList.ts:37*

The unique identifier of the user or role that the record belongs to.
