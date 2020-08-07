[@composer-js/service-core](README.md) › [Globals](globals.md)

# @composer-js/service-core

## Index

### Enumerations

* [ACLAction](enums/aclaction.md)

### Classes

* [ACLRecordMongo](classes/aclrecordmongo.md)
* [ACLRecordSQL](classes/aclrecordsql.md)
* [ACLRouteMongo](classes/aclroutemongo.md)
* [ACLRouteSQL](classes/aclroutesql.md)
* [ACLUtils](classes/aclutils.md)
* [AccessControlListMongo](classes/accesscontrollistmongo.md)
* [AccessControlListSQL](classes/accesscontrollistsql.md)
* [BackgroundService](classes/backgroundservice.md)
* [BackgroundServiceManager](classes/backgroundservicemanager.md)
* [BaseEntity](classes/baseentity.md)
* [BaseMongoEntity](classes/basemongoentity.md)
* [ConnectionManager](classes/connectionmanager.md)
* [IndexRoute](classes/indexroute.md)
* [JWTStrategy](classes/jwtstrategy.md)
* [MetricsRoute](classes/metricsroute.md)
* [ModelRoute](classes/modelroute.md)
* [ModelUtils](classes/modelutils.md)
* [NotificationUtils](classes/notificationutils.md)
* [OpenAPIRoute](classes/openapiroute.md)
* [Options](classes/options.md)
* [RepoUtils](classes/repoutils.md)
* [RoutesScanner](classes/routesscanner.md)
* [Server](classes/server.md)
* [SimpleMongoEntity](classes/simplemongoentity.md)

### Interfaces

* [ACLRecord](interfaces/aclrecord.md)
* [AccessControlList](interfaces/accesscontrollist.md)
* [Entity](interfaces/entity.md)
* [Model](interfaces/model.md)

### Variables

