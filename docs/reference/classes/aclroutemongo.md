**[@composer-js/service-core](../README.md)**

> [Globals](../globals.md) / ACLRouteMongo

# Class: ACLRouteMongo

## Hierarchy

* [ModelRoute](modelroute.md)\<[AccessControlListMongo](accesscontrollistmongo.md)>

  ↳ **ACLRouteMongo**

## Index

### Constructors

* [constructor](aclroutemongo.md#constructor)

### Properties

* [cacheClient](aclroutemongo.md#cacheclient)
* [cacheTTL](aclroutemongo.md#cachettl)
* [config](aclroutemongo.md#config)
* [defaultACLUid](aclroutemongo.md#defaultacluid)
* [logger](aclroutemongo.md#logger)
* [repo](aclroutemongo.md#repo)
* [trackChanges](aclroutemongo.md#trackchanges)

### Accessors

* [baseCacheKey](aclroutemongo.md#basecachekey)
* [modelClass](aclroutemongo.md#modelclass)

### Methods

* [create](aclroutemongo.md#create)
* [delete](aclroutemongo.md#delete)
* [doCount](aclroutemongo.md#docount)
* [doCreate](aclroutemongo.md#docreate)
* [doDelete](aclroutemongo.md#dodelete)
* [doDeleteVersion](aclroutemongo.md#dodeleteversion)
* [doFindAll](aclroutemongo.md#dofindall)
* [doFindById](aclroutemongo.md#dofindbyid)
* [doFindByIdAndVersion](aclroutemongo.md#dofindbyidandversion)
* [doTruncate](aclroutemongo.md#dotruncate)
* [doUpdate](aclroutemongo.md#doupdate)
* [findAll](aclroutemongo.md#findall)
* [findById](aclroutemongo.md#findbyid)
* [getDefaultACL](aclroutemongo.md#getdefaultacl)
* [getObj](aclroutemongo.md#getobj)
* [hashQuery](aclroutemongo.md#hashquery)
* [update](aclroutemongo.md#update)

## Constructors

### constructor

\+ **new ACLRouteMongo**(): [ACLRouteMongo](aclroutemongo.md)

*Overrides [ModelRoute](modelroute.md).[constructor](modelroute.md#constructor)*

*Defined in src/security/ACLRouteMongo.ts:20*

**Returns:** [ACLRouteMongo](aclroutemongo.md)

## Properties

### cacheClient

• `Protected` `Optional` **cacheClient**: Redis

*Inherited from [ModelRoute](modelroute.md).[cacheClient](modelroute.md#cacheclient)*

*Defined in src/routes/ModelRoute.ts:33*

The redis client that will be used as a 2nd level cache for all cacheable models.

___

### cacheTTL

• `Protected` `Optional` **cacheTTL**: undefined \| number

*Inherited from [ModelRoute](modelroute.md).[cacheTTL](modelroute.md#cachettl)*

*Defined in src/routes/ModelRoute.ts:36*

The time, in milliseconds, that objects will be cached before being invalidated.

___

### config

• `Private` `Optional` **config**: any

*Defined in src/security/ACLRouteMongo.ts:17*

___

### defaultACLUid

• `Protected` **defaultACLUid**: string = ""

*Inherited from [ModelRoute](modelroute.md).[defaultACLUid](modelroute.md#defaultacluid)*

*Defined in src/routes/ModelRoute.ts:39*

The unique identifier of the default ACL for the model type.

___

### logger

• `Protected` **logger**: any

*Inherited from [ModelRoute](modelroute.md).[logger](modelroute.md#logger)*

*Defined in src/routes/ModelRoute.ts:42*

___

### repo

• `Protected` `Optional` **repo**: Repo\<[AccessControlListMongo](accesscontrollistmongo.md)>

*Overrides [ModelRoute](modelroute.md).[repo](modelroute.md#repo)*

*Defined in src/security/ACLRouteMongo.ts:20*

___

### trackChanges

• `Protected` **trackChanges**: number = 0

*Inherited from [ModelRoute](modelroute.md).[trackChanges](modelroute.md#trackchanges)*

*Defined in src/routes/ModelRoute.ts:51*

The number of previous document versions to store in the database. A negative value indicates storing all
versions, a value of `0` stores no versions.

## Accessors

### baseCacheKey

• `Protected`get **baseCacheKey**(): string

*Overrides [ModelRoute](modelroute.md).[baseCacheKey](modelroute.md#basecachekey)*

*Defined in src/security/ACLRouteMongo.ts:29*

The base key used to get or set data in the cache.

**Returns:** string

___

### modelClass

• `Protected`get **modelClass**(): any

*Inherited from [ModelRoute](modelroute.md).[modelClass](modelroute.md#modelclass)*

*Defined in src/routes/ModelRoute.ts:69*

The class type of the model this route is associated with.

**Returns:** any

## Methods

### create

▸ `Private`**create**(`obj`: [AccessControlListMongo](accesscontrollistmongo.md), `user?`: JWTUser): Promise\<[AccessControlListMongo](accesscontrollistmongo.md)>

*Defined in src/security/ACLRouteMongo.ts:39*

#### Parameters:

Name | Type |
------ | ------ |
`obj` | [AccessControlListMongo](accesscontrollistmongo.md) |
`user?` | JWTUser |

**Returns:** Promise\<[AccessControlListMongo](accesscontrollistmongo.md)>

___

### delete

▸ `Private`**delete**(`id`: string, `user?`: JWTUser): Promise\<void>

*Defined in src/security/ACLRouteMongo.ts:51*

#### Parameters:

Name | Type |
------ | ------ |
`id` | string |
`user?` | JWTUser |

**Returns:** Promise\<void>

___

### doCount

▸ `Protected`**doCount**(`params`: any, `query`: any, `user?`: any): Promise\<any>

*Inherited from [ModelRoute](modelroute.md).[doCount](modelroute.md#docount)*

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

▸ `Protected`**doCreate**(`obj`: [AccessControlListMongo](accesscontrollistmongo.md), `user?`: any, `acl?`: [AccessControlList](../interfaces/accesscontrollist.md)): Promise\<[AccessControlListMongo](accesscontrollistmongo.md)>

*Inherited from [ModelRoute](modelroute.md).[doCreate](modelroute.md#docreate)*

*Defined in src/routes/ModelRoute.ts:226*

Attempts to store the object provided in `req.body` into the datastore. Upon success, sets the newly persisted
object to the `result` property of the `res` argument, otherwise sends a `400 BAD REQUEST` response to the
client.

#### Parameters:

Name | Type |
------ | ------ |
`obj` | [AccessControlListMongo](accesscontrollistmongo.md) |
`user?` | any |
`acl?` | [AccessControlList](../interfaces/accesscontrollist.md) |

**Returns:** Promise\<[AccessControlListMongo](accesscontrollistmongo.md)>

___

### doDelete

▸ `Protected`**doDelete**(`id`: string, `user?`: any): Promise\<void>

*Inherited from [ModelRoute](modelroute.md).[doDelete](modelroute.md#dodelete)*

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

*Inherited from [ModelRoute](modelroute.md).[doDeleteVersion](modelroute.md#dodeleteversion)*

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

▸ `Protected`**doFindAll**(`params`: any, `query`: any, `user?`: any): Promise\<[AccessControlListMongo](accesscontrollistmongo.md)[]>

*Inherited from [ModelRoute](modelroute.md).[doFindAll](modelroute.md#dofindall)*

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

**Returns:** Promise\<[AccessControlListMongo](accesscontrollistmongo.md)[]>

___

### doFindById

▸ `Protected`**doFindById**(`id`: string, `user?`: any): Promise\<[AccessControlListMongo](accesscontrollistmongo.md) \| undefined>

*Inherited from [ModelRoute](modelroute.md).[doFindById](modelroute.md#dofindbyid)*

*Defined in src/routes/ModelRoute.ts:448*

Attempts to retrieve a single data model object as identified by the `id` parameter in the URI.

#### Parameters:

Name | Type |
------ | ------ |
`id` | string |
`user?` | any |

**Returns:** Promise\<[AccessControlListMongo](accesscontrollistmongo.md) \| undefined>

___

### doFindByIdAndVersion

▸ `Protected`**doFindByIdAndVersion**(`id`: string, `version`: number, `user?`: any): Promise\<[AccessControlListMongo](accesscontrollistmongo.md) \| undefined>

*Inherited from [ModelRoute](modelroute.md).[doFindByIdAndVersion](modelroute.md#dofindbyidandversion)*

*Defined in src/routes/ModelRoute.ts:484*

Attempts to retrieve a single data model object as identified by the `id` and `version` parameters in the URI.

#### Parameters:

Name | Type |
------ | ------ |
`id` | string |
`version` | number |
`user?` | any |

**Returns:** Promise\<[AccessControlListMongo](accesscontrollistmongo.md) \| undefined>

___

### doTruncate

▸ `Protected`**doTruncate**(`user?`: any): Promise\<void>

*Inherited from [ModelRoute](modelroute.md).[doTruncate](modelroute.md#dotruncate)*

*Defined in src/routes/ModelRoute.ts:522*

Attempts to remove all entries of the data model type from the datastore.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`user?` | any | The authenticated user performing the action, otherwise undefined.  |

**Returns:** Promise\<void>

___

### doUpdate

▸ `Protected`**doUpdate**(`id`: string, `obj`: [AccessControlListMongo](accesscontrollistmongo.md), `user?`: any): Promise\<[AccessControlListMongo](accesscontrollistmongo.md)>

*Inherited from [ModelRoute](modelroute.md).[doUpdate](modelroute.md#doupdate)*

*Defined in src/routes/ModelRoute.ts:550*

Attempts to modify an existing data model object as identified by the `id` parameter in the URI.

#### Parameters:

Name | Type |
------ | ------ |
`id` | string |
`obj` | [AccessControlListMongo](accesscontrollistmongo.md) |
`user?` | any |

**Returns:** Promise\<[AccessControlListMongo](accesscontrollistmongo.md)>

___

### findAll

▸ `Private`**findAll**(`params`: any, `query`: any, `user?`: JWTUser): Promise\<[AccessControlListMongo](accesscontrollistmongo.md)[]>

*Defined in src/security/ACLRouteMongo.ts:72*

#### Parameters:

Name | Type |
------ | ------ |
`params` | any |
`query` | any |
`user?` | JWTUser |

**Returns:** Promise\<[AccessControlListMongo](accesscontrollistmongo.md)[]>

___

### findById

▸ `Private`**findById**(`id`: string, `user?`: any): Promise\<[AccessControlListMongo](accesscontrollistmongo.md) \| undefined>

*Defined in src/security/ACLRouteMongo.ts:87*

#### Parameters:

Name | Type |
------ | ------ |
`id` | string |
`user?` | any |

**Returns:** Promise\<[AccessControlListMongo](accesscontrollistmongo.md) \| undefined>

___

### getDefaultACL

▸ `Protected`**getDefaultACL**(): [AccessControlList](../interfaces/accesscontrollist.md) \| undefined

*Overrides [ModelRoute](modelroute.md).[getDefaultACL](modelroute.md#getdefaultacl)*

*Defined in src/security/ACLRouteMongo.ts:33*

**Returns:** [AccessControlList](../interfaces/accesscontrollist.md) \| undefined

___

### getObj

▸ `Protected`**getObj**(`id`: string, `version?`: undefined \| number): Promise\<[AccessControlListMongo](accesscontrollistmongo.md) \| undefined>

*Inherited from [ModelRoute](modelroute.md).[getObj](modelroute.md#getobj)*

*Defined in src/routes/ModelRoute.ts:137*

Retrieves the object with the given id from either the cache or the database. If retrieving from the database
the cache is populated to speed up subsequent requests.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`id` | string | The unique identifier of the object to retrieve. |
`version?` | undefined \| number | The desired version number of the object to retrieve. If `undefined` returns the latest.  |

**Returns:** Promise\<[AccessControlListMongo](accesscontrollistmongo.md) \| undefined>

___

### hashQuery

▸ `Protected`**hashQuery**(`query`: any): string

*Inherited from [ModelRoute](modelroute.md).[hashQuery](modelroute.md#hashquery)*

*Defined in src/routes/ModelRoute.ts:84*

Hashes the given query object to a unique string.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`query` | any | The query object to hash.  |

**Returns:** string

___

### update

▸ `Private`**update**(`id`: string, `obj`: [AccessControlListMongo](accesscontrollistmongo.md), `user?`: JWTUser): Promise\<[AccessControlListMongo](accesscontrollistmongo.md)>

*Defined in src/security/ACLRouteMongo.ts:102*

#### Parameters:

Name | Type |
------ | ------ |
`id` | string |
`obj` | [AccessControlListMongo](accesscontrollistmongo.md) |
`user?` | JWTUser |

**Returns:** Promise\<[AccessControlListMongo](accesscontrollistmongo.md)>
