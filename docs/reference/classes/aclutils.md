[@composer-js/service-core](../README.md) › [Globals](../globals.md) › [ACLUtils](aclutils.md)

# Class: ACLUtils

Common utility functions for working with `AccessControlList` objects and validating user permissions.

## Hierarchy

* **ACLUtils**

## Index

### Properties

* [cacheClient](aclutils.md#private-optional-cacheclient)
* [cacheTTL](aclutils.md#private-cachettl)
* [config](aclutils.md#private-config)
* [repo](aclutils.md#private-optional-repo)

### Methods

* [checkRequestPerms](aclutils.md#checkrequestperms)
* [findACL](aclutils.md#findacl)
* [getRecord](aclutils.md#getrecord)
* [hasPermission](aclutils.md#haspermission)
* [init](aclutils.md#init)
* [populateParent](aclutils.md#populateparent)
* [removeACL](aclutils.md#removeacl)
* [saveACL](aclutils.md#saveacl)
* [userMatchesId](aclutils.md#private-usermatchesid)

## Properties

### `Private` `Optional` cacheClient

• **cacheClient**? : *Redis*

Defined in src/security/ACLUtils.ts:20

___

### `Private` cacheTTL

• **cacheTTL**: *number* = 30

Defined in src/security/ACLUtils.ts:21

___

### `Private` config

• **config**: *any*

Defined in src/security/ACLUtils.ts:22

___

### `Private` `Optional` repo

• **repo**? : *Repository‹[AccessControlListSQL](accesscontrollistsql.md)› | MongoRepository‹[AccessControlListMongo](accesscontrollistmongo.md)›*

Defined in src/security/ACLUtils.ts:23

## Methods

###  checkRequestPerms

▸ **checkRequestPerms**(`user`: JWTUser | undefined, `req`: Request): *Promise‹boolean›*

Defined in src/security/ACLUtils.ts:82

Validates that the user has permission to perform the request operation against the URL path for the
provided request. If ACLUtils has not been initialized or the `acl` datastore has not been configured
then always returns `true`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`user` | JWTUser &#124; undefined | The user to validate. |
`req` | Request | The request whose URL path and method will be verified.  |

**Returns:** *Promise‹boolean›*

___

###  findACL

▸ **findACL**(`entityId`: string): *Promise‹[AccessControlList](../interfaces/accesscontrollist.md) | undefined›*

Defined in src/security/ACLUtils.ts:251

Retrieves the access control list with the associated identifier and populates the parent(s).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`entityId` | string | The unique identifier of the ACL to retrieve.  |

**Returns:** *Promise‹[AccessControlList](../interfaces/accesscontrollist.md) | undefined›*

___

###  getRecord

▸ **getRecord**(`acl`: [AccessControlList](../interfaces/accesscontrollist.md), `user`: JWTUser | undefined): *[ACLRecord](../interfaces/aclrecord.md) | undefined*

Defined in src/security/ACLUtils.ts:350

Retrieves the first available record in the provided ACL associated with the provided user.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`acl` | [AccessControlList](../interfaces/accesscontrollist.md) | The access control list that will be searched. |
`user` | JWTUser &#124; undefined | The user to find a record for. |

**Returns:** *[ACLRecord](../interfaces/aclrecord.md) | undefined*

The ACL record associated with the given user if found, otherwise `undefined`.

___

###  hasPermission

▸ **hasPermission**(`user`: JWTUser | undefined, `acl`: [AccessControlList](../interfaces/accesscontrollist.md) | string, `action`: [ACLAction](../enums/aclaction.md)): *Promise‹boolean›*

Defined in src/security/ACLUtils.ts:178

Validates that the user has permission to perform the provided action using the given access control list.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`user` | JWTUser &#124; undefined | The user to validate permissions of. |
`acl` | [AccessControlList](../interfaces/accesscontrollist.md) &#124; string | The ACL or uid of an ACL to validate permissions against. |
`action` | [ACLAction](../enums/aclaction.md) | The action that the user desires permission for. |

**Returns:** *Promise‹boolean›*

`true` if the user has at least one of the permissions granted for the given entity, otherwise `false`.

___

###  init

▸ **init**(`config`: any): *void*

Defined in src/security/ACLUtils.ts:28

Initializes the utility with the provided defaults.

**Parameters:**

Name | Type |
------ | ------ |
`config` | any |

**Returns:** *void*

___

###  populateParent

▸ **populateParent**(`acl`: [AccessControlList](../interfaces/accesscontrollist.md)): *Promise‹void›*

Defined in src/security/ACLUtils.ts:365

Attempts to retrieve the parent access control list for the given ACL object.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`acl` | [AccessControlList](../interfaces/accesscontrollist.md) | The access control list whose parents will be populated.  |

**Returns:** *Promise‹void›*

___

###  removeACL

▸ **removeACL**(`uid`: string): *Promise‹void›*

Defined in src/security/ACLUtils.ts:297

Deletes the ACL with the given identifier from the database.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`uid` | string | The unique identifier of the ACL to remove.  |

**Returns:** *Promise‹void›*

___

###  saveACL

▸ **saveACL**(`acl`: [AccessControlList](../interfaces/accesscontrollist.md)): *Promise‹[AccessControlList](../interfaces/accesscontrollist.md) | undefined›*

Defined in src/security/ACLUtils.ts:315

Stores the given access control list into the ACL database.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`acl` | [AccessControlList](../interfaces/accesscontrollist.md) | The ACL to store. |

**Returns:** *Promise‹[AccessControlList](../interfaces/accesscontrollist.md) | undefined›*

Returns the ACL that was stored in the database.

___

### `Private` userMatchesId

▸ **userMatchesId**(`user`: JWTUser | undefined, `userOrRoleId`: string): *boolean*

Defined in src/security/ACLUtils.ts:53

Checks to see if the provided user matches the providedUserOrRoleId.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`user` | JWTUser &#124; undefined | The user to check. |
`userOrRoleId` | string | The ACL record id to check against. |

**Returns:** *boolean*

`true` if the user contains a `uid` or `role` that matches the `userOrRoleId`, otherwise `false`.
