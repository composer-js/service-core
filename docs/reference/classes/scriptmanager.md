[@acceleratxr/service-core](../README.md) › [Globals](../globals.md) › [ScriptManager](scriptmanager.md)

# Class: ScriptManager

The `ScriptManager` is responsible for loading all service scripts from disk as well as the configured database
and reconciling the differences. All published scripts are written to a temporary folder on the local disk
and imported into the application context. The loaded script classes can then be referened via the `classes`
property.

**`author`** Jean-Philippe Steinmetz

## Hierarchy

* **ScriptManager**

## Index

### Constructors

* [constructor](scriptmanager.md#constructor)

### Properties

* [classes](scriptmanager.md#classes)
* [config](scriptmanager.md#private-config)
* [logger](scriptmanager.md#private-logger)
* [modules](scriptmanager.md#modules)
* [repo](scriptmanager.md#private-repo)
* [scriptUtils](scriptmanager.md#private-optional-scriptutils)
* [scripts](scriptmanager.md#scripts)

### Methods

* [getClass](scriptmanager.md#getclass)
* [getClasses](scriptmanager.md#getclasses)
* [getScripts](scriptmanager.md#getscripts)
* [load](scriptmanager.md#load)
* [readScriptFile](scriptmanager.md#private-readscriptfile)
* [readScriptFiles](scriptmanager.md#private-readscriptfiles)

## Constructors

###  constructor

\+ **new ScriptManager**(`config`: any, `logger`: any, `repo`: Repository‹[ScriptSQL](scriptsql.md)› | MongoRepository‹[ScriptMongo](scriptmongo.md)›): *[ScriptManager](scriptmanager.md)*

Defined in src/scripts/ScriptManager.ts:44

Initializes the manager with any defaults.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`config` | any | The global application configuration to use. |
`logger` | any | The application logger to use. |
`repo` | Repository‹[ScriptSQL](scriptsql.md)› &#124; MongoRepository‹[ScriptMongo](scriptmongo.md)› | The database repository that manages the Script objects.  |

**Returns:** *[ScriptManager](scriptmanager.md)*

## Properties

###  classes

• **classes**: *Map‹[ScriptType](../enums/scripttype.md), Map‹string, any››* = new Map()

Defined in src/scripts/ScriptManager.ts:29

The map of class types to their class definitions for each loaded script.

___

### `Private` config

• **config**: *any*

Defined in src/scripts/ScriptManager.ts:26

The global application configuration.

___

### `Private` logger

• **logger**: *any*

Defined in src/scripts/ScriptManager.ts:32

The application logger to use for logging messages.

___

###  modules

• **modules**: *Map‹string, any›* = new Map()

Defined in src/scripts/ScriptManager.ts:35

The map of module names to their imported values.

___

### `Private` repo

• **repo**: *Repository‹[ScriptSQL](scriptsql.md)› | MongoRepository‹[ScriptMongo](scriptmongo.md)›*

Defined in src/scripts/ScriptManager.ts:38

The database repository to retrieve and store scripts in.

___

### `Private` `Optional` scriptUtils

• **scriptUtils**? : *[ScriptUtils](scriptutils.md)*

Defined in src/scripts/ScriptManager.ts:44

___

###  scripts

• **scripts**: *Array‹[Script](../interfaces/script.md)›* = []

Defined in src/scripts/ScriptManager.ts:41

The underlying scripts that have been loaded.

## Methods

###  getClass

▸ **getClass**(`name`: string | RegExp): *any | undefined*

Defined in src/scripts/ScriptManager.ts:71

Return the loaded class of the given name.

**Parameters:**

Name | Type |
------ | ------ |
`name` | string &#124; RegExp |

**Returns:** *any | undefined*

The class with the given type if found, otherwise `undefined`.

___

###  getClasses

▸ **getClasses**(`type`: [ScriptType](../enums/scripttype.md)): *Map‹string, any› | undefined*

Defined in src/scripts/ScriptManager.ts:88

Returns all loaded classes of the given type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | [ScriptType](../enums/scripttype.md) | The class type to search for. |

**Returns:** *Map‹string, any› | undefined*

The map of classes of the given type if found, otherwise `undefined`.

___

###  getScripts

▸ **getScripts**(`search`: RegExp | [ScriptSource](../enums/scriptsource.md) | [ScriptType](../enums/scripttype.md) | string): *[Script](../interfaces/script.md)[]*

Defined in src/scripts/ScriptManager.ts:99

Returns all loaded scripts with the given name, type or source. When name is used,
performs a regex search against each script's name for a match.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`search` | RegExp &#124; [ScriptSource](../enums/scriptsource.md) &#124; [ScriptType](../enums/scripttype.md) &#124; string | The name, source or type of the `Script` to retrieve. |

**Returns:** *[Script](../interfaces/script.md)[]*

The list of all loaded scripts matching the given name, source or type.

___

###  load

▸ **load**(`p`: string, `ignore`: string[]): *Promise‹void›*

Defined in src/scripts/ScriptManager.ts:120

Scans the local file system and retrieves all scripts stored in the database and imports them into the current
application context. Attempts to add new or merge updated scripts from disk to the database.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`p` | string | - | The local filesystem path to load scripts from. |
`ignore` | string[] | [] | A list of paths and regex pattern of files to ignore.  |

**Returns:** *Promise‹void›*

___

### `Private` readScriptFile

▸ **readScriptFile**(`basePath`: string, `p`: string): *Promise‹[Script](../interfaces/script.md) | undefined›*

Defined in src/scripts/ScriptManager.ts:233

Reads the script file at the given path.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`basePath` | string | The base path that the script path resides in. |
`p` | string | The path of the script to load. |

**Returns:** *Promise‹[Script](../interfaces/script.md) | undefined›*

A `Script` object containing the file data, otherwise `undefined` if the file was invalid.

___

### `Private` readScriptFiles

▸ **readScriptFiles**(`p`: string, `ignore`: string[], `basePath?`: undefined | string): *Promise‹[Script](../interfaces/script.md)[]›*

Defined in src/scripts/ScriptManager.ts:292

Reads all scripts from the file system at the given path.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`p` | string | The path of the scripts to load. |
`ignore` | string[] | A list of regex pattern of file paths to ignore. |
`basePath?` | undefined &#124; string | The path to compute relative paths to relative to the given path. |

**Returns:** *Promise‹[Script](../interfaces/script.md)[]›*

A list of `Script` objects at the given path.
