**[@composer-js/service-core](../README.md)**

> [Globals](../globals.md) / RoutesScanner

# Class: RoutesScanner

The `RouteScanner` is a utility class for loading all class files from a specified file path on the system that has
the `@Route` decorator. The resulting scan returns the list of all matching classes that can be instantiated and
registered to an Express application.

**`author`** Jean-Philippe Steinmetz

## Hierarchy

* **RoutesScanner**

## Index

### Constructors

* [constructor](routesscanner.md#constructor)

### Properties

* [apiSpec](routesscanner.md#apispec)
* [classLoader](routesscanner.md#classloader)

### Methods

* [implementsRoute](routesscanner.md#implementsroute)
* [scan](routesscanner.md#scan)

## Constructors

### constructor

\+ **new RoutesScanner**(`path`: string): [RoutesScanner](routesscanner.md)

*Defined in src/RoutesScanner.ts:18*

Instantiates a new RoutesScanner with the given defaults.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`path` | string | The file path to use when searching for route classes.  |

**Returns:** [RoutesScanner](routesscanner.md)

## Properties

### apiSpec

• `Protected` **apiSpec**: any = null

*Defined in src/RoutesScanner.ts:18*

The OpenAPI specification to reference.

___

### classLoader

• `Protected` **classLoader**: ClassLoader

*Defined in src/RoutesScanner.ts:16*

The class loader used to search and load route classes.

## Methods

### implementsRoute

▸ `Private`**implementsRoute**(`clazz`: any): boolean

*Defined in src/RoutesScanner.ts:34*

Determines if the provided class implements the `@Route` decorator.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`clazz` | any | The class to check. |

**Returns:** boolean

`true` if the class implements the `@Route` decorator, otherwise `false`.

___

### scan

▸ **scan**(): Promise\<Array\<any>>

*Defined in src/RoutesScanner.ts:43*

Scans the file system for all classes that implement the `@Route` decorator and returns the list of all found
route class definitions.

**Returns:** Promise\<Array\<any>>
