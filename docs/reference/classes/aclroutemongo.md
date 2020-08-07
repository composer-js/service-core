[@composer-js/service-core](../README.md) › [Globals](../globals.md) › [ACLRouteMongo](aclroutemongo.md)

# Class: ACLRouteMongo

## Hierarchy

* [ModelRoute](modelroute.md)‹[AccessControlListMongo](accesscontrollistmongo.md)›

  ↳ **ACLRouteMongo**

## Index

### Constructors

* [constructor](aclroutemongo.md#constructor)

### Properties

* [cacheClient](aclroutemongo.md#protected-optional-cacheclient)
* [cacheTTL](aclroutemongo.md#protected-optional-cachettl)
* [config](aclroutemongo.md#private-optional-config)
* [defaultACLUid](aclroutemongo.md#protected-defaultacluid)
* [logger](aclroutemongo.md#protected-logger)
* [repo](aclroutemongo.md#protected-optional-repo)
* [trackChanges](aclroutemongo.md#protected-trackchanges)

### Accessors

* [baseCacheKey](aclroutemongo.md#protected-basecachekey)

### Methods

* [create](aclroutemongo.md#private-create)
* [delete](aclroutemongo.md#private-delete)
* [doCount](aclroutemongo.md#protected-docount)
* [doCreate](aclroutemongo.md#protected-docreate)
* [doDelete](aclroutemongo.md#protected-dodelete)
* [doDeleteVersion](aclroutemongo.md#protected-dodeleteversion)
* [doFindAll](aclroutemongo.md#protected-dofindall)
* [doFindById](aclroutemongo.md#protected-dofindbyid)
* [doFindByIdAndVersion](aclroutemongo.md#protected-dofindbyidandversion)
* [doTruncate](aclroutemongo.md#protected-dotruncate)
* [doUpdate](aclroutemongo.md#protected-doupdate)
* [findAll](aclroutemongo.md#private-findall)
* [findById](aclroutemongo.md#private-findbyid)
* [getDefaultACL](aclroutemongo.md#protected-getdefaultacl)
* [getObj](aclroutemongo.md#protected-getobj)
* [hashQuery](aclroutemongo.md#protected-hashquery)
* [update](aclroutemongo.md#private-update)

## Constructors

###  constructor

\+ **new ACLRouteMongo**(): *[ACLRouteMongo](aclroutemongo.md)*

*Overrides [ModelRoute](modelroute.md).[constructor](modelroute.md#protected-constructor)*

Defined in src/security/ACLRouteMongo.ts:21

**Returns:** *[ACLRouteMongo](aclroutemongo.md)*

## Properties

### `Protected` `Optional` cacheClient

• **cacheClient**? : *Redis*

*Inherited from [ACLRouteMongo](aclroutemongo.md).[cacheClient](aclroutemongo.md#protected-optional-cacheclient)*

Defined in src/routes/ModelRoute.ts:33

The redis client that will be used as a 2nd level cache for all cacheable models.

___

### `Protected` `Optional` cacheTTL

• **cacheTTL**? : *undefined | number*

*Inherited from [ACLRouteMongo](aclroutemongo.md).[cacheTTL](aclroutemongo.md#protected-optional-cachettl)*

Defined in src/routes/ModelRoute.ts:36

The time, in milliseconds, that objects will be cached before being invalidated.

___

### `Private` `Optional` config

• **config**? : *any*

Defined in src/security/ACLRouteMongo.ts:18

___

### `Protected` defaultACLUid

• **defaultACLUid**: *string* = ""

*Inherited from [ACLRouteMongo](aclroutemongo.md).[defaultACLUid](aclroutemongo.md#protected-defaultacluid)*

Defined in src/routes/ModelRoute.ts:39

The unique identifier of the default ACL for the model type.

___

### `Protected` logger

• **logger**: *any*

*Inherited from [ACLRouteMongo](aclroutemongo.md).[logger](aclroutemongo.md#protected-logger)*

Defined in src/routes/ModelRoute.ts:42

___

### `Protected` `Optional` repo

• **repo**? : *Repo‹[AccessControlListMongo](accesscontrollistmongo.md)›*

*Overrides [ModelRoute](modelroute.md).[repo](modelroute.md#protected-optional-abstract-repo)*

Defined in src/security/ACLRouteMongo.ts:21

___

### `Protected` trackChanges

• **trackChanges**: *number* = 0

*Inherited from [ACLRouteMongo](aclroutemongo.md).[trackChanges](aclroutemongo.md#protected-trackchanges)*

Defined in src/routes/ModelRoute.ts:51

The number of previous document versions to store in the database. A negative value indicates storing all
versions, a value of `0` stores no versions.

## Accessors

### `Protected` baseCacheKey

• **get baseCacheKey**(): *string*

*Overrides [ModelRoute](modelroute.md).[baseCacheKey](modelroute.md#protected-basecachekey)*

Defined in src/security/ACLRouteMongo.ts:30

The base key used to get or set data in the cache.

**Returns:** *string*

## Methods

### `Private` create

▸ **create**(`obj`: [AccessControlListMongo](accesscontrollistmongo.md), `user?`: JWTUser): *Promise‹[AccessControlListMongo](accesscontrollistmongo.md)›*

Defined in src/security/ACLRouteMongo.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`obj` | [AccessControlListMongo](accesscontrollistmongo.md) |
`user?` | JWTUser |

**Returns:** *Promise‹[AccessControlListMongo](accesscontrollistmongo.md)›*

___

### `Private` delete

▸ **delete**(`id`: string, `user?`: JWTUser): *Promise‹void›*

Defined in src/security/ACLRouteMongo.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`user?` | JWTUser |

**Returns:** *Promise‹void›*

___

### `Protected` doCount

▸ **doCount**(`params`: any, `query`: any, `user?`: any): *Promise‹any›*

*Inherited from [ACLRouteMongo](aclroutemongo.md).[doCount](aclroutemongo.md#protected-docount)*

Defined in src/routes/ModelRoute.ts:177

Attempts to retrieve the number of data model objects matching the given set of criteria as specified in the
request `query`. Any results that have been found are set to the `result` property of the `res` argument.
`result` is never null.

**Parameters:**

Name | Type |
------ | ------ |
`params` | any |
`query` | any |
`user?` | any |

**Returns:** *Promise‹any›*

___

### `Protected` doCreate

▸ **doCreate**(`obj`: [AccessControlListMongo](accesscontrollistmongo.md), `user?`: any, `acl?`: [AccessControlList](../interfaces/accesscontrollist.md)): *Promise‹[AccessControlListMongo](accesscontrollistmongo.md)›*

*Inherited from [ACLRouteMongo](aclroutemongo.md).[doCreate](aclroutemongo.md#protected-docreate)*

Defined in src/routes/ModelRoute.ts:199

Attempts to store the object provided in `req.body` into the datastore. Upon success, sets the newly persisted
object to the `result` property of the `res` argument, otherwise sends a `400 BAD REQUEST` response to the
client.

**Parameters:**

Name | Type |
------ | ------ |
`obj` | [AccessControlListMongo](accesscontrollistmongo.md) |
`user?` | any |
`acl?` | [AccessControlList](../interfaces/accesscontrollist.md) |

**Returns:** *Promise‹[AccessControlListMongo](accesscontrollistmongo.md)›*

___

### `Protected` doDelete

▸ **doDelete**(`id`: string, `user?`: any): *Promise‹void›*

*Inherited from [ACLRouteMongo](aclroutemongo.md).[doDelete](aclroutemongo.md#protected-dodelete)*

Defined in src/routes/ModelRoute.ts:260

Attempts to delete an existing data model object with a given unique identifier encoded by the URI parameter
`id`.

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`user?` | any |

**Returns:** *Promise‹void›*

___

### `Protected` doDeleteVersion

▸ **doDeleteVersion**(`id`: string, `version`: number, `user?`: any): *Promise‹void›*

*Inherited from [ACLRouteMongo](aclroutemongo.md).[doDeleteVersion](aclroutemongo.md#protected-dodeleteversion)*

Defined in src/routes/ModelRoute.ts:304

Attempts to delete an existing data model object with a given unique identifier encoded by the URI parameter
`id` for a specified `version`.

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`version` | number |
`user?` | any |

**Returns:** *Promise‹void›*

___

### `Protected` doFindAll

▸ **doFindAll**(`params`: any, `query`: any, `user?`: any): *Promise‹[AccessControlListMongo](accesscontrollistmongo.md)[]›*

*Inherited from [ACLRouteMongo](aclroutemongo.md).[doFindAll](aclroutemongo.md#protected-dofindall)*

Defined in src/routes/ModelRoute.ts:349

Attempts to retrieve all data model objects matching the given set of criteria as specified in the request
`query`. Any results that have been found are set to the `result` property of the `res` argument. `result` is
never null.

**Parameters:**

Name | Type |
------ | ------ |
`params` | any |
`query` | any |
`user?` | any |

**Returns:** *Promise‹[AccessControlListMongo](accesscontrollistmongo.md)[]›*

___

### `Protected` doFindById

▸ **doFindById**(`id`: string, `user?`: any): *Promise‹[AccessControlListMongo](accesscontrollistmongo.md) | undefined›*

*Inherited from [ACLRouteMongo](aclroutemongo.md).[doFindById](aclroutemongo.md#protected-dofindbyid)*

Defined in src/routes/ModelRoute.ts:416

Attempts to retrieve a single data model object as identified by the `id` parameter in the URI.

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`user?` | any |

**Returns:** *Promise‹[AccessControlListMongo](accesscontrollistmongo.md) | undefined›*

___

### `Protected` doFindByIdAndVersion

▸ **doFindByIdAndVersion**(`id`: string, `version`: number, `user?`: any): *Promise‹[AccessControlListMongo](accesscontrollistmongo.md) | undefined›*

*Inherited from [ACLRouteMongo](aclroutemongo.md).[doFindByIdAndVersion](aclroutemongo.md#protected-dofindbyidandversion)*

Defined in src/routes/ModelRoute.ts:452

Attempts to retrieve a single data model object as identified by the `id` and `version` parameters in the URI.

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`version` | number |
`user?` | any |

**Returns:** *Promise‹[AccessControlListMongo](accesscontrollistmongo.md) | undefined›*

___

### `Protected` doTruncate

▸ **doTruncate**(`user?`: any): *Promise‹void›*

*Inherited from [ACLRouteMongo](aclroutemongo.md).[doTruncate](aclroutemongo.md#protected-dotruncate)*

Defined in src/routes/ModelRoute.ts:490

Attempts to remove all entries of the data model type from the datastore.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`user?` | any | The authenticated user performing the action, otherwise undefined.  |

**Returns:** *Promise‹void›*

___

### `Protected` doUpdate

▸ **doUpdate**(`id`: string, `obj`: [AccessControlListMongo](accesscontrollistmongo.md), `user?`: any): *Promise‹[AccessControlListMongo](accesscontrollistmongo.md)›*

*Inherited from [ACLRouteMongo](aclroutemongo.md).[doUpdate](aclroutemongo.md#protected-doupdate)*

Defined in src/routes/ModelRoute.ts:518

Attempts to modify an existing data model object as identified by the `id` parameter in the URI.

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`obj` | [AccessControlListMongo](accesscontrollistmongo.md) |
`user?` | any |

**Returns:** *Promise‹[AccessControlListMongo](accesscontrollistmongo.md)›*

___

### `Private` findAll

▸ **findAll**(`params`: any, `query`: any, `user?`: JWTUser): *Promise‹[AccessControlListMongo](accesscontrollistmongo.md)[]›*

Defined in src/security/ACLRouteMongo.ts:73

**Parameters:**

Name | Type |
------ | ------ |
`params` | any |
`query` | any |
`user?` | JWTUser |

**Returns:** *Promise‹[AccessControlListMongo](accesscontrollistmongo.md)[]›*

___

### `Private` findById

▸ **findById**(`id`: string, `user?`: any): *Promise‹[AccessControlListMongo](accesscontrollistmongo.md) | undefined›*

Defined in src/security/ACLRouteMongo.ts:88

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`user?` | any |

**Returns:** *Promise‹[AccessControlListMongo](accesscontrollistmongo.md) | undefined›*

___

### `Protected` getDefaultACL

▸ **getDefaultACL**(): *[AccessControlList](../interfaces/accesscontrollist.md) | undefined*

*Overrides [ModelRoute](modelroute.md).[getDefaultACL](modelroute.md#protected-abstract-getdefaultacl)*

Defined in src/security/ACLRouteMongo.ts:34

**Returns:** *[AccessControlList](../interfaces/accesscontrollist.md) | undefined*

___

### `Protected` getObj

▸ **getObj**(`id`: string, `version?`: undefined | number): *Promise‹[AccessControlListMongo](accesscontrollistmongo.md) | undefined›*

*Inherited from [ACLRouteMongo](aclroutemongo.md).[getObj](aclroutemongo.md#protected-getobj)*

Defined in src/routes/ModelRoute.ts:129

Retrieves the object with the given id from either the cache or the database. If retrieving from the database
the cache is populated to speed up subsequent requests.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | string | The unique identifier of the object to retrieve. |
`version?` | undefined &#124; number | The desired version number of the object to retrieve. If `undefined` returns the latest.  |

**Returns:** *Promise‹[AccessControlListMongo](accesscontrollistmongo.md) | undefined›*

___

### `Protected` hashQuery

▸ **hashQuery**(`query`: any): *string*

*Inherited from [ACLRouteMongo](aclroutemongo.md).[hashQuery](aclroutemongo.md#protected-hashquery)*

Defined in src/routes/ModelRoute.ts:76

Hashes the given query object to a unique string.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`query` | any | The query object to hash.  |

**Returns:** *string*

___

### `Private` update

▸ **update**(`id`: string, `obj`: [AccessControlListMongo](accesscontrollistmongo.md), `user?`: JWTUser): *Promise‹[AccessControlListMongo](accesscontrollistmongo.md)›*

Defined in src/security/ACLRouteMongo.ts:103

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`obj` | [AccessControlListMongo](accesscontrollistmongo.md) |
`user?` | JWTUser |

**Returns:** *Promise‹[AccessControlListMongo](accesscontrollistmongo.md)›*
