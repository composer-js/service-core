[@composer-js/service-core](../README.md) › [Globals](../globals.md) › [AccessControlList](accesscontrollist.md)

# Interface: AccessControlList

The access control list provides a generic interface for the storage of user and roles permissions. Each ACL object
represents the permission set for a single entity within the system. The entity is identified generically by its
universally unique identifier (`uuid`). Each entry in the ACL records the permissions available to a particular user
or role.

Each permission can be one of the following actions:
- `Create` - The user or role can create a new record or object.
- `Read` - The user or role can read the record or object.
- `Update` - The user or role can modify existing records or objects.
- `Delete` - The user or role can delete existing records or objects.
- `Special` - The user or role has special prilieges to edit the ACL permissions.
- `Full` - The user or role has total control over the record or object and supersedes any of the above.

For each of the above actions the user or role will be granted either an `allow` permission or a `deny` permission.
If an `allow` is granted, the user or role has permission to perform that action. If a `deny` is set, then the user
or role is denied that action. If no explicit `allow` or `deny` is set then the user or role will inherit the
permission from a parent role or ACL.

ACLs can be chained via single inheritance through the specification of the `parentUid`. This allows the ability to
create complex trees of permissions that can easily inherit control schemes to make the definition of permissions
easier.

**`author`** Jean-Philippe Steinmetz <info@acceleratxr.com>

## Hierarchy

* **AccessControlList**

## Implemented by

* [AccessControlListMongo](../classes/accesscontrollistmongo.md)
* [AccessControlListSQL](../classes/accesscontrollistsql.md)

## Index

### Properties

* [dateCreated](accesscontrollist.md#datecreated)
* [dateModified](accesscontrollist.md#datemodified)
* [parent](accesscontrollist.md#optional-parent)
* [parentUid](accesscontrollist.md#optional-parentuid)
* [records](accesscontrollist.md#records)
* [uid](accesscontrollist.md#uid)
* [version](accesscontrollist.md#version)

## Properties

###  dateCreated

• **dateCreated**: *Date*

Defined in src/security/AccessControlList.ts:106

The date and time that the entity was created.

___

###  dateModified

• **dateModified**: *Date*

Defined in src/security/AccessControlList.ts:111

The date and time that the entity was last modified.

___

### `Optional` parent

• **parent**? : *[AccessControlList](accesscontrollist.md)*

Defined in src/security/AccessControlList.ts:121

The parent access control list that this instance inherits permissions from.

___

### `Optional` parentUid

• **parentUid**? : *undefined | string*

Defined in src/security/AccessControlList.ts:127

The universally unique identifier of the parent `AccessControlList` that this object will inherit permissions
from.

___

###  records

• **records**: *[ACLRecord](aclrecord.md)[]*

Defined in src/security/AccessControlList.ts:132

The list of all permission records associated with this access control list.

___

###  uid

• **uid**: *string*

Defined in src/security/AccessControlList.ts:101

The universally unique identifier (`uuid`) of the entity that the access control list belongs to.

___

###  version

• **version**: *number*

Defined in src/security/AccessControlList.ts:116

The optimistic lock version.
