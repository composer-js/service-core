[@acceleratxr/service-core](../README.md) › [Globals](../globals.md) › [Server](server.md)

# Class: Server

Provides an HTTP server utilizing ExpressJS and PassportJS. The server automatically registers all routes, and
establishes database connections for all configured data stores. Additionally provides automatic authentication
handling using JSON Web Token (JWT) via PassportJS. When provided an OpenAPI specificatiion object the server will
also automatically serve this specification via the `GET /openapi.json` route.

Routes are defined by creating any class definition using the various decorators found in `RouteDecorators` and
saving these files in the `routes` subfolder. Upon server start, the `routes` folder is scanned for any class
that has been decorated with `@Route` and is automatically loaded and registered with Express. Similarly, if the
class is decorated with the `@Model` decorator the resulting route object will have the associated data model
definition object injected into the constructor.

By default all registered endpoints that do not explicit have an `@Auth` decorator have the `JWT` authentication
strategy applied. This allows users to be implicitly authenticated without requiring additional configuration.
Once authenticated, the provided `request` argument will have the `user` property available containing information
about the authenticated user. If the `user` property is `undefined` then no user has been authenticated or the
authentication attempt failed.

The following is an example of a simple route class.

```javascript
import { DefaultBehaviors, RouteDecorators } from "@acceleratxr/service_core";
import { Get, Route } = RouteDecorators;

@Route("/hello")
class TestRoute extends ModelRoute {
constructor(model: any) {
super(model);
}

@Get()
count(req: any, res: any, next: Function): any {
return res.send("Hello World!");
}
}

export default TestRoute;
```

The following is an example of a route class that is bound to a data model providing basic CRUDS operations.

```javascript
import { DefaultBehaviors, ModelDecorators, ModelRoute, RouteDecorators } from "@acceleratxr/service_core";
import { After, Before, Delete, Get, Post, Put, Route, Validate } = RouteDecorators;
import { Model } = ModelDecorators;
import { marshall } = DefaultBehaviors;

@Model("Item")
@Route("/items")
class ItemRoute extends ModelRoute {
constructor(model: any) {
super(model);
}

@Get()
@Before(super.count)
@After(marshall)
count(req: any, res: any, next: Function): any {
return next();
}

@Post()
@Before([super.create])
@After([this.prepare, marshall])
create(req: any, res: any, next: Function): any {
return next();
}

@Delete(":id")
@Before([super.delete])
delete(req: any, res: any, next: Function): any {
return next();
}

@Get()
@Before([super.findAll])
@After(this.prepareAndSend)
findAll(req: any, res: any, next: Function): any {
return next();
}

@Get(":id")
@Before([super.findById])
@After([this.prepare, marshall])
findById(req: any, res: any, next: Function): any {
return next();
}

@Put(":id")
@Before([super.update])
@After([this.prepare, marshall])
update(req: any, res: any, next: Function): any {
return next();
}
}

export default ItemRoute;
```

**`author`** Jean-Philippe Steinmetz

## Hierarchy

* **Server**

## Index

### Constructors

