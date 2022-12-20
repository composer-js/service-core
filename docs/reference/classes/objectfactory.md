[@acceleratxr/service-core](../README.md) › [Globals](../globals.md) › [ObjectFactory](objectfactory.md)

# Class: ObjectFactory

The `ObjectFactory` is a manager for creating objects based on registered
class types. This allows for the tracking of multiple instances of objects
so that references can be referenced by unique name.

**`author`** Jean-Philippe Steinmetz

## Hierarchy

* **ObjectFactory**

## Index

### Properties

* [classes](objectfactory.md#private-classes)
* [instances](objectfactory.md#readonly-instances)

### Methods

* [clear](objectfactory.md#clear)
* [clearAll](objectfactory.md#clearall)
* [destroy](objectfactory.md#destroy)
* [getInstance](objectfactory.md#getinstance)
* [initialize](objectfactory.md#initialize)
* [newInstance](objectfactory.md#newinstance)
* [register](objectfactory.md#register)

## Properties

### `Private` classes

• **classes**: *Map‹string, any›* = new Map()

Defined in src/ObjectFactory.ts:16

A map for string fully qualified class names to their class types.

___

### `Readonly` instances

• **instances**: *Map‹string, any›* = new Map()

Defined in src/ObjectFactory.ts:19

A map for the unique name to the intance of a particular class type.

## Methods

###  clear

▸ **clear**(): *void*

Defined in src/ObjectFactory.ts:58

Deletes all instantiated objects.

**Returns:** *void*

___

###  clearAll

▸ **clearAll**(): *void*

Defined in src/ObjectFactory.ts:65

Deletes all instantiated objects and registered class types.

**Returns:** *void*

___

###  destroy

▸ **destroy**(): *Promise‹void›*

Defined in src/ObjectFactory.ts:24

Destroys the factory including all instantiated objects it is managing.

**Returns:** *Promise‹void›*

___

###  getInstance

▸ **getInstance**‹**T**›(`nameOrType`: any): *T*

Defined in src/ObjectFactory.ts:99

Returns the object instance with the given unique name.

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nameOrType` | any | The unique name or class type of the object to retrieve. |

**Returns:** *T*

The object instance associated with the given name if found, otherwise `undefined`.

___

###  initialize

▸ **initialize**(`obj`: any): *void*

Defined in src/ObjectFactory.ts:74

Scans the given object for any properties with the @Inject decorator and assigns the correct values.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`obj` | any | The object to initialize with injected defaults  |

**Returns:** *void*

___

###  newInstance

▸ **newInstance**‹**T**›(`type`: any, `name?`: undefined | string, ...`args`: any): *T*

Defined in src/ObjectFactory.ts:124

Creates a new instance of the class specified with the provided unique name or type and constructor arguments. If an existing
object has already been created with the given name, that instance is returned, otherwise a new instance is created
using the provided arguments.

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | any | The fully qualified name or type of the class to instantiate. If a type is given it's class name will be inferred              via the constructor name. |
`name?` | undefined &#124; string | The unique name to give the class instance. Set to `undefined` if you wish to force a new object              is created. |
`...args` | any | The set of constructor arguments to use during construction  |

**Returns:** *T*

___

###  register

▸ **register**(`clazz`: any, `fqn?`: undefined | string): *void*

Defined in src/ObjectFactory.ts:180

Registers the given class type for the provided fully qualified name.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`clazz` | any | The class type to register. |
`fqn?` | undefined &#124; string | The fully qualified name of the class to register. If not specified, the class name will be used.  |

**Returns:** *void*
