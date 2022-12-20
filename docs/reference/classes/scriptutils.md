[@acceleratxr/service-core](../README.md) › [Globals](../globals.md) › [ScriptUtils](scriptutils.md)

# Class: ScriptUtils

Common utility functions for working with dynamically loaded service scripts.

**`author`** Jean-Philippe Steinmetz <info@acceleratxr.com>

## Hierarchy

* **ScriptUtils**

## Index

### Constructors

* [constructor](scriptutils.md#constructor)

### Properties

* [tmpdir](scriptutils.md#private-tmpdir)

### Methods

* [calcChecksum](scriptutils.md#calcchecksum)
* [cleanup](scriptutils.md#cleanup)
* [compile](scriptutils.md#compile)
* [getFQN](scriptutils.md#getfqn)
* [getScriptType](scriptutils.md#getscripttype)
* [import](scriptutils.md#import)
* [importScript](scriptutils.md#private-importscript)
* [writeScript](scriptutils.md#private-writescript)

## Constructors

###  constructor

\+ **new ScriptUtils**(`p?`: undefined | string): *[ScriptUtils](scriptutils.md)*

Defined in src/scripts/ScriptUtils.ts:23

Initializes a new instance of ScriptUtils

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`p?` | undefined &#124; string | The path of the temporary folder to write all compiled and imported scripts to.  |

**Returns:** *[ScriptUtils](scriptutils.md)*

## Properties

### `Private` tmpdir

• **tmpdir**: *string*

Defined in src/scripts/ScriptUtils.ts:23

## Methods

###  calcChecksum

▸ **calcChecksum**(`buffer`: Buffer): *string*

Defined in src/scripts/ScriptUtils.ts:54

Calculates a checksum for the given buffer.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`buffer` | Buffer | The buffer to calculate a checksum for. |

**Returns:** *string*

The checksum of the given buffer

___

###  cleanup

▸ **cleanup**(): *void*

Defined in src/scripts/ScriptUtils.ts:45

Performs any cleanup before the application exits.

**Returns:** *void*

___

###  compile

▸ **compile**(`buffer`: Buffer, `lang`: [ScriptLanguage](../enums/scriptlanguage.md)): *void*

Defined in src/scripts/ScriptUtils.ts:65

Tries to compile the the given script buffer. Throws an error if the script is not compilable.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`buffer` | Buffer | The script to test compile. |
`lang` | [ScriptLanguage](../enums/scriptlanguage.md) | The language type of the script.  |

**Returns:** *void*

___

###  getFQN

▸ **getFQN**(`p`: string): *string*

Defined in src/scripts/ScriptUtils.ts:96

Converts a filesystem path to a fully-qualified class name.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`p` | string | The filesystem path to convert. |

**Returns:** *string*

A string containing the fully-qualified class name.

___

###  getScriptType

▸ **getScriptType**(`script`: Buffer): *[ScriptType](../enums/scripttype.md)*

Defined in src/scripts/ScriptUtils.ts:111

Analyzes the given script buffer to determine what type it is.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`script` | Buffer | The script to analyze.  |

**Returns:** *[ScriptType](../enums/scripttype.md)*

___

###  import

▸ **import**(`scripts`: [Script](../interfaces/script.md) | [Script](../interfaces/script.md)[]): *any | any[]*

Defined in src/scripts/ScriptUtils.ts:175

Imports the given script or list of scripts into the application runtime.

**Parameters:**

Name | Type |
------ | ------ |
`scripts` | [Script](../interfaces/script.md) &#124; [Script](../interfaces/script.md)[] |

**Returns:** *any | any[]*

The imported module or list of imported modules

___

### `Private` importScript

▸ **importScript**(`script`: [Script](../interfaces/script.md), `skipWrite`: boolean): *any*

Defined in src/scripts/ScriptUtils.ts:156

Internal function for importing a single script.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`script` | [Script](../interfaces/script.md) | - | The script to import |
`skipWrite` | boolean | false | Set to true to page the file writing process, otherwise set to false. Default is false.  |

**Returns:** *any*

___

### `Private` writeScript

▸ **writeScript**(`script`: [Script](../interfaces/script.md)): *void*

Defined in src/scripts/ScriptUtils.ts:134

Writes the given script to the temporary folder on the file system.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`script` | [Script](../interfaces/script.md) | The script to write.  |

**Returns:** *void*
