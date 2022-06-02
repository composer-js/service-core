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
`T` | [BaseEntity](baseentity.md) \| [SimpleEntity](simpleentity.md) |

## Hierarchy

* **ModelRoute**

## Index

### Constructors

* [constructor](modelroute.md#constructor)

### Properties

* [cacheClient](modelroute.md#cacheclient)
* [cacheTTL](modelroute.md#cachettl)
* [config](modelroute.md#config)
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
* [doExists](modelroute.md#doexists)
* [doFindAll](modelroute.md#dofindall)
* [doFindById](modelroute.md#dofindbyid)
* [doFindByIdAndVersion](modelroute.md#dofindbyidandversion)
* [doTruncate](modelroute.md#dotruncate)
* [doUpdate](modelroute.md#doupdate)
* [getObj](modelroute.md#getobj)
* [hashQuery](modelroute.md#hashquery)
* [searchIdQuery](modelroute.md#searchidquery)

## Constructors

### constructor

\+ `Protected`**new ModelRoute**(): [ModelRoute](modelroute.md)

*Defined in src/routes/ModelRoute.ts:56*

Initializes a new instance using any defaults.

**Returns:** [ModelRoute](modelroute.md)

## Properties

### cacheClient

• `Protected` `Optional` **cacheClient**: Redis

*Defined in src/routes/ModelRoute.ts:34*

The redis client that will be used as a 2nd level cache for all cacheable models.

___

### cacheTTL

• `Protected` `Optional` **cacheTTL**: undefined \| number

*Defined in src/routes/ModelRoute.ts:37*

The time, in milliseconds, that objects will be cached before being invalidated.

___

### config

• `Protected` `Optional` **config**: any

*Defined in src/routes/ModelRoute.ts:41*

The global application configuration.

___

### defaultACLUid

• `Protected` **defaultACLUid**: string = ""

*Defined in src/routes/ModelRoute.ts:44*

The unique identifier of the default ACL for the model type.

___

### logger

• `Protected` **logger**: any

*Defined in src/routes/ModelRoute.ts:47*

___

### repo

• `Protected` `Optional` `Abstract` **repo**: Repository\<T> \| MongoRepository\<T>

*Defined in src/routes/ModelRoute.ts:50*

The model class associated with the controller to perform operations against.

___

### trackChanges

• `Protected` **trackChanges**: number = 0

*Defined in src/routes/ModelRoute.ts:56*

The number of previous document versions to store in the database. A negative value indicates storing all
versions, a value of `0` stores no versions.

## Accessors

### baseCacheKey

• `Protected`get **baseCacheKey**(): string

*Defined in src/routes/ModelRoute.ts:66*

The base key used to get or set data in the cache.

**Returns:** string

___

### modelClass

• `Protected`get **modelClass**(): any

*Defined in src/routes/ModelRoute.ts:74*

The class type of the model this route is associated with.

**Returns:** any

## Methods

### doCount

▸ `Protected`**doCount**(`params`: any, `query`: any, `res`: XResponse, `user?`: any): Promise\<XResponse>

*Defined in src/routes/ModelRoute.ts:159*

Attempts to retrieve the number of data model objects matching the given set of criteria as specified in the
request `query`. Any results that have been found are set to the `content-length` header of the `res` argument.

#### Parameters:

Name | Type |
------ | ------ |
`params` | any |
`query` | any |
`res` | XResponse |
`user?` | any |

**Returns:** Promise\<XResponse>

___

### doCreate

▸ `Protected`**doCreate**(`obj`: T, `user?`: any): Promise\<T>

*Defined in src/routes/ModelRoute.ts:185*

Attempts to store the object provided in `req.body` into the datastore. Upon success, sets the newly persisted
object to the `result` property of the `res` argument, otherwise sends a `400 BAD REQUEST` response to the
client.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`obj` | T | The object to store in the database. |
`user?` | any | The authenticated user performing the action.  |

**Returns:** Promise\<T>

___

### doDelete

▸ `Protected`**doDelete**(`id`: string, `user?`: any): Promise\<void>

*Defined in src/routes/ModelRoute.ts:221*

Attempts to delete an existing data model object with a given unique identifier encoded by the URI parameter
`id`.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`id` | string | The unique identifier of the object to delete. |
`user?` | any | The authenticated user performing the action.  |

**Returns:** Promise\<void>

___

### doDeleteVersion

▸ `Protected`**doDeleteVersion**(`id`: string, `version`: number, `user?`: any): Promise\<void>

*Defined in src/routes/ModelRoute.ts:256*

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

### doExists

▸ `Protected`**doExists**(`id`: string, `res`: XResponse, `user?`: any): Promise\<any>

*Defined in src/routes/ModelRoute.ts:290*

Attempts to determine if an existing object with the given unique identifier exists.

#### Parameters:

Name | Type |
------ | ------ |
`id` | string |
`res` | XResponse |
`user?` | any |

**Returns:** Promise\<any>

___

### doFindAll

▸ `Protected`**doFindAll**(`params`: any, `query`: any, `user?`: any): Promise\<T[]>

*Defined in src/routes/ModelRoute.ts:320*

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

*Defined in src/routes/ModelRoute.ts:392*

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

*Defined in src/routes/ModelRoute.ts:421*

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

▸ `Protected`**doTruncate**(`params?`: any, `query?`: any, `user?`: any): Promise\<void>

*Defined in src/routes/ModelRoute.ts:455*

Attempts to remove all entries of the data model type from the datastore matching the given
parameters and query.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`params?` | any | The parameters to match. |
`query?` | any | The query parameters to match. |
`user?` | any | The authenticated user performing the action, otherwise undefined.  |

**Returns:** Promise\<void>

___

### doUpdate

▸ `Protected`**doUpdate**(`id`: string, `obj`: T, `user?`: any): Promise\<T>

*Defined in src/routes/ModelRoute.ts:493*

Attempts to modify an existing data model object as identified by the `id` parameter in the URI.

#### Parameters:

Name | Type |
------ | ------ |
`id` | string |
`obj` | T |
`user?` | any |

**Returns:** Promise\<T>

___

### getObj

▸ `Protected`**getObj**(`id`: string, `version?`: undefined \| number): Promise\<T \| undefined>

*Defined in src/routes/ModelRoute.ts:98*

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

*Defined in src/routes/ModelRoute.ts:83*

Hashes the given query object to a unique string.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`query` | any | The query object to hash.  |

**Returns:** string

___

### searchIdQuery

▸ `Private`**searchIdQuery**(`id`: string, `version?`: undefined \| number): any

*Defined in src/routes/ModelRoute.ts:151*

Search for existing object based on passed in id and version and product uid.

#### Parameters:

Name | Type |
------ | ------ |
`id` | string |
`version?` | undefined \| number |

**Returns:** any
