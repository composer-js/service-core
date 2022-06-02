**[@composer-js/service-core](../README.md)**

> [Globals](../globals.md) / ObjectFactory

# Class: ObjectFactory

The `ObjectFactory` is a manager for creating objects based on registered
class types. This allows for the tracking of multiple instances of objects
so that references can be referenced by unique name.

**`author`** Jean-Philippe Steinmetz

## Hierarchy

* **ObjectFactory**

## Index

### Constructors

* [constructor](objectfactory.md#constructor)

### Properties

* [classes](objectfactory.md#classes)
* [config](objectfactory.md#config)
* [instances](objectfactory.md#instances)
* [logger](objectfactory.md#logger)

### Methods

* [clear](objectfactory.md#clear)
* [clearAll](objectfactory.md#clearall)
* [destroy](objectfactory.md#destroy)
* [getInitMethods](objectfactory.md#getinitmethods)
* [getInstance](objectfactory.md#getinstance)
* [initialize](objectfactory.md#initialize)
* [newInstance](objectfactory.md#newinstance)
* [register](objectfactory.md#register)

## Constructors

### constructor

\+ **new ObjectFactory**(`config?`: any, `logger?`: any): [ObjectFactory](objectfactory.md)

*Defined in src/ObjectFactory.ts:33*

#### Parameters:

Name | Type |
------ | ------ |
`config?` | any |
`logger?` | any |

**Returns:** [ObjectFactory](objectfactory.md)

## Properties

### classes

• `Private` **classes**: Map\<string, any> = new Map()

*Defined in src/ObjectFactory.ts:24*

A map for string fully qualified class names to their class types.

___

### config

• `Private` **config**: any

*Defined in src/ObjectFactory.ts:27*

The global application configuration object.

___

### instances

• `Readonly` **instances**: Map\<string, any> = new Map()

*Defined in src/ObjectFactory.ts:30*

A map for the unique name to the intance of a particular class type.

___

### logger

• `Private` **logger**: any

*Defined in src/ObjectFactory.ts:33*

The application logging utility.

## Methods

### clear

▸ **clear**(): void

*Defined in src/ObjectFactory.ts:96*

Deletes all instantiated objects.

**Returns:** void

___

### clearAll

▸ **clearAll**(): void

*Defined in src/ObjectFactory.ts:103*

Deletes all instantiated objects and registered class types.

**Returns:** void

___

### destroy

▸ **destroy**(`objs?`: any \| any[]): Promise\<void>

*Defined in src/ObjectFactory.ts:45*

Destroys the specified objects. If `undefined` is passed in, all objects managed by the factory are destroyed.

#### Parameters:

Name | Type |
------ | ------ |
`objs?` | any \| any[] |

**Returns:** Promise\<void>

___

### getInitMethods

▸ **getInitMethods**(`obj`: any): Function[]

*Defined in src/ObjectFactory.ts:229*

Searches an object for one or more functions that implement a `@Init` decorator.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`obj` | any | The object to search. |

**Returns:** Function[]

The list of functions that implements the `@Init` decorator if found, otherwise undefined.

___

### getInstance

▸ **getInstance**\<T>(`nameOrType`: any): T

*Defined in src/ObjectFactory.ts:263*

Returns the object instance with the given unique name. Unique names take the form `<ClassName>:<InstanceName>`.
It is possible to only specifiy the `<ClassName>`, doing so will automatically look for the `<ClassName>:default`
instance. It is also possible to pass the class type directly, in which case the instance will be searched by
`<ClassName>:default`.

#### Type parameters:

Name |
------ |
`T` |

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`nameOrType` | any | The unique name or class type of the object to retrieve. |

**Returns:** T

The object instance associated with the given name if found, otherwise `undefined`.

___

### initialize

▸ **initialize**(`obj`: any): Promise\<void>

*Defined in src/ObjectFactory.ts:112*

Scans the given object for any properties with the @Inject decorator and assigns the correct values.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`obj` | any | The object to initialize with injected defaults  |

**Returns:** Promise\<void>

___

### newInstance

▸ **newInstance**\<T>(`type`: any, `name?`: undefined \| string, ...`args`: any): Promise\<T>

*Defined in src/ObjectFactory.ts:293*

Creates a new instance of the class specified with the provided unique name or type and constructor arguments. If an existing
object has already been created with the given name, that instance is returned, otherwise a new instance is created
using the provided arguments.

#### Type parameters:

Name |
------ |
`T` |

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`type` | any | The fully qualified name or type of the class to instantiate. If a type is given it's class name will be inferred              via the constructor name. |
`name?` | undefined \| string | The unique name to give the class instance. Set to `undefined` if you wish to force a new object              is created. |
`...args` | any | The set of constructor arguments to use during construction  |

**Returns:** Promise\<T>

___

### register

▸ **register**(`clazz`: any, `fqn?`: undefined \| string): void

*Defined in src/ObjectFactory.ts:354*

Registers the given class type for the provided fully qualified name.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`clazz` | any | The class type to register. |
`fqn?` | undefined \| string | The fully qualified name of the class to register. If not specified, the class name will be used.  |

**Returns:** void
