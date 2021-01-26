**[@composer-js/service-core](../README.md)**

> [Globals](../globals.md) / OpenAPIRoute

# Class: OpenAPIRoute

The `OpenAPIController` provides a default route to `/openapi.json` that exposes a provided OpenAPI
specification to requesting clients.

**`author`** Jean-Philippe Steinmetz

## Hierarchy

* **OpenAPIRoute**

## Index

### Constructors

* [constructor](openapiroute.md#constructor)

### Properties

* [apiSpec](openapiroute.md#apispec)

### Methods

* [get](openapiroute.md#get)
* [getJSON](openapiroute.md#getjson)

## Constructors

### constructor

\+ **new OpenAPIRoute**(`apiSpec`: any): [OpenAPIRoute](openapiroute.md)

*Defined in src/routes/OpenAPIRoute.ts:17*

Constructs a new `OpenAPIController` object with the specified defaults.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`apiSpec` | any | The OpenAPI specification object to serve.  |

**Returns:** [OpenAPIRoute](openapiroute.md)

## Properties

### apiSpec

• `Private` **apiSpec**: any

*Defined in src/routes/OpenAPIRoute.ts:17*

The underlying OpenAPI specification.

## Methods

### get

▸ `Private`**get**(): any

*Defined in src/routes/OpenAPIRoute.ts:30*

**Returns:** any

___

### getJSON

▸ `Private`**getJSON**(): any

*Defined in src/routes/OpenAPIRoute.ts:35*

**Returns:** any
