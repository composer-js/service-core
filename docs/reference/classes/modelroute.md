[@composer-js/service-core](../README.md) › [Globals](../globals.md) › [ModelRoute](modelroute.md)

# Class: ModelRoute <**T**>

The `ModelRoute` is an abstract base class that provides a set of built-in route behavior functions for handling
requests for a given data model that is managed by a persistent datastore.

Provided behaviors:
* `count` - Counts the number of objects matching the provided set of criteria in the request's query parameters.
* `create` - Adds a new object to the datastore.
* `delete` - Removes an existing object from the datastore.
* `find` - Finds all objects matching the provided set of criteria in the request's query parameters.
* `findById` - Finds a single object with a specified unique identifier.
* `truncate` - Removes all objects from the datastore.
* `update` - Modifies an existing object in the datastore.

**`author`** Jean-Philippe Steinmetz

## Type parameters

▪ **T**: *[BaseEntity](baseentity.md) | SimpleEntity*

## Hierarchy

* **ModelRoute**

  ↳ [ACLRouteMongo](aclroutemongo.md)

  ↳ [ACLRouteSQL](aclroutesql.md)

## Index

### Constructors

* [constructor](modelroute.md#protected-constructor)

### Properties

* [cacheClient](modelroute.md#protected-optional-cacheclient)
* [cacheTTL](modelroute.md#protected-optional-cachettl)
* [defaultACLUid](modelroute.md#protected-defaultacluid)
* [logger](modelroute.md#protected-logger)
* [repo](modelroute.md#protected-optional-abstract-repo)
* [trackChanges](modelroute.md#protected-trackchanges)

### Accessors

* [baseCacheKey](modelroute.md#protected-basecachekey)

### Methods

* [doCount](modelroute.md#protected-docount)
* [doCreate](modelroute.md#protected-docreate)
* [doDelete](modelroute.md#protected-dodelete)
* [doDeleteVersion](modelroute.md#protected-dodeleteversion)
* [doFindAll](modelroute.md#protected-dofindall)
* [doFindById](modelroute.md#protected-dofindbyid)
* [doFindByIdAndVersion](modelroute.md#protected-dofindbyidandversion)
* [doTruncate](modelroute.md#protected-dotruncate)
* [doUpdate](modelroute.md#protected-doupdate)
* [getDefaultACL](modelroute.md#protected-abstract-getdefaultacl)
* [getObj](modelroute.md#protected-getobj)
* [hashQuery](modelroute.md#protected-hashquery)
* [searchIdQuery](modelroute.md#private-searchidquery)
* [superInitialize](modelroute.md#private-superinitialize)

## Constructors

### `Protected` constructor

\+ **new ModelRoute**(): *[ModelRoute](modelroute.md)*

Defined in src/routes/ModelRoute.ts:51

Initializes a new instance using any defaults.

**Returns:** *[ModelRoute](modelroute.md)*

## Properties

### `Protected` `Optional` cacheClient

• **cacheClient**? : *Redis*

Defined in src/routes/ModelRoute.ts:33

The redis client that will be used as a 2nd level cache for all cacheable models.

___

### `Protected` `Optional` cacheTTL

• **cacheTTL**? : *undefined | number*

Defined in src/routes/ModelRoute.ts:36

The time, in milliseconds, that objects will be cached before being invalidated.

___

### `Protected` defaultACLUid

• **defaultACLUid**: *string* = ""

Defined in src/routes/ModelRoute.ts:39

The unique identifier of the default ACL for the model type.

___

### `Protected` logger

• **logger**: *any*

Defined in src/routes/ModelRoute.ts:42

___

### `Protected` `Optional` `Abstract` repo

• **repo**? : *Repository‹T› | MongoRepository‹T›*

Defined in src/routes/ModelRoute.ts:45

The model class associated with the controller to perform operations against.

___

### `Protected` trackChanges

• **trackChanges**: *number* = 0

Defined in src/routes/ModelRoute.ts:51

The number of previous document versions to store in the database. A negative value indicates storing all
versions, a value of `0` stores no versions.

## Accessors

### `Protected` baseCacheKey

• **get baseCacheKey**(): *string*

Defined in src/routes/ModelRoute.ts:61

The base key used to get or set data in the cache.

**Returns:** *string*

## Methods

### `Protected` doCount

▸ **doCount**(`params`: any, `query`: any, `user?`: any): *Promise‹any›*

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

▸ **doCreate**(`obj`: T, `user?`: any, `acl?`: [AccessControlList](../interfaces/accesscontrollist.md)): *Promise‹T›*

Defined in src/routes/ModelRoute.ts:199

Attempts to store the object provided in `req.body` into the datastore. Upon success, sets the newly persisted
object to the `result` property of the `res` argument, otherwise sends a `400 BAD REQUEST` response to the
client.

**Parameters:**

Name | Type |
------ | ------ |
`obj` | T |
`user?` | any |
`acl?` | [AccessControlList](../interfaces/accesscontrollist.md) |

**Returns:** *Promise‹T›*

___

### `Protected` doDelete

▸ **doDelete**(`id`: string, `user?`: any): *Promise‹void›*

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

▸ **doFindAll**(`params`: any, `query`: any, `user?`: any): *Promise‹T[]›*

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

**Returns:** *Promise‹T[]›*

___

### `Protected` doFindById

▸ **doFindById**(`id`: string, `user?`: any): *Promise‹T | undefined›*

Defined in src/routes/ModelRoute.ts:416

Attempts to retrieve a single data model object as identified by the `id` parameter in the URI.

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`user?` | any |

**Returns:** *Promise‹T | undefined›*

___

### `Protected` doFindByIdAndVersion

▸ **doFindByIdAndVersion**(`id`: string, `version`: number, `user?`: any): *Promise‹T | undefined›*

Defined in src/routes/ModelRoute.ts:452

Attempts to retrieve a single data model object as identified by the `id` and `version` parameters in the URI.

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`version` | number |
`user?` | any |

**Returns:** *Promise‹T | undefined›*

___

### `Protected` doTruncate

▸ **doTruncate**(`user?`: any): *Promise‹void›*

Defined in src/routes/ModelRoute.ts:490

Attempts to remove all entries of the data model type from the datastore.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`user?` | any | The authenticated user performing the action, otherwise undefined.  |

**Returns:** *Promise‹void›*

___

### `Protected` doUpdate

▸ **doUpdate**(`id`: string, `obj`: T, `user?`: any): *Promise‹T›*

Defined in src/routes/ModelRoute.ts:518

Attempts to modify an existing data model object as identified by the `id` parameter in the URI.

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`obj` | T |
`user?` | any |

**Returns:** *Promise‹T›*

___

### `Protected` `Abstract` getDefaultACL

▸ **getDefaultACL**(): *[AccessControlList](../interfaces/accesscontrollist.md) | undefined*

Defined in src/routes/ModelRoute.ts:70

Returns the default access control list governing the model type. Returning a value of `undefined` will grant
full acccess to any user (including unauthenticated anonymous users).

**Returns:** *[AccessControlList](../interfaces/accesscontrollist.md) | undefined*

___

### `Protected` getObj

▸ **getObj**(`id`: string, `version?`: undefined | number): *Promise‹T | undefined›*

Defined in src/routes/ModelRoute.ts:129

Retrieves the object with the given id from either the cache or the database. If retrieving from the database
the cache is populated to speed up subsequent requests.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | string | The unique identifier of the object to retrieve. |
`version?` | undefined &#124; number | The desired version number of the object to retrieve. If `undefined` returns the latest.  |

**Returns:** *Promise‹T | undefined›*

___

### `Protected` hashQuery

▸ **hashQuery**(`query`: any): *string*

Defined in src/routes/ModelRoute.ts:76

Hashes the given query object to a unique string.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`query` | any | The query object to hash.  |

**Returns:** *string*

___

### `Private` searchIdQuery

▸ **searchIdQuery**(`id`: string, `version?`: undefined | number): *any*

Defined in src/routes/ModelRoute.ts:167

Search for existing object based on passed in id and version

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`version?` | undefined &#124; number |

**Returns:** *any*

___

### `Private` superInitialize

▸ **superInitialize**(): *Promise‹void›*

Defined in src/routes/ModelRoute.ts:87

Called on server startup to initialize the route with any defaults.

**Returns:** *Promise‹void›*