* [constructor](server.md#constructor)

### Properties

* [aclRepo](server.md#protected-optional-readonly-aclrepo)
* [apiSpec](server.md#protected-optional-readonly-apispec)
* [app](server.md#protected-app)
* [basePath](server.md#protected-readonly-basepath)
* [config](server.md#protected-optional-readonly-config)
* [eventListenerManager](server.md#protected-optional-eventlistenermanager)
* [logger](server.md#protected-readonly-logger)
* [objectFactory](server.md#protected-readonly-objectfactory)
* [port](server.md#readonly-port)
* [scriptManager](server.md#protected-optional-scriptmanager)
* [server](server.md#protected-optional-server)
* [serviceManager](server.md#protected-optional-servicemanager)
* [metricCompletedRequests](server.md#static-protected-metriccompletedrequests)
* [metricFailedRequests](server.md#static-protected-metricfailedrequests)
* [metricRequestPath](server.md#static-protected-metricrequestpath)
* [metricRequestStatus](server.md#static-protected-metricrequeststatus)
* [metricRequestTime](server.md#static-protected-metricrequesttime)
* [metricTotalRequests](server.md#static-protected-metrictotalrequests)

### Methods

* [checkRequiredPerms](server.md#protected-checkrequiredperms)
* [checkRequiredRoles](server.md#protected-checkrequiredroles)
* [getApplication](server.md#getapplication)
* [getFuncArray](server.md#protected-getfuncarray)
* [getInitMethods](server.md#protected-getinitmethods)
* [getRouteMethods](server.md#protected-getroutemethods)
* [injectProperties](server.md#protected-injectproperties)
* [instantiateRoute](server.md#protected-instantiateroute)
* [isRunning](server.md#isrunning)
* [registerRoute](server.md#registerroute)
* [restart](server.md#restart)
* [start](server.md#start)
* [stop](server.md#stop)
* [wrapRequestHandler](server.md#protected-wraprequesthandler)

## Constructors

###  constructor

\+ **new Server**(`config`: any, `apiSpec?`: any, `basePath`: string, `logger`: any, `objectFactory`: [ObjectFactory](objectfactory.md)): *[Server](server.md)*

Defined in src/Server.ts:202

Creates a new instance of Server with the specified defaults.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`config` | any | - | The nconf-compatible configuration object to initialize the server with. |
`apiSpec?` | any | - | The optional OpenAPI specification object to initialize the server with. |
`basePath` | string | "." | The base file system path that models and routes will be searched from. |
`logger` | any | Logger() | The logging utility to use for outputing to console/file. |
`objectFactory` | [ObjectFactory](objectfactory.md) | new ObjectFactory(config, Logger()) | The object factory to use for automatic dependency injection (IOC).  |

**Returns:** *[Server](server.md)*

## Properties

### `Protected` `Optional` `Readonly` aclRepo

• **aclRepo**? : *Repository‹[AccessControlListSQL](accesscontrollistsql.md)› | MongoRepository‹[AccessControlListMongo](accesscontrollistmongo.md)›*

Defined in src/Server.ts:150

The repository to the access control lists.

___

### `Protected` `Optional` `Readonly` apiSpec

• **apiSpec**? : *any*

Defined in src/Server.ts:152

The OpenAPI specification object to use to construct the server with.

___

### `Protected` app

• **app**: *Application*

Defined in src/Server.ts:154

The underlying ExpressJS application that provides HTTP processing services.

___

### `Protected` `Readonly` basePath

• **basePath**: *string*

Defined in src/Server.ts:156

The base file system path that will be searched for models and routes.

___

### `Protected` `Optional` `Readonly` config

• **config**? : *any*

Defined in src/Server.ts:158

The global object containing configuration information to use.

___

### `Protected` `Optional` eventListenerManager

• **eventListenerManager**? : *[EventListenerManager](eventlistenermanager.md)*

Defined in src/Server.ts:160

The manager for handling events.

___

### `Protected` `Readonly` logger

• **logger**: *any*

Defined in src/Server.ts:162

The logging utility to use when outputing to console/file.

___

### `Protected` `Readonly` objectFactory

• **objectFactory**: *[ObjectFactory](objectfactory.md)*

Defined in src/Server.ts:164

The object factory to use when injecting dependencies.

___

### `Readonly` port

• **port**: *number*

Defined in src/Server.ts:166

The port that the server is listening on.

___

### `Protected` `Optional` scriptManager

• **scriptManager**? : *[ScriptManager](scriptmanager.md)*

Defined in src/Server.ts:171

The utility class that manages all service scripts.

___

### `Protected` `Optional` server

• **server**? : *http.Server*

Defined in src/Server.ts:168

The underlying HTTP server instance.

___

### `Protected` `Optional` serviceManager

• **serviceManager**? : *[BackgroundServiceManager](backgroundservicemanager.md)*

Defined in src/Server.ts:169

___

### `Static` `Protected` metricCompletedRequests

▪ **metricCompletedRequests**: *Counter* = new prom.Counter({
        name: "num_completed_requests",
        help: "The total number of successfully completed requests.",
    })

Defined in src/Server.ts:191

___

### `Static` `Protected` metricFailedRequests

▪ **metricFailedRequests**: *Counter* = new prom.Counter({
        name: "num_failed_requests",
        help: "The total number of failed requests.",
    })

Defined in src/Server.ts:195

___

### `Static` `Protected` metricRequestPath

▪ **metricRequestPath**: *Histogram* = new prom.Histogram({
        name: "request_path",
        help: "A histogram of the number of handled requests by the requested path.",
        labelNames: ["path"],
    })

Defined in src/Server.ts:176

___

### `Static` `Protected` metricRequestStatus

▪ **metricRequestStatus**: *Histogram* = new prom.Histogram({
        name: "request_status",
        help: "A histogram of the resulting status code of handled requests by the requested path.",
        labelNames: ["path", "code"],
    })

Defined in src/Server.ts:181

___

### `Static` `Protected` metricRequestTime

▪ **metricRequestTime**: *Summary* = new prom.Summary({
        name: "request_time",
        help: "A histogram of the response time of handled requests by the requested path.",
        labelNames: ["path"],
    })

Defined in src/Server.ts:186

___

### `Static` `Protected` metricTotalRequests

▪ **metricTotalRequests**: *Counter* = new prom.Counter({
        name: "num_total_requests",
        help: "The total number of requests processed.",
    })

Defined in src/Server.ts:199

## Methods

### `Protected` checkRequiredPerms

▸ **checkRequiredPerms**(): *RequestHandler*

Defined in src/Server.ts:298

Creates an Express middleware function that verifies the incoming request is from a valid user with at least
one of the specified roles.

**Returns:** *RequestHandler*

___

### `Protected` checkRequiredRoles

▸ **checkRequiredRoles**(`requiredRoles`: string[]): *RequestHandler*

Defined in src/Server.ts:282

Creates an Express middleware function that verifies the incoming request is from a valid user with at least
one of the specified roles.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`requiredRoles` | string[] | The list of roles that the authenticated user must have.  |

**Returns:** *RequestHandler*

___

###  getApplication

▸ **getApplication**(): *Application*

Defined in src/Server.ts:265

Returns the express app

**Returns:** *Application*

___

### `Protected` getFuncArray

▸ **getFuncArray**(`route`: any, `funcs`: (string | Function)[], `send`: boolean): *RequestHandler[]*

Defined in src/Server.ts:426

Converts the given array of string or Function objects to functions bound to the given route object.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`route` | any | - | The route object that the list of functions is bound to. |
`funcs` | (string &#124; Function)[] | - | The array of functions (or function names) to return. |
`send` | boolean | false | Set to true to have the last wrapped function send its payload to the client. |

**Returns:** *RequestHandler[]*

An array of Function objects mapping to the route object.

___

### `Protected` getInitMethods

▸ **getInitMethods**(`route`: any): *Function[]*

Defined in src/Server.ts:449

Searches an route object for one or more functions that implement a `@Init` decorator.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`route` | any | The route object to search. |

**Returns:** *Function[]*

The list of functions that implements the `@Init` decorator if found, otherwise undefined.

___

### `Protected` getRouteMethods

▸ **getRouteMethods**(`route`: any): *Map‹string, any›*

Defined in src/Server.ts:481

Searches an route object for any functions that implement a `@Method` decorator.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`route` | any | The route object to search. |

**Returns:** *Map‹string, any›*

The list of `@Method` decorated functions that were found.

___

### `Protected` injectProperties

▸ **injectProperties**(`clazz`: any, `obj`: any): *void*

Defined in src/Server.ts:316

Injects all known dependencies into the given object based on the property decorators.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`clazz` | any | The class type of the object to inject. |
`obj` | any | The object whose dependencies will be injected.  |

**Returns:** *void*

___

### `Protected` instantiateRoute

▸ **instantiateRoute**(`classDef`: any): *any*

Defined in src/Server.ts:409

Intantiates the given route class definition into an object that can be registered to Express.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`classDef` | any | The class definition of the route to instantiate. |

**Returns:** *any*

A new instance of the provided class definition that implements the Route interface.

___

###  isRunning

▸ **isRunning**(): *boolean*

Defined in src/Server.ts:272

Returns `true` if the server is running, otherwise `false`.

**Returns:** *boolean*

___

###  registerRoute

▸ **registerRoute**(`route`: any): *void*

Defined in src/Server.ts:509

Registers the provided route object containing a set of decorated endpoints to the server.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`route` | any | The route object to register with Express.  |

**Returns:** *void*

___

###  restart

▸ **restart**(): *Promise‹unknown›*

Defined in src/Server.ts:821

Restarts the HTTP listen server using the provided configuration and OpenAPI specification.

**Returns:** *Promise‹unknown›*

___

###  start

▸ **start**(): *Promise‹unknown›*

Defined in src/Server.ts:594

Starts an HTTP listen server based on the provided configuration and OpenAPI specification.

**Returns:** *Promise‹unknown›*

___

###  stop

▸ **stop**(): *Promise‹unknown›*

Defined in src/Server.ts:793

Stops the HTTP listen server.

**Returns:** *Promise‹unknown›*

___

### `Protected` wrapRequestHandler

▸ **wrapRequestHandler**(`obj`: any, `func`: Function, `send`: boolean): *RequestHandler*

Defined in src/Server.ts:833

Wraps the provided function with Express handling based on the function's defined decorators.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`obj` | any | - | The object whose scope will be bound to when executing the function. |
`func` | Function | - | - |
`send` | boolean | false | Set to true to have `func`'s result sent to the client.  |

**Returns:** *RequestHandler*
