**[@composer-js/service-core](../README.md)**

> [Globals](../globals.md) / Server

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
import { DefaultBehaviors, RouteDecorators } from "@composer-js/service_core";
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
import { DefaultBehaviors, ModelDecorators, ModelRoute, RouteDecorators } from "@composer-js/service_core";
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

* [apiSpec](server.md#apispec)
* [app](server.md#app)
* [basePath](server.md#basepath)
* [config](server.md#config)
* [logger](server.md#logger)
* [objectFactory](server.md#objectfactory)
* [port](server.md#port)
* [routeUtils](server.md#routeutils)
* [server](server.md#server)
* [serviceManager](server.md#servicemanager)
* [wss](server.md#wss)
* [metricCompletedRequests](server.md#metriccompletedrequests)
* [metricFailedRequests](server.md#metricfailedrequests)
* [metricRequestPath](server.md#metricrequestpath)
* [metricRequestStatus](server.md#metricrequeststatus)
* [metricRequestTime](server.md#metricrequesttime)
* [metricTotalRequests](server.md#metrictotalrequests)

### Methods

* [getApplication](server.md#getapplication)
* [getServer](server.md#getserver)
* [injectProperties](server.md#injectproperties)
* [instantiateRoute](server.md#instantiateroute)
* [isRunning](server.md#isrunning)
* [restart](server.md#restart)
* [start](server.md#start)
* [stop](server.md#stop)

## Constructors

### constructor

\+ **new Server**(`config`: any, `apiSpec?`: any, `basePath?`: string, `logger?`: any, `objectFactory?`: [ObjectFactory](objectfactory.md)): [Server](server.md)

*Defined in src/Server.ts:188*

Creates a new instance of Server with the specified defaults.

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`config` | any | - | The nconf-compatible configuration object to initialize the server with. |
`apiSpec?` | any | - | The optional OpenAPI specification object to initialize the server with. |
`basePath` | string | "." | The base file system path that models and routes will be searched from. |
`logger` | any | Logger() | The logging utility to use for outputing to console/file. |
`objectFactory?` | [ObjectFactory](objectfactory.md) | - | The object factory to use for automatic dependency injection (IOC).  |

**Returns:** [Server](server.md)

## Properties

### apiSpec

• `Protected` `Optional` `Readonly` **apiSpec**: any

*Defined in src/Server.ts:139*

The OpenAPI specification object to use to construct the server with.

___

### app

• `Protected` **app**: Application

*Defined in src/Server.ts:141*

The underlying ExpressJS application that provides HTTP processing services.

___

### basePath

• `Protected` `Readonly` **basePath**: string

*Defined in src/Server.ts:143*

The base file system path that will be searched for models and routes.

___

### config

• `Protected` `Optional` `Readonly` **config**: any

*Defined in src/Server.ts:145*

The global object containing configuration information to use.

___

### logger

• `Protected` `Readonly` **logger**: any

*Defined in src/Server.ts:147*

The logging utility to use when outputing to console/file.

___

### objectFactory

• `Protected` `Readonly` **objectFactory**: [ObjectFactory](objectfactory.md)

*Defined in src/Server.ts:149*

The object factory to use when injecting dependencies.

___

### port

• `Readonly` **port**: number

*Defined in src/Server.ts:151*

The port that the server is listening on.

___

### routeUtils

• `Protected` `Optional` **routeUtils**: [RouteUtils](routeutils.md)

*Defined in src/Server.ts:152*

___

### server

• `Protected` `Optional` **server**: http.Server

*Defined in src/Server.ts:154*

The underlying HTTP server instance.

___

### serviceManager

• `Protected` `Optional` **serviceManager**: [BackgroundServiceManager](backgroundservicemanager.md)

*Defined in src/Server.ts:155*

___

### wss

• `Protected` `Optional` **wss**: WebSocketServer

*Defined in src/Server.ts:157*

The underlying WebSocket server instance.

___

### metricCompletedRequests

▪ `Static` `Protected` **metricCompletedRequests**: Counter\<string> = new prom.Counter({ name: "num\_completed\_requests", help: "The total number of successfully completed requests.", })

*Defined in src/Server.ts:177*

___

### metricFailedRequests

▪ `Static` `Protected` **metricFailedRequests**: Counter\<string> = new prom.Counter({ name: "num\_failed\_requests", help: "The total number of failed requests.", })

*Defined in src/Server.ts:181*

___

### metricRequestPath

▪ `Static` `Protected` **metricRequestPath**: Histogram\<string> = new prom.Histogram({ name: "request\_path", help: "A histogram of the number of handled requests by the requested path.", labelNames: ["path"], })

*Defined in src/Server.ts:162*

___

### metricRequestStatus

▪ `Static` `Protected` **metricRequestStatus**: Histogram\<string> = new prom.Histogram({ name: "request\_status", help: "A histogram of the resulting status code of handled requests by the requested path.", labelNames: ["path", "code"], })

*Defined in src/Server.ts:167*

___

### metricRequestTime

▪ `Static` `Protected` **metricRequestTime**: Summary\<string> = new prom.Summary({ name: "request\_time", help: "A histogram of the response time of handled requests by the requested path.", labelNames: ["path"], })

*Defined in src/Server.ts:172*

___

### metricTotalRequests

▪ `Static` `Protected` **metricTotalRequests**: Counter\<string> = new prom.Counter({ name: "num\_total\_requests", help: "The total number of requests processed.", })

*Defined in src/Server.ts:185*

## Methods

### getApplication

▸ **getApplication**(): Application

*Defined in src/Server.ts:218*

Returns the express app.

**Returns:** Application

___

### getServer

▸ **getServer**(): Server \| undefined

*Defined in src/Server.ts:225*

Returns the http server.

**Returns:** Server \| undefined

___

### injectProperties

▸ `Protected`**injectProperties**(`clazz`: any, `obj`: any): Promise\<void>

*Defined in src/Server.ts:242*

Injects all known dependencies into the given object based on the property decorators.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`clazz` | any | The class type of the object to inject. |
`obj` | any | The object whose dependencies will be injected.  |

**Returns:** Promise\<void>

___

### instantiateRoute

▸ `Protected`**instantiateRoute**(`classDef`: any): Promise\<any>

*Defined in src/Server.ts:263*

Intantiates the given route class definition into an object that can be registered to Express.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`classDef` | any | The class definition of the route to instantiate. |

**Returns:** Promise\<any>

A new instance of the provided class definition that implements the Route interface.

___

### isRunning

▸ **isRunning**(): boolean

*Defined in src/Server.ts:232*

Returns `true` if the server is running, otherwise `false`.

**Returns:** boolean

___

### restart

▸ **restart**(): Promise\<void>

*Defined in src/Server.ts:508*

Restarts the HTTP listen server using the provided configuration and OpenAPI specification.

**Returns:** Promise\<void>

___

### start

▸ **start**(): Promise\<void>

*Defined in src/Server.ts:277*

Starts an HTTP listen server based on the provided configuration and OpenAPI specification.

**Returns:** Promise\<void>

___

### stop

▸ **stop**(): Promise\<void>

*Defined in src/Server.ts:469*

Stops the HTTP listen server.

**Returns:** Promise\<void>