* [CACHE_BASE_KEY](globals.md#const-cache_base_key)
* [cookieParser](globals.md#const-cookieparser)
* [cors](globals.md#const-cors)
* [express](globals.md#const-express)
* [instance](globals.md#const-instance)
* [logger](globals.md#const-logger)
* [passport](globals.md#const-passport)
* [swagger](globals.md#const-swagger)
* [uuid](globals.md#const-uuid)

### Functions

* [After](globals.md#after)
* [Auth](globals.md#auth)
* [Before](globals.md#before)
* [Cache](globals.md#cache)
* [Config](globals.md#config)
* [ContentType](globals.md#contenttype)
* [Delete](globals.md#delete)
* [Get](globals.md#get)
* [Head](globals.md#head)
* [Header](globals.md#header)
* [Identifier](globals.md#identifier)
* [Init](globals.md#init)
* [Logger](globals.md#logger)
* [Method](globals.md#method)
* [Model](globals.md#model)
* [MongoRepository](globals.md#mongorepository)
* [Param](globals.md#param)
* [Post](globals.md#post)
* [Put](globals.md#put)
* [Query](globals.md#query)
* [RedisConnection](globals.md#redisconnection)
* [Repository](globals.md#repository)
* [Request](globals.md#request)
* [RequiresRole](globals.md#requiresrole)
* [Response](globals.md#response)
* [Route](globals.md#route)
* [TrackChanges](globals.md#trackchanges)
* [User](globals.md#user)
* [Validate](globals.md#validate)
* [marshall](globals.md#marshall)

## Variables

### `Const` CACHE_BASE_KEY

• **CACHE_BASE_KEY**: *string* = "db.cache.AccessControlList"

Defined in src/security/ACLUtils.ts:14

___

### `Const` cookieParser

• **cookieParser**: *any* = require("cookie-parser")

Defined in src/Server.ts:4

___

### `Const` cors

• **cors**: *any* = require("cors")

Defined in src/Server.ts:5

___

### `Const` express

• **express**: *any* = require("express")

Defined in src/Server.ts:6

___

### `Const` instance

• **instance**: *[ACLUtils](classes/aclutils.md)* = new ACLUtils()

Defined in src/security/ACLUtils.ts:372

___

### `Const` logger

• **logger**: *any* = Logger()

Defined in src/database/ConnectionManager.ts:8

Defined in src/models/ModelUtils.ts:23

___

### `Const` passport

• **passport**: *any* = require("passport")

Defined in src/Server.ts:8

___

### `Const` swagger

• **swagger**: *any* = require("swagger-ui-express")

Defined in src/routes/OpenAPIRoute.ts:6

___

### `Const` uuid

• **uuid**: *any* = require("uuid")

Defined in src/models/BaseEntity.ts:6

Defined in src/models/SimpleEntity.ts:6

## Functions

###  After

▸ **After**(`func`: Function | string | string | Function[]): *(Anonymous function)*

Defined in src/decorators/RouteDecorators.ts:12

Indicates a provided function or list of functions to execute *after* the decorated function and before the response
is sent to a client. Note that the function must call `next()` in order for this decorator to work.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`func` | Function &#124; string &#124; string &#124; Function[] | The function or list of functions to execute *after* the decorated function.  |

**Returns:** *(Anonymous function)*

___

###  Auth

▸ **Auth**(`strategies`: string | string[], `require`: boolean): *(Anonymous function)*

Defined in src/decorators/RouteDecorators.ts:32

Applies PassportJS authentication to the decorated route or method for the provided strategy or list of strategies
should be attempted before processing the route.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`strategies` | string &#124; string[] | - | The PassportJS strategies that will be applied when incoming requests are processed. |
`require` | boolean | true | Set to `true` to indicate that at least one of the specified authentication strategies must pass to                proceed, otherwise set to `false`. Default is `true`.  |

**Returns:** *(Anonymous function)*

___

###  Before

▸ **Before**(`func`: Function | string | string | Function[]): *(Anonymous function)*

Defined in src/decorators/RouteDecorators.ts:46

Indicates a provided function or list of functions to execute *before* the decorated function.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`func` | Function &#124; string &#124; string &#124; Function[] | The function or list of functions to execute *before* the decorated function.  |

**Returns:** *(Anonymous function)*

___

###  Cache

▸ **Cache**(`ttl`: number): *(Anonymous function)*

Defined in src/decorators/ModelDecorators.ts:11

Indicates that the class is cacheable with the specified TTL.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`ttl` | number | 30 |

**Returns:** *(Anonymous function)*

___

###  Config

▸ **Config**(`target`: any, `propertyKey`: string | symbol): *void*

Defined in src/decorators/ObjectDecorators.ts:9

Apply this to a property to have the global configuration object injected at instantiation.

**Parameters:**

Name | Type |
------ | ------ |
`target` | any |
`propertyKey` | string &#124; symbol |

**Returns:** *void*

___

###  ContentType

▸ **ContentType**(`type`: string): *(Anonymous function)*

Defined in src/decorators/RouteDecorators.ts:63

Indicates that the decorated function will return content encoded with the specified content type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | string | The content type that the function will return.  |

**Returns:** *(Anonymous function)*

___

###  Delete

▸ **Delete**(`path?`: undefined | string): *(Anonymous function)*

Defined in src/decorators/RouteDecorators.ts:76

Indicates that the decorated function handles incoming `DELETE` requests at the given sub-path.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`path?` | undefined &#124; string | The sub-path that the route will handle requests for.  |

**Returns:** *(Anonymous function)*

___

###  Get

▸ **Get**(`path?`: undefined | string): *(Anonymous function)*

Defined in src/decorators/RouteDecorators.ts:85

Indicates that the decorated function handles incoming `GET` requests at the given sub-path.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`path?` | undefined &#124; string | The sub-path that the route will handle requests for.  |

**Returns:** *(Anonymous function)*

___

###  Head

▸ **Head**(`path?`: undefined | string): *(Anonymous function)*

Defined in src/decorators/RouteDecorators.ts:94

Indicates that the decorated function handles incoming `HEAD` requests at the given sub-path.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`path?` | undefined &#124; string | The sub-path that the route will handle requests for.  |

**Returns:** *(Anonymous function)*

___

###  Header

▸ **Header**(`name`: string): *(Anonymous function)*

Defined in src/decorators/RouteDecorators.ts:103

Injects the value of the specified request header with the given name as the value of the decorated argument.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | The name of the header whose value will be injected.  |

**Returns:** *(Anonymous function)*

___

###  Identifier

▸ **Identifier**(`target`: any, `propertyKey`: string | symbol): *void*

Defined in src/decorators/ModelDecorators.ts:25

Apply this to a property that is considered a unique identifier.

**Parameters:**

Name | Type |
------ | ------ |
`target` | any |
`propertyKey` | string &#124; symbol |

**Returns:** *void*

___

###  Init

▸ **Init**(`target`: any, `propertyKey`: string, `descriptor`: PropertyDescriptor): *void*

Defined in src/decorators/RouteDecorators.ts:114

Indicates that the decorated function should be called during the initialization phase of server startup.

**Parameters:**

Name | Type |
------ | ------ |
`target` | any |
`propertyKey` | string |
`descriptor` | PropertyDescriptor |

**Returns:** *void*

___

###  Logger

▸ **Logger**(`target`: any, `propertyKey`: string | symbol): *void*

Defined in src/decorators/ObjectDecorators.ts:22

Apply this to a property to have the logger utility injected at instantiation.

**Parameters:**

Name | Type |
------ | ------ |
`target` | any |
`propertyKey` | string &#124; symbol |

**Returns:** *void*

___

###  Method

▸ **Method**(`method`: string | string[], `path?`: undefined | string): *(Anonymous function)*

Defined in src/decorators/RouteDecorators.ts:124

Indicates that the decorated function handles incoming HTTP requests for the specified HTTP method(s) at the given sub-path.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`method` | string &#124; string[] | - |
`path?` | undefined &#124; string | The sub-path that the route handles requests for.  |

**Returns:** *(Anonymous function)*

___

###  Model

▸ **Model**(`type`: any): *(Anonymous function)*

Defined in src/decorators/ModelDecorators.ts:40

Indicates that the class utilizes is a manager for the specified class type.

**Parameters:**

Name | Type |
------ | ------ |
`type` | any |

**Returns:** *(Anonymous function)*

___

###  MongoRepository

▸ **MongoRepository**(`type`: any): *(Anonymous function)*

Defined in src/decorators/ModelDecorators.ts:54

Apply this to a property to have the TypeORM `MongoRepository` for the given entity type injected at instantiation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | any | The entity type whose repository will be injected.  |

**Returns:** *(Anonymous function)*

___

###  Param

▸ **Param**(`name`: string | undefined): *(Anonymous function)*

Defined in src/decorators/RouteDecorators.ts:166

Injects the value of the specified URI parameter with the given name as the value of the decorated argument. If no
name is specified the entire request parameter will be injected.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`name` | string &#124; undefined | undefined | The name of the URI parameter whose value will be injected.  |

**Returns:** *(Anonymous function)*

___

###  Post

▸ **Post**(`path?`: undefined | string): *(Anonymous function)*

Defined in src/decorators/RouteDecorators.ts:156

Indicates that the decorated function handles incoming `POST` requests at the given sub-path.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`path?` | undefined &#124; string | The sub-path that the route will handle requests for.  |

**Returns:** *(Anonymous function)*

___

###  Put

▸ **Put**(`path?`: undefined | string): *(Anonymous function)*

Defined in src/decorators/RouteDecorators.ts:179

Indicates that the decorated function handles incoming `PUT` requests at the given sub-path.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`path?` | undefined &#124; string | The sub-path that the route will handle requests for.  |

**Returns:** *(Anonymous function)*

___

###  Query

▸ **Query**(`name`: string | undefined): *(Anonymous function)*

Defined in src/decorators/RouteDecorators.ts:189

Injects the value of the specified query parameter with the given name as the value of the decorated argument. If
no name is specified the entire request query will be injected.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`name` | string &#124; undefined | undefined | THe name of the query parameter whose value will be injected.  |

**Returns:** *(Anonymous function)*

___

###  RedisConnection

▸ **RedisConnection**(`name`: string): *(Anonymous function)*

Defined in src/decorators/ModelDecorators.ts:88

Apply this to a property to have the `Redis` connection injected at instantiation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | The name of the database connection to inject.  |

**Returns:** *(Anonymous function)*

___

###  Repository

▸ **Repository**(`type`: any): *(Anonymous function)*

Defined in src/decorators/ModelDecorators.ts:71

Apply this to a property to have the TypeORM `Repository` for the given entity type injected at instantiation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | any | The entity type whose repository will be injected.  |

**Returns:** *(Anonymous function)*

___

###  Request

▸ **Request**(`target`: any, `propertyKey`: string, `index`: number): *void*

Defined in src/decorators/RouteDecorators.ts:200

Injects the Express request object as the value of the decorated argument.

**Parameters:**

Name | Type |
------ | ------ |
`target` | any |
`propertyKey` | string |
`index` | number |

**Returns:** *void*

___

###  RequiresRole

▸ **RequiresRole**(`roles`: string | string[]): *(Anonymous function)*

Defined in src/decorators/RouteDecorators.ts:221

Indicates that the client must be an authenticated user with at least one of the specified role(s) to process the
request.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`roles` | string &#124; string[] | The role(s) that an authenticated user must have to make the request.  |

**Returns:** *(Anonymous function)*

___

###  Response

▸ **Response**(`target`: any, `propertyKey`: string, `index`: number): *void*

Defined in src/decorators/RouteDecorators.ts:209

Injects the Express response object as the value of the decorated argument.

**Parameters:**

Name | Type |
------ | ------ |
`target` | any |
`propertyKey` | string |
`index` | number |

**Returns:** *void*

___

###  Route

▸ **Route**(`paths`: string | string[]): *(Anonymous function)*

Defined in src/decorators/RouteDecorators.ts:234

Indicates that the decorated class contains Express route definitions.

**Parameters:**

Name | Type |
------ | ------ |
`paths` | string &#124; string[] |

**Returns:** *(Anonymous function)*

___

###  TrackChanges

▸ **TrackChanges**(`versions`: number): *(Anonymous function)*

Defined in src/decorators/ModelDecorators.ts:106

Indicates that the class will track changes for each document update limited to the specified number of versions.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`versions` | number | -1 | The number of versions that will be tracked for each document change. Set to `-1` to store all versions. Default value is `-1`.  |

**Returns:** *(Anonymous function)*

___

###  User

▸ **User**(`target`: any, `propertyKey`: string, `index`: number): *void*

Defined in src/decorators/RouteDecorators.ts:245

Injects the authenticated user object as the value of the decorated argument.

**Parameters:**

Name | Type |
------ | ------ |
`target` | any |
`propertyKey` | string |
`index` | number |

**Returns:** *void*

___

###  Validate

▸ **Validate**(`func`: Function | string): *(Anonymous function)*

Defined in src/decorators/RouteDecorators.ts:256

Indicates a validation function to execute in order to verify an incoming requests payload.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`func` | Function &#124; string | The validation function to execute that will verify the request payload.  |

**Returns:** *(Anonymous function)*

___

###  marshall

▸ **marshall**(`req`: any, `res`: any): *any*

Defined in src/behaviors/DefaultBehaviors.ts:13

Sends a `200 OK` response to the client containing a JSON body back to the client. The body to encode is determined
by the `result` property as set on the `res` argument. If no `result` property is found then a `204 NO_CONTENT`
response is sent instead.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`req` | any | The original HTTP request from the client. |
`res` | any | The outgoing HTTP response that will be sent to the client.  |

**Returns:** *any*
