**[@composer-js/service-core](../README.md)**

> [Globals](../globals.md) / RouteUtils

# Class: RouteUtils

Provides a set of utilities for converting Route classes to ExpressJS middleware.

**`author`** Jean-Philippe Steinmetz <info@acceleratxr.com>

## Hierarchy

* **RouteUtils**

## Index

### Methods

* [checkRequiredPerms](routeutils.md#checkrequiredperms)
* [checkRequiredRoles](routeutils.md#checkrequiredroles)
* [getFuncArray](routeutils.md#getfuncarray)
* [getRouteMethods](routeutils.md#getroutemethods)
* [registerRoute](routeutils.md#registerroute)
* [wrapMiddleware](routeutils.md#wrapmiddleware)

## Methods

### checkRequiredPerms

▸ **checkRequiredPerms**(): RequestHandler

*Defined in src/express/RouteUtils.ts:20*

Creates an Express middleware function that verifies the incoming request is from a valid user with at least
one of the specified roles.

**Returns:** RequestHandler

___

### checkRequiredRoles

▸ **checkRequiredRoles**(`requiredRoles`: string[]): RequestHandler

*Defined in src/express/RouteUtils.ts:38*

Creates an Express middleware function that verifies the incoming request is from a valid user with at least
one of the specified roles.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`requiredRoles` | string[] | The list of roles that the authenticated user must have.  |

**Returns:** RequestHandler

___

### getFuncArray

▸ **getFuncArray**(`route`: any, `funcs`: (Function \| string)[], `send?`: boolean): RequestHandler[]

*Defined in src/express/RouteUtils.ts:58*

Converts the given array of string or Function objects to functions bound to the given route object.

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`route` | any | - | The route object that the list of functions is bound to. |
`funcs` | (Function \| string)[] | - | The array of functions (or function names) to return. |
`send` | boolean | false | Set to true to have the last wrapped function send its payload to the client. |

**Returns:** RequestHandler[]

An array of Function objects mapping to the route object.

___

### getRouteMethods

▸ **getRouteMethods**(`route`: any): Map\<string, any>

*Defined in src/express/RouteUtils.ts:81*

Searches an route object for any functions that implement a `@Method` decorator.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`route` | any | The route object to search. |

**Returns:** Map\<string, any>

The list of `@Method` decorated functions that were found.

___

### registerRoute

▸ **registerRoute**(`app`: any, `route`: any): void

*Defined in src/express/RouteUtils.ts:110*

Registers the provided route object containing a set of decorated endpoints to the server.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`app` | any | The Express application to register the route to. |
`route` | any | The route object to register with Express.  |

**Returns:** void

___

### wrapMiddleware

▸ **wrapMiddleware**(`obj`: any, `func`: Function, `send?`: boolean): RequestHandler

*Defined in src/express/RouteUtils.ts:205*

Wraps the provided function with Express handling based on the function's defined decorators.

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`obj` | any | - | The bound object whose middleware function will be wrapped. |
`func` | Function | - | - |
`send` | boolean | false | Set to true to have `func`'s result sent to the client.  |

**Returns:** RequestHandler
