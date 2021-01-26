**[@composer-js/service-core](README.md)**

> Globals

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
* [ObjectFactory](classes/objectfactory.md)
* [OpenAPIRoute](classes/openapiroute.md)
* [Options](classes/options.md)
* [RepoUtils](classes/repoutils.md)
* [RouteUtils](classes/routeutils.md)
* [RoutesScanner](classes/routesscanner.md)
* [Server](classes/server.md)
* [SimpleMongoEntity](classes/simplemongoentity.md)

### Interfaces

* [ACLRecord](interfaces/aclrecord.md)
* [AccessControlList](interfaces/accesscontrollist.md)
* [Entity](interfaces/entity.md)
* [RequestWS](interfaces/requestws.md)

### Variables

* [CACHE\_BASE\_KEY](globals.md#cache_base_key)
* [cookieParser](globals.md#cookieparser)
* [cors](globals.md#cors)
* [express](globals.md#express)
* [instance](globals.md#instance)
* [logger](globals.md#logger)
* [passport](globals.md#passport)
* [swagger](globals.md#swagger)
* [uuid](globals.md#uuid)

### Functions

* [After](globals.md#after)
* [Auth](globals.md#auth)
* [Before](globals.md#before)
* [Cache](globals.md#cache)
* [Config](globals.md#config)
* [ContentType](globals.md#contenttype)
* [Delete](globals.md#delete)
* [Destroy](globals.md#destroy)
* [Get](globals.md#get)
* [Head](globals.md#head)
* [Header](globals.md#header)
* [Identifier](globals.md#identifier)
* [Init](globals.md#init)
* [Inject](globals.md#inject)
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
* [Socket](globals.md#socket)
* [TrackChanges](globals.md#trackchanges)
* [User](globals.md#user)
* [Validate](globals.md#validate)
* [WebSocket](globals.md#websocket)
* [addWebSocket](globals.md#addwebsocket)
* [marshall](globals.md#marshall)

## Variables

### CACHE\_BASE\_KEY

• `Const` **CACHE\_BASE\_KEY**: string = "db.cache.AccessControlList"

*Defined in src/security/ACLUtils.ts:14*

___

### cookieParser

• `Const` **cookieParser**: any = require("cookie-parser")

*Defined in src/Server.ts:4*

___

### cors

• `Const` **cors**: any = require("cors")

*Defined in src/Server.ts:5*

___

### express

• `Const` **express**: any = require("express")

*Defined in src/Server.ts:6*

___

### instance

• `Const` **instance**: [ACLUtils](classes/aclutils.md) = new ACLUtils()

*Defined in src/security/ACLUtils.ts:371*

___

### logger

• `Const` **logger**: any = Logger()

*Defined in src/database/ConnectionManager.ts:8*

*Defined in src/models/ModelUtils.ts:23*

___

### passport

• `Const` **passport**: any = require("passport")

*Defined in src/Server.ts:8*

*Defined in src/express/RouteUtils.ts:8*

___

### swagger

• `Const` **swagger**: any = require("swagger-ui-express")

*Defined in src/routes/OpenAPIRoute.ts:6*

___

### uuid

• `Const` **uuid**: any = require("uuid")

*Defined in src/models/BaseEntity.ts:6*

*Defined in src/models/SimpleEntity.ts:6*

*Defined in src/ObjectFactory.ts:9*

## Functions

### After

▸ **After**(`func`: Function \| string \| (Function \| string)[]): (Anonymous function)

*Defined in src/decorators/RouteDecorators.ts:12*

Indicates a provided function or list of functions to execute *after* the decorated function and before the response
is sent to a client. Note that the function must call `next()` in order for this decorator to work.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`func` | Function \| string \| (Function \| string)[] | The function or list of functions to execute *after* the decorated function.  |

**Returns:** (Anonymous function)

___

### Auth

▸ **Auth**(`strategies`: string \| string[], `require?`: boolean): (Anonymous function)

*Defined in src/decorators/RouteDecorators.ts:32*

Applies PassportJS authentication to the decorated route or method for the provided strategy or list of strategies
should be attempted before processing the route.

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`strategies` | string \| string[] | - | The PassportJS strategies that will be applied when incoming requests are processed. |
`require` | boolean | true | Set to `true` to indicate that at least one of the specified authentication strategies must pass to                proceed, otherwise set to `false`. Default is `true`.  |

**Returns:** (Anonymous function)

___

### Before

▸ **Before**(`func`: Function \| string \| (Function \| string)[]): (Anonymous function)

*Defined in src/decorators/RouteDecorators.ts:46*

Indicates a provided function or list of functions to execute *before* the decorated function.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`func` | Function \| string \| (Function \| string)[] | The function or list of functions to execute *before* the decorated function.  |

**Returns:** (Anonymous function)

___

### Cache

▸ **Cache**(`ttl?`: number): (Anonymous function)

*Defined in src/decorators/ModelDecorators.ts:11*

Indicates that the class is cacheable with the specified TTL.

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`ttl` | number | 30 |

**Returns:** (Anonymous function)

___

### Config

▸ **Config**(`path?`: undefined \| string): (Anonymous function)

*Defined in src/decorators/ObjectDecorators.ts:50*

Apply this to a property to have a configuration variable be injected at instantiation. If no path is given, the
global configuration object is injected.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`path?` | undefined \| string | The path to the configuration variable to inject.  |

**Returns:** (Anonymous function)

___

### ContentType

▸ **ContentType**(`type`: string): (Anonymous function)

*Defined in src/decorators/RouteDecorators.ts:63*

Indicates that the decorated function will return content encoded with the specified content type.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`type` | string | The content type that the function will return.  |

**Returns:** (Anonymous function)

___

### Delete

▸ **Delete**(`path?`: undefined \| string): (Anonymous function)

*Defined in src/decorators/RouteDecorators.ts:76*

Indicates that the decorated function handles incoming `DELETE` requests at the given sub-path.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`path?` | undefined \| string | The sub-path that the route will handle requests for.  |

**Returns:** (Anonymous function)

___

### Destroy

▸ **Destroy**(`target`: any, `propertyKey`: string): void

*Defined in src/decorators/ObjectDecorators.ts:9*

Apply this to a class function to mark it as a destructor to be called by the `ObjectFactory` during cleanup.

#### Parameters:

Name | Type |
------ | ------ |
`target` | any |
`propertyKey` | string |

**Returns:** void

___

### Get

▸ **Get**(`path?`: undefined \| string): (Anonymous function)

*Defined in src/decorators/RouteDecorators.ts:85*

Indicates that the decorated function handles incoming `GET` requests at the given sub-path.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`path?` | undefined \| string | The sub-path that the route will handle requests for.  |

**Returns:** (Anonymous function)

___

### Head

▸ **Head**(`path?`: undefined \| string): (Anonymous function)

*Defined in src/decorators/RouteDecorators.ts:94*

Indicates that the decorated function handles incoming `HEAD` requests at the given sub-path.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`path?` | undefined \| string | The sub-path that the route will handle requests for.  |

**Returns:** (Anonymous function)

___

### Header

▸ **Header**(`name`: string): (Anonymous function)

*Defined in src/decorators/RouteDecorators.ts:103*

Injects the value of the specified request header with the given name as the value of the decorated argument.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`name` | string | The name of the header whose value will be injected.  |

**Returns:** (Anonymous function)

___

### Identifier

▸ **Identifier**(`target`: any, `propertyKey`: string \| symbol): void

*Defined in src/decorators/ModelDecorators.ts:25*

Apply this to a property that is considered a unique identifier.

#### Parameters:

Name | Type |
------ | ------ |
`target` | any |
`propertyKey` | string \| symbol |

**Returns:** void

___

### Init

▸ **Init**(`target`: any, `propertyKey`: string, `descriptor`: PropertyDescriptor): void

*Defined in src/decorators/ObjectDecorators.ts:40*

Apply this to a function to be executed once a new object instance has been created and all dependencies injected.
Note: If the decorated function returns a Promise it is not gauranteed to finish execution before the object is
returned during the instantiation process.

#### Parameters:

Name | Type |
------ | ------ |
`target` | any |
`propertyKey` | string |
`descriptor` | PropertyDescriptor |

**Returns:** void

___

### Inject

▸ **Inject**(`type`: any, `name?`: string \| undefined, ...`args`: any): (Anonymous function)

*Defined in src/decorators/ObjectDecorators.ts:20*

Injects an object instance to the decorated property of the given name and type using the provided arguments
if no object has been created yet.

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`type` | any | - | The name or type of the class instance to inject. |
`name` | string \| undefined | "default" | The unique name of the object to inject. Set to `undefined` to force a new instance to be created. Default value is `default`. |
`...args` | any | - | The constructor arguments to use if the object hasn't been created before.  |

**Returns:** (Anonymous function)

___

### Logger

▸ **Logger**(`target`: any, `propertyKey`: string \| symbol): void

*Defined in src/decorators/ObjectDecorators.ts:65*

Apply this to a property to have the logger utility injected at instantiation.

#### Parameters:

Name | Type |
------ | ------ |
`target` | any |
`propertyKey` | string \| symbol |

**Returns:** void

___

### Method

▸ **Method**(`method`: string \| string[], `path?`: undefined \| string): (Anonymous function)

*Defined in src/decorators/RouteDecorators.ts:124*

Indicates that the decorated function handles incoming HTTP requests for the specified HTTP method(s) at the given sub-path.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`method` | string \| string[] | - |
`path?` | undefined \| string | The sub-path that the route handles requests for.  |

**Returns:** (Anonymous function)

___

### Model

▸ **Model**(`datastore`: string): (Anonymous function)

*Defined in src/decorators/ModelDecorators.ts:40*

Indicates that the class describes an entity that will be persisted in the datastore with the given name.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`datastore` | string | The name of the datastore to store records of the decorated class.  |

**Returns:** (Anonymous function)

___

### MongoRepository

▸ **MongoRepository**(`type`: any): (Anonymous function)

*Defined in src/decorators/RouteDecorators.ts:216*

Apply this to a property to have the TypeORM `MongoRepository` for the given entity type injected at instantiation.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`type` | any | The entity type whose repository will be injected.  |

**Returns:** (Anonymous function)

___

### Param

▸ **Param**(`name?`: string \| undefined): (Anonymous function)

*Defined in src/decorators/RouteDecorators.ts:180*

Injects the value of the specified URI parameter with the given name as the value of the decorated argument. If no
name is specified the entire request parameter will be injected.

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`name` | string \| undefined | undefined | The name of the URI parameter whose value will be injected.  |

**Returns:** (Anonymous function)

___

### Post

▸ **Post**(`path?`: undefined \| string): (Anonymous function)

*Defined in src/decorators/RouteDecorators.ts:170*

Indicates that the decorated function handles incoming `POST` requests at the given sub-path.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`path?` | undefined \| string | The sub-path that the route will handle requests for.  |

**Returns:** (Anonymous function)

___

### Put

▸ **Put**(`path?`: undefined \| string): (Anonymous function)

*Defined in src/decorators/RouteDecorators.ts:193*

Indicates that the decorated function handles incoming `PUT` requests at the given sub-path.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`path?` | undefined \| string | The sub-path that the route will handle requests for.  |

**Returns:** (Anonymous function)

___

### Query

▸ **Query**(`name?`: string \| undefined): (Anonymous function)

*Defined in src/decorators/RouteDecorators.ts:203*

Injects the value of the specified query parameter with the given name as the value of the decorated argument. If
no name is specified the entire request query will be injected.

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`name` | string \| undefined | undefined | THe name of the query parameter whose value will be injected.  |

**Returns:** (Anonymous function)

___

### RedisConnection

▸ **RedisConnection**(`name`: string): (Anonymous function)

*Defined in src/decorators/RouteDecorators.ts:250*

Apply this to a property to have the `Redis` connection injected at instantiation.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`name` | string | The name of the database connection to inject.  |

**Returns:** (Anonymous function)

___

### Repository

▸ **Repository**(`type`: any): (Anonymous function)

*Defined in src/decorators/RouteDecorators.ts:233*

Apply this to a property to have the TypeORM `Repository` for the given entity type injected at instantiation.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`type` | any | The entity type whose repository will be injected.  |

**Returns:** (Anonymous function)

___

### Request

▸ **Request**(`target`: any, `propertyKey`: string, `index`: number): void

*Defined in src/decorators/RouteDecorators.ts:265*

Injects the Express request object as the value of the decorated argument.

#### Parameters:

Name | Type |
------ | ------ |
`target` | any |
`propertyKey` | string |
`index` | number |

**Returns:** void

___

### RequiresRole

▸ **RequiresRole**(`roles`: string \| string[]): (Anonymous function)

*Defined in src/decorators/RouteDecorators.ts:286*

Indicates that the client must be an authenticated user with at least one of the specified role(s) to process the
request.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`roles` | string \| string[] | The role(s) that an authenticated user must have to make the request.  |

**Returns:** (Anonymous function)

___

### Response

▸ **Response**(`target`: any, `propertyKey`: string, `index`: number): void

*Defined in src/decorators/RouteDecorators.ts:274*

Injects the Express response object as the value of the decorated argument.

#### Parameters:

Name | Type |
------ | ------ |
`target` | any |
`propertyKey` | string |
`index` | number |

**Returns:** void

___

### Route

▸ **Route**(`paths`: string \| string[]): (Anonymous function)

*Defined in src/decorators/RouteDecorators.ts:299*

Indicates that the decorated class contains Express route definitions.

#### Parameters:

Name | Type |
------ | ------ |
`paths` | string \| string[] |

**Returns:** (Anonymous function)

___

### Socket

▸ **Socket**(`target`: any, `propertyKey`: string, `index`: number): void

*Defined in src/decorators/RouteDecorators.ts:312*

Injects the underlying Socket object associated with the request as the value of the decorated argument.
When the handler function is for a WebSocket request, the returned socket will be the newly established
WebSocket connection.

#### Parameters:

Name | Type |
------ | ------ |
`target` | any |
`propertyKey` | string |
`index` | number |

**Returns:** void

___

### TrackChanges

▸ **TrackChanges**(`versions?`: number): (Anonymous function)

*Defined in src/decorators/ModelDecorators.ts:57*

Indicates that the class will track changes for each document update limited to the specified number of versions.

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`versions` | number | -1 | The number of versions that will be tracked for each document change. Set to `-1` to store all versions. Default value is `-1`.  |

**Returns:** (Anonymous function)

___

### User

▸ **User**(`target`: any, `propertyKey`: string, `index`: number): void

*Defined in src/decorators/RouteDecorators.ts:321*

Injects the authenticated user object as the value of the decorated argument.

#### Parameters:

Name | Type |
------ | ------ |
`target` | any |
`propertyKey` | string |
`index` | number |

**Returns:** void

___

### Validate

▸ **Validate**(`func`: Function \| string): (Anonymous function)

*Defined in src/decorators/RouteDecorators.ts:332*

Indicates a validation function to execute in order to verify an incoming requests payload.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`func` | Function \| string | The validation function to execute that will verify the request payload.  |

**Returns:** (Anonymous function)

___

### WebSocket

▸ **WebSocket**(`path?`: undefined \| string): (Anonymous function)

*Defined in src/decorators/RouteDecorators.ts:345*

Indicates that the decorated function handles incoming `WebSocket` upgrade requests at the given sub-path.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`path?` | undefined \| string | The sub-path that the route will handle requests for.  |

**Returns:** (Anonymous function)

___

### addWebSocket

▸ **addWebSocket**(`app`: Application, `wss`: WebSocketServer): any

*Defined in src/express/WebSocket.ts:29*

Enables and registers WebSocket support to the given Expressjs application and WebSocket server.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`app` | Application | The Expressjs application to add WebSocket support to. |
`wss` | WebSocketServer | The WebSocketServer server that will be configured for Express.  |

**Returns:** any

___

### marshall

▸ **marshall**(`req`: any, `res`: any): any

*Defined in src/behaviors/DefaultBehaviors.ts:13*

Sends a `200 OK` response to the client containing a JSON body back to the client. The body to encode is determined
by the `result` property as set on the `res` argument. If no `result` property is found then a `204 NO_CONTENT`
response is sent instead.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`req` | any | The original HTTP request from the client. |
`res` | any | The outgoing HTTP response that will be sent to the client.  |

**Returns:** any
