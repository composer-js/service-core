**[@composer-js/service-core](../README.md)**

> [Globals](../globals.md) / ModelRoute

# Class: ModelRoute\<T>

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

Name | Type |
------ | ------ |
`T` | [BaseEntity](baseentity.md) \| SimpleEntity |

## Hierarchy

* **ModelRoute**

  ↳ [ACLRouteMongo](aclroutemongo.md)

  ↳ [ACLRouteSQL](aclroutesql.md)

## Index

### Constructors

* [constructor](modelroute.md#constructor)

### Properties

* [cacheClient](modelroute.md#cacheclient)
* [cacheTTL](modelroute.md#cachettl)
* [defaultACLUid](modelroute.md#defaultacluid)
* [logger](modelroute.md#logger)
* [repo](modelroute.md#repo)
* [trackChanges](modelroute.md#trackchanges)

### Accessors

* [baseCacheKey](modelroute.md#basecachekey)
* [modelClass](modelroute.md#modelclass)

### Methods

* [doCount](modelroute.md#docount)
* [doCreate](modelroute.md#docreate)
* [doDelete](modelroute.md#dodelete)
* [doDeleteVersion](modelroute.md#dodeleteversion)
* [doFindAll](modelroute.md#dofindall)
* [doFindById](modelroute.md#dofindbyid)
* [doFindByIdAndVersion](modelroute.md#dofindbyidandversion)
* [doTruncate](modelroute.md#dotruncate)
* [doUpdate](modelroute.md#doupdate)
* [getDefaultACL](modelroute.md#getdefaultacl)
* [getObj](modelroute.md#getobj)
* [hashQuery](modelroute.md#hashquery)
* [searchIdQuery](modelroute.md#searchidquery)
* [superInitialize](modelroute.md#superinitialize)

## Constructors

### constructor

\+ `Protected`**new ModelRoute**(): [ModelRoute](modelroute.md)

*Defined in src/routes/ModelRoute.ts:51*

Initializes a new instance using any defaults.

**Returns:** [ModelRoute](modelroute.md)

## Properties

### cacheClient

• `Protected` `Optional` **cacheClient**: Redis

*Defined in src/routes/ModelRoute.ts:33*

The redis client that will be used as a 2nd level cache for all cacheable models.

___

### cacheTTL

• `Protected` `Optional` **cacheTTL**: undefined \| number

*Defined in src/routes/ModelRoute.ts:36*

The time, in milliseconds, that objects will be cached before being invalidated.

___

### defaultACLUid

• `Protected` **defaultACLUid**: string = ""

*Defined in src/routes/ModelRoute.ts:39*

The unique identifier of the default ACL for the model type.

___

### logger

• `Protected` **logger**: any

*Defined in src/routes/ModelRoute.ts:42*

___

### repo

• `Protected` `Optional` `Abstract` **repo**: Repository\<T> \| MongoRepository\<T>

*Defined in src/routes/ModelRoute.ts:45*

The model class associated with the controller to perform operations against.

___

### trackChanges

• `Protected` **trackChanges**: number = 0

*Defined in src/routes/ModelRoute.ts:51*

The number of previous document versions to store in the database. A negative value indicates storing all
versions, a value of `0` stores no versions.

## Accessors

### baseCacheKey

• `Protected`get **baseCacheKey**(): string

*Defined in src/routes/ModelRoute.ts:61*

The base key used to get or set data in the cache.

**Returns:** string

___

### modelClass

• `Protected`get **modelClass**(): any

*Defined in src/routes/ModelRoute.ts:69*

The class type of the model this route is associated with.

**Returns:** any

## Methods

### doCount

▸ `Protected`**doCount**(`params`: any, `query`: any, `user?`: any): Promise\<any>

*Defined in src/routes/ModelRoute.ts:199*

Attempts to retrieve the number of data model objects matching the given set of criteria as specified in the
request `query`. Any results that have been found are set to the `result` property of the `res` argument.
`result` is never null.

#### Parameters:

Name | Type |
------ | ------ |
`params` | any |
`query` | any |
`user?` | any |

**Returns:** Promise\<any>

___

### doCreate

▸ `Protected`**doCreate**(`obj`: T, `user?`: any, `acl?`: [AccessControlList](../interfaces/accesscontrollist.md)): Promise\<T>

*Defined in src/routes/ModelRoute.ts:226*

Attempts to store the object provided in `req.body` into the datastore. Upon success, sets the newly persisted
object to the `result` property of the `res` argument, otherwise sends a `400 BAD REQUEST` response to the
client.

#### Parameters:

Name | Type |
------ | ------ |
`obj` | T |
`user?` | any |
`acl?` | [AccessControlList](../interfaces/accesscontrollist.md) |

**Returns:** Promise\<T>

___

### doDelete

▸ `Protected`**doDelete**(`id`: string, `user?`: any): Promise\<void>

*Defined in src/routes/ModelRoute.ts:290*

Attempts to delete an existing data model object with a given unique identifier encoded by the URI parameter
`id`.

#### Parameters:

Name | Type |
------ | ------ |
`id` | string |
`user?` | any |

**Returns:** Promise\<void>

___

### doDeleteVersion

▸ `Protected`**doDeleteVersion**(`id`: string, `version`: number, `user?`: any): Promise\<void>

*Defined in src/routes/ModelRoute.ts:334*

Attempts to delete an existing data model object with a given unique identifier encoded by the URI parameter
`id` for a specified `version`.

#### Parameters:

Name | Type |
------ | ------ |
`id` | string |
`version` | number |
`user?` | any |

**Returns:** Promise\<void>

___

### doFindAll

▸ `Protected`**doFindAll**(`params`: any, `query`: any, `user?`: any): Promise\<T[]>

*Defined in src/routes/ModelRoute.ts:379*

Attempts to retrieve all data model objects matching the given set of criteria as specified in the request
`query`. Any results that have been found are set to the `result` property of the `res` argument. `result` is
never null.

#### Parameters:

Name | Type |
------ | ------ |
`params` | any |
`query` | any |
`user?` | any |

**Returns:** Promise\<T[]>

___

### doFindById

▸ `Protected`**doFindById**(`id`: string, `user?`: any): Promise\<T \| undefined>

*Defined in src/routes/ModelRoute.ts:448*

Attempts to retrieve a single data model object as identified by the `id` parameter in the URI.

#### Parameters:

Name | Type |
------ | ------ |
`id` | string |
`user?` | any |

**Returns:** Promise\<T \| undefined>

___

### doFindByIdAndVersion

▸ `Protected`**doFindByIdAndVersion**(`id`: string, `version`: number, `user?`: any): Promise\<T \| undefined>

*Defined in src/routes/ModelRoute.ts:484*

Attempts to retrieve a single data model object as identified by the `id` and `version` parameters in the URI.

#### Parameters:

Name | Type |
------ | ------ |
`id` | string |
`version` | number |
`user?` | any |

**Returns:** Promise\<T \| undefined>

___

### doTruncate

▸ `Protected`**doTruncate**(`user?`: any): Promise\<void>

*Defined in src/routes/ModelRoute.ts:522*

Attempts to remove all entries of the data model type from the datastore.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`user?` | any | The authenticated user performing the action, otherwise undefined.  |

**Returns:** Promise\<void>

___

### doUpdate

▸ `Protected`**doUpdate**(`id`: string, `obj`: T, `user?`: any): Promise\<T>

*Defined in src/routes/ModelRoute.ts:550*

Attempts to modify an existing data model object as identified by the `id` parameter in the URI.

#### Parameters:

Name | Type |
------ | ------ |
`id` | string |
`obj` | T |
`user?` | any |

**Returns:** Promise\<T>

___

### getDefaultACL

▸ `Protected` `Abstract`**getDefaultACL**(): [AccessControlList](../interfaces/accesscontrollist.md) \| undefined

*Defined in src/routes/ModelRoute.ts:78*

Returns the default access control list governing the model type. Returning a value of `undefined` will grant
full acccess to any user (including unauthenticated anonymous users).

**Returns:** [AccessControlList](../interfaces/accesscontrollist.md) \| undefined

___

### getObj

▸ `Protected`**getObj**(`id`: string, `version?`: undefined \| number): Promise\<T \| undefined>

*Defined in src/routes/ModelRoute.ts:137*

Retrieves the object with the given id from either the cache or the database. If retrieving from the database
the cache is populated to speed up subsequent requests.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`id` | string | The unique identifier of the object to retrieve. |
`version?` | undefined \| number | The desired version number of the object to retrieve. If `undefined` returns the latest.  |

**Returns:** Promise\<T \| undefined>

___

### hashQuery

▸ `Protected`**hashQuery**(`query`: any): string

*Defined in src/routes/ModelRoute.ts:84*

Hashes the given query object to a unique string.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`query` | any | The query object to hash.  |

**Returns:** string

___

### searchIdQuery

▸ `Private`**searchIdQuery**(`id`: string, `version?`: undefined \| number): any

*Defined in src/routes/ModelRoute.ts:190*

Search for existing object based on passed in id and version

#### Parameters:

Name | Type |
------ | ------ |
`id` | string |
`version?` | undefined \| number |

**Returns:** any

___

### superInitialize

▸ `Private`**superInitialize**(): Promise\<void>

*Defined in src/routes/ModelRoute.ts:95*

Called on server startup to initialize the route with any defaults.

**Returns:** Promise\<void>
