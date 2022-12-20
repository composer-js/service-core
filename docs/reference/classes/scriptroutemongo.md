[@acceleratxr/service-core](../README.md) › [Globals](../globals.md) › [ScriptRouteMongo](scriptroutemongo.md)

# Class: ScriptRouteMongo

## Hierarchy

* [ModelRoute](modelroute.md)‹[ScriptMongo](scriptmongo.md)›

  ↳ **ScriptRouteMongo**

## Index

### Constructors

* [constructor](scriptroutemongo.md#constructor)

### Properties

* [cacheClient](scriptroutemongo.md#protected-optional-cacheclient)
* [cacheTTL](scriptroutemongo.md#protected-optional-cachettl)
* [config](scriptroutemongo.md#protected-optional-config)
* [defaultACLUid](scriptroutemongo.md#protected-defaultacluid)
* [logger](scriptroutemongo.md#protected-logger)
* [repo](scriptroutemongo.md#protected-optional-repo)
* [scriptUtils](scriptroutemongo.md#protected-optional-scriptutils)
* [trackChanges](scriptroutemongo.md#protected-trackchanges)

### Accessors

* [baseCacheKey](scriptroutemongo.md#protected-basecachekey)
* [modelClass](scriptroutemongo.md#protected-modelclass)

### Methods

* [create](scriptroutemongo.md#private-create)
* [delete](scriptroutemongo.md#private-delete)
* [deleteVersion](scriptroutemongo.md#private-deleteversion)
* [doCount](scriptroutemongo.md#protected-docount)
* [doCreate](scriptroutemongo.md#protected-docreate)
* [doDelete](scriptroutemongo.md#protected-dodelete)
* [doDeleteVersion](scriptroutemongo.md#protected-dodeleteversion)
* [doFindAll](scriptroutemongo.md#protected-dofindall)
* [doFindById](scriptroutemongo.md#protected-dofindbyid)
* [doFindByIdAndVersion](scriptroutemongo.md#protected-dofindbyidandversion)
* [doTruncate](scriptroutemongo.md#protected-dotruncate)
* [doUpdate](scriptroutemongo.md#protected-doupdate)
* [findAll](scriptroutemongo.md#private-findall)
* [findById](scriptroutemongo.md#private-findbyid)
* [findByIdAndVersion](scriptroutemongo.md#private-findbyidandversion)
* [getDefaultACL](scriptroutemongo.md#protected-getdefaultacl)
* [getObj](scriptroutemongo.md#protected-getobj)
* [hashQuery](scriptroutemongo.md#protected-hashquery)
* [publish](scriptroutemongo.md#private-publish)
* [update](scriptroutemongo.md#private-update)

## Constructors

###  constructor

\+ **new ScriptRouteMongo**(): *[ScriptRouteMongo](scriptroutemongo.md)*

*Overrides [ModelRoute](modelroute.md).[constructor](modelroute.md#protected-constructor)*

Defined in src/scripts/ScriptRouteMongo.ts:24

**Returns:** *[ScriptRouteMongo](scriptroutemongo.md)*

## Properties

### `Protected` `Optional` cacheClient

• **cacheClient**? : *Redis*

*Inherited from [ModelRoute](modelroute.md).[cacheClient](modelroute.md#protected-optional-cacheclient)*

Defined in src/routes/ModelRoute.ts:35

The redis client that will be used as a 2nd level cache for all cacheable models.

___

### `Protected` `Optional` cacheTTL

• **cacheTTL**? : *undefined | number*

*Inherited from [ModelRoute](modelroute.md).[cacheTTL](modelroute.md#protected-optional-cachettl)*

Defined in src/routes/ModelRoute.ts:38

The time, in milliseconds, that objects will be cached before being invalidated.

___

### `Protected` `Optional` config

• **config**? : *any*

*Inherited from [ModelRoute](modelroute.md).[config](modelroute.md#protected-optional-config)*

Defined in src/routes/ModelRoute.ts:42

The global application configuration.

___

### `Protected` defaultACLUid

• **defaultACLUid**: *string* = ""

*Inherited from [ModelRoute](modelroute.md).[defaultACLUid](modelroute.md#protected-defaultacluid)*

Defined in src/routes/ModelRoute.ts:45

The unique identifier of the default ACL for the model type.

___

### `Protected` logger

• **logger**: *any*

*Inherited from [ModelRoute](modelroute.md).[logger](modelroute.md#protected-logger)*

Defined in src/routes/ModelRoute.ts:48

___

### `Protected` `Optional` repo

• **repo**? : *Repo‹[ScriptMongo](scriptmongo.md)›*

*Overrides [ModelRoute](modelroute.md).[repo](modelroute.md#protected-optional-abstract-repo)*

Defined in src/scripts/ScriptRouteMongo.ts:21

___

### `Protected` `Optional` scriptUtils

• **scriptUtils**? : *[ScriptUtils](scriptutils.md)*

Defined in src/scripts/ScriptRouteMongo.ts:24

___

### `Protected` trackChanges

• **trackChanges**: *number* = 0

*Inherited from [ModelRoute](modelroute.md).[trackChanges](modelroute.md#protected-trackchanges)*

Defined in src/routes/ModelRoute.ts:57

The number of previous document versions to store in the database. A negative value indicates storing all
versions, a value of `0` stores no versions.

## Accessors

### `Protected` baseCacheKey

• **get baseCacheKey**(): *string*

*Inherited from [ModelRoute](modelroute.md).[baseCacheKey](modelroute.md#protected-basecachekey)*

Defined in src/routes/ModelRoute.ts:67

The base key used to get or set data in the cache.

**Returns:** *string*

___

### `Protected` modelClass

• **get modelClass**(): *any*

*Inherited from [ModelRoute](modelroute.md).[modelClass](modelroute.md#protected-modelclass)*

Defined in src/routes/ModelRoute.ts:75

The class type of the model this route is associated with.

**Returns:** *any*

## Methods

### `Private` create

▸ **create**(`obj`: [ScriptMongo](scriptmongo.md), `user?`: JWTUser): *Promise‹[ScriptMongo](scriptmongo.md)›*

Defined in src/scripts/ScriptRouteMongo.ts:65

**Parameters:**

Name | Type |
------ | ------ |
`obj` | [ScriptMongo](scriptmongo.md) |
`user?` | JWTUser |

**Returns:** *Promise‹[ScriptMongo](scriptmongo.md)›*

___

### `Private` delete

▸ **delete**(`id`: string, `user?`: JWTUser): *Promise‹void›*

Defined in src/scripts/ScriptRouteMongo.ts:102

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`user?` | JWTUser |

**Returns:** *Promise‹void›*

___

### `Private` deleteVersion

▸ **deleteVersion**(`id`: string, `version`: string, `user?`: any): *Promise‹void›*

Defined in src/scripts/ScriptRouteMongo.ts:107

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`version` | string |
`user?` | any |

**Returns:** *Promise‹void›*

___

### `Protected` doCount

▸ **doCount**(`params`: any, `query`: any, `user?`: any): *Promise‹any›*

*Inherited from [ModelRoute](modelroute.md).[doCount](modelroute.md#protected-docount)*

Defined in src/routes/ModelRoute.ts:205

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

▸ **doCreate**(`obj`: [ScriptMongo](scriptmongo.md), `user?`: any, `acl?`: [AccessControlList](../interfaces/accesscontrollist.md), `recordEvent`: boolean, `req?`: XRequest): *Promise‹[ScriptMongo](scriptmongo.md)›*

*Inherited from [ModelRoute](modelroute.md).[doCreate](modelroute.md#protected-docreate)*

Defined in src/routes/ModelRoute.ts:238

Attempts to store the object provided in `req.body` into the datastore. Upon success, sets the newly persisted
object to the `result` property of the `res` argument, otherwise sends a `400 BAD REQUEST` response to the
client.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`obj` | [ScriptMongo](scriptmongo.md) | - | The object to store in the database. |
`user?` | any | - | The authenticated user performing the action. |
`acl?` | [AccessControlList](../interfaces/accesscontrollist.md) | - | An optional AccessControlList to create along with the object. If none specified, a default ACL is generated. |
`recordEvent` | boolean | true | Set to `true` to record a telemetry event for this operation, otherwise set to `false`. Default is `true`. |
`req?` | XRequest | - | The optional original request object.  |

**Returns:** *Promise‹[ScriptMongo](scriptmongo.md)›*

___

### `Protected` doDelete

▸ **doDelete**(`id`: string, `user?`: any, `recordEvent`: boolean, `req?`: XRequest): *Promise‹void›*

*Inherited from [ModelRoute](modelroute.md).[doDelete](modelroute.md#protected-dodelete)*

Defined in src/routes/ModelRoute.ts:317

Attempts to delete an existing data model object with a given unique identifier encoded by the URI parameter
`id`.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`id` | string | - | The unique identifier of the object to delete. |
`user?` | any | - | The authenticated user performing the action. |
`recordEvent` | boolean | true | Set to `true` to record a telemetry event for this operation, otherwise set to `false`. Default is `true`. |
`req?` | XRequest | - | The optional original request object.  |

**Returns:** *Promise‹void›*

___

### `Protected` doDeleteVersion

▸ **doDeleteVersion**(`id`: string, `version`: number, `user?`: any): *Promise‹void›*

*Inherited from [ModelRoute](modelroute.md).[doDeleteVersion](modelroute.md#protected-dodeleteversion)*

Defined in src/routes/ModelRoute.ts:371

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

▸ **doFindAll**(`params`: any, `query`: any, `user?`: any): *Promise‹[ScriptMongo](scriptmongo.md)[]›*

*Inherited from [ModelRoute](modelroute.md).[doFindAll](modelroute.md#protected-dofindall)*

Defined in src/routes/ModelRoute.ts:416

Attempts to retrieve all data model objects matching the given set of criteria as specified in the request
`query`. Any results that have been found are set to the `result` property of the `res` argument. `result` is
never null.

**Parameters:**

Name | Type |
------ | ------ |
`params` | any |
`query` | any |
`user?` | any |

**Returns:** *Promise‹[ScriptMongo](scriptmongo.md)[]›*

___

### `Protected` doFindById

▸ **doFindById**(`id`: string, `user?`: any): *Promise‹[ScriptMongo](scriptmongo.md) | undefined›*

*Inherited from [ModelRoute](modelroute.md).[doFindById](modelroute.md#protected-dofindbyid)*

Defined in src/routes/ModelRoute.ts:485

Attempts to retrieve a single data model object as identified by the `id` parameter in the URI.

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`user?` | any |

**Returns:** *Promise‹[ScriptMongo](scriptmongo.md) | undefined›*

___

### `Protected` doFindByIdAndVersion

▸ **doFindByIdAndVersion**(`id`: string, `version`: number, `user?`: any): *Promise‹[ScriptMongo](scriptmongo.md) | undefined›*

*Inherited from [ModelRoute](modelroute.md).[doFindByIdAndVersion](modelroute.md#protected-dofindbyidandversion)*

Defined in src/routes/ModelRoute.ts:521

Attempts to retrieve a single data model object as identified by the `id` and `version` parameters in the URI.

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`version` | number |
`user?` | any |

**Returns:** *Promise‹[ScriptMongo](scriptmongo.md) | undefined›*

___

### `Protected` doTruncate

▸ **doTruncate**(`user?`: any, `recordEvent`: boolean, `req?`: XRequest): *Promise‹void›*

*Inherited from [ModelRoute](modelroute.md).[doTruncate](modelroute.md#protected-dotruncate)*

Defined in src/routes/ModelRoute.ts:561

Attempts to remove all entries of the data model type from the datastore.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`user?` | any | - | The authenticated user performing the action, otherwise undefined. |
`recordEvent` | boolean | true | Set to `true` to record a telemetry event for this operation, otherwise set to `false`. Default is `true`. |
`req?` | XRequest | - | The optional original request object.  |

**Returns:** *Promise‹void›*

___

### `Protected` doUpdate

▸ **doUpdate**(`id`: string, `obj`: [ScriptMongo](scriptmongo.md), `user?`: any, `recordEvent`: boolean, `req?`: XRequest): *Promise‹[ScriptMongo](scriptmongo.md)›*

*Inherited from [ModelRoute](modelroute.md).[doUpdate](modelroute.md#protected-doupdate)*

Defined in src/routes/ModelRoute.ts:600

Attempts to modify an existing data model object as identified by the `id` parameter in the URI.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`id` | string | - | - |
`obj` | [ScriptMongo](scriptmongo.md) | - | - |
`user?` | any | - | - |
`recordEvent` | boolean | true | Set to `true` to record a telemetry event for this operation, otherwise set to `false`. Default is `true`. |
`req?` | XRequest | - | The optional original request object.  |

**Returns:** *Promise‹[ScriptMongo](scriptmongo.md)›*

___

### `Private` findAll

▸ **findAll**(`params`: any, `query`: any, `user?`: JWTUser): *Promise‹[ScriptMongo](scriptmongo.md)[]›*

Defined in src/scripts/ScriptRouteMongo.ts:112

**Parameters:**

Name | Type |
------ | ------ |
`params` | any |
`query` | any |
`user?` | JWTUser |

**Returns:** *Promise‹[ScriptMongo](scriptmongo.md)[]›*

___

### `Private` findById

▸ **findById**(`id`: string, `user?`: any): *Promise‹[ScriptMongo](scriptmongo.md) | undefined›*

Defined in src/scripts/ScriptRouteMongo.ts:117

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`user?` | any |

**Returns:** *Promise‹[ScriptMongo](scriptmongo.md) | undefined›*

___

### `Private` findByIdAndVersion

▸ **findByIdAndVersion**(`id`: string, `version`: string, `user?`: any): *Promise‹[ScriptMongo](scriptmongo.md) | void›*

Defined in src/scripts/ScriptRouteMongo.ts:122

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`version` | string |
`user?` | any |

**Returns:** *Promise‹[ScriptMongo](scriptmongo.md) | void›*

___

### `Protected` getDefaultACL

▸ **getDefaultACL**(): *[AccessControlList](../interfaces/accesscontrollist.md) | undefined*

*Overrides [ModelRoute](modelroute.md).[getDefaultACL](modelroute.md#protected-abstract-getdefaultacl)*

Defined in src/scripts/ScriptRouteMongo.ts:30

**Returns:** *[AccessControlList](../interfaces/accesscontrollist.md) | undefined*

___

### `Protected` getObj

▸ **getObj**(`id`: string, `version?`: undefined | number): *Promise‹[ScriptMongo](scriptmongo.md) | undefined›*

*Inherited from [ModelRoute](modelroute.md).[getObj](modelroute.md#protected-getobj)*

Defined in src/routes/ModelRoute.ts:143

Retrieves the object with the given id from either the cache or the database. If retrieving from the database
the cache is populated to speed up subsequent requests.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | string | The unique identifier of the object to retrieve. |
`version?` | undefined &#124; number | The desired version number of the object to retrieve. If `undefined` returns the latest.  |

**Returns:** *Promise‹[ScriptMongo](scriptmongo.md) | undefined›*

___

### `Protected` hashQuery

▸ **hashQuery**(`query`: any): *string*

*Inherited from [ModelRoute](modelroute.md).[hashQuery](modelroute.md#protected-hashquery)*

Defined in src/routes/ModelRoute.ts:90

Hashes the given query object to a unique string.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`query` | any | The query object to hash.  |

**Returns:** *string*

___

### `Private` publish

▸ **publish**(`id`: string, `version`: string, `user?`: any): *Promise‹[ScriptMongo](scriptmongo.md) | void›*

Defined in src/scripts/ScriptRouteMongo.ts:127

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`version` | string |
`user?` | any |

**Returns:** *Promise‹[ScriptMongo](scriptmongo.md) | void›*

___

### `Private` update

▸ **update**(`id`: string, `obj`: [ScriptMongo](scriptmongo.md), `user?`: JWTUser): *Promise‹[ScriptMongo](scriptmongo.md)›*

Defined in src/scripts/ScriptRouteMongo.ts:147

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`obj` | [ScriptMongo](scriptmongo.md) |
`user?` | JWTUser |

**Returns:** *Promise‹[ScriptMongo](scriptmongo.md)›*
