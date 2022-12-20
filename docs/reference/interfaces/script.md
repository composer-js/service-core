[@acceleratxr/service-core](../README.md) › [Globals](../globals.md) › [Script](script.md)

# Interface: Script

Defines a script that can be loaded into a service at runtime and perform one of the following behaviors:

- Background Job
- Data Model
- Event Processor
- Route Handler

**`author`** Jean-Philippe Steinmetz

## Hierarchy

* **Script**

## Implemented by

* [ScriptMongo](../classes/scriptmongo.md)
* [ScriptSQL](../classes/scriptsql.md)

## Index

### Properties

* [checksum](script.md#checksum)
* [comments](script.md#comments)
* [data](script.md#data)
* [dateCreated](script.md#datecreated)
* [dateModified](script.md#datemodified)
* [filename](script.md#filename)
* [language](script.md#language)
* [name](script.md#name)
* [published](script.md#published)
* [source](script.md#source)
* [type](script.md#type)
* [uid](script.md#uid)
* [version](script.md#version)

## Properties

###  checksum

• **checksum**: *string*

Defined in src/scripts/Script.ts:63

The hashed sum of the contents of the script data.

___

###  comments

• **comments**: *string*

Defined in src/scripts/Script.ts:66

The textual comments associated with this script version.

___

###  data

• **data**: *Buffer*

Defined in src/scripts/Script.ts:69

The script data.

___

###  dateCreated

• **dateCreated**: *Date*

Defined in src/scripts/Script.ts:50

The date and time that the entity was created.

___

###  dateModified

• **dateModified**: *Date*

Defined in src/scripts/Script.ts:55

The date and time that the entity was last modified.

___

###  filename

• **filename**: *string*

Defined in src/scripts/Script.ts:72

The name of the script file on disk.

___

###  language

• **language**: *[ScriptLanguage](../enums/scriptlanguage.md)*

Defined in src/scripts/Script.ts:75

The programming language of the script.

___

###  name

• **name**: *string*

Defined in src/scripts/Script.ts:78

The unique name of the script.

___

###  published

• **published**: *boolean*

Defined in src/scripts/Script.ts:81

Indicates if the script is active for inclusion in the service runtime.

___

###  source

• **source**: *[ScriptSource](../enums/scriptsource.md)*

Defined in src/scripts/Script.ts:84

The original source of the document.

___

###  type

• **type**: *[ScriptType](../enums/scripttype.md)*

Defined in src/scripts/Script.ts:87

The script's function type describing how it should be loaded into the service.

___

###  uid

• **uid**: *string*

Defined in src/scripts/Script.ts:45

The universally unique identifier (`uuid`) of the entity that the access control list belongs to.

___

###  version

• **version**: *number*

Defined in src/scripts/Script.ts:60

The optimistic lock version.
