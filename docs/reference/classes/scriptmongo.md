[@acceleratxr/service-core](../README.md) › [Globals](../globals.md) › [ScriptMongo](scriptmongo.md)

# Class: ScriptMongo

Implementation of the `Script` interface for use with MongoDB storage.

**`author`** Jean-Philippe Steinmetz

## Hierarchy

  ↳ [BaseMongoEntity](basemongoentity.md)

  ↳ **ScriptMongo**

## Implements

* [Script](../interfaces/script.md)

## Index

### Constructors

* [constructor](scriptmongo.md#constructor)

### Properties

* [_id](scriptmongo.md#optional-_id)
* [checksum](scriptmongo.md#checksum)
* [comments](scriptmongo.md#comments)
* [data](scriptmongo.md#data)
* [dateCreated](scriptmongo.md#datecreated)
* [dateModified](scriptmongo.md#datemodified)
* [filename](scriptmongo.md#filename)
* [language](scriptmongo.md#language)
* [name](scriptmongo.md#name)
* [published](scriptmongo.md#published)
* [source](scriptmongo.md#source)
* [type](scriptmongo.md#type)
* [uid](scriptmongo.md#uid)
* [version](scriptmongo.md#version)

## Constructors

###  constructor

\+ **new ScriptMongo**(`other?`: any): *[ScriptMongo](scriptmongo.md)*

*Overrides [BaseMongoEntity](basemongoentity.md).[constructor](basemongoentity.md#constructor)*

Defined in src/scripts/ScriptMongo.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`other?` | any |

**Returns:** *[ScriptMongo](scriptmongo.md)*

## Properties

### `Optional` _id

• **_id**? : *ObjectID*

*Inherited from [BaseMongoEntity](basemongoentity.md).[_id](basemongoentity.md#optional-_id)*

Defined in src/models/BaseMongoEntity.ts:18

The internal unique identifier used by MongoDB.

___

###  checksum

• **checksum**: *string* = ""

*Implementation of [Script](../interfaces/script.md).[checksum](../interfaces/script.md#checksum)*

Defined in src/scripts/ScriptMongo.ts:19

The hashed sum of the contents of the script data.

___

###  comments

• **comments**: *string* = ""

*Implementation of [Script](../interfaces/script.md).[comments](../interfaces/script.md#comments)*

Defined in src/scripts/ScriptMongo.ts:23

The textual comments associated with this script version.

___

###  data

• **data**: *Buffer* = new Buffer("utf8")

*Implementation of [Script](../interfaces/script.md).[data](../interfaces/script.md#data)*

Defined in src/scripts/ScriptMongo.ts:27

The script data.

___

###  dateCreated

• **dateCreated**: *Date* = new Date()

*Implementation of [Script](../interfaces/script.md).[dateCreated](../interfaces/script.md#datecreated)*

*Inherited from [BaseEntity](baseentity.md).[dateCreated](baseentity.md#datecreated)*

Defined in src/models/BaseEntity.ts:30

The date and time that the entity was created.

___

###  dateModified

• **dateModified**: *Date* = new Date()

*Implementation of [Script](../interfaces/script.md).[dateModified](../interfaces/script.md#datemodified)*

*Inherited from [BaseEntity](baseentity.md).[dateModified](baseentity.md#datemodified)*

Defined in src/models/BaseEntity.ts:36

The date and time that the entity was last modified.

___

###  filename

• **filename**: *string* = ""

*Implementation of [Script](../interfaces/script.md).[filename](../interfaces/script.md#filename)*

Defined in src/scripts/ScriptMongo.ts:31

The name of the script file on disk.

___

###  language

• **language**: *[ScriptLanguage](../enums/scriptlanguage.md)* = ScriptLanguage.JAVASCRIPT

*Implementation of [Script](../interfaces/script.md).[language](../interfaces/script.md#language)*

Defined in src/scripts/ScriptMongo.ts:35

The programming language of the script.

___

###  name

• **name**: *string* = ""

*Implementation of [Script](../interfaces/script.md).[name](../interfaces/script.md#name)*

Defined in src/scripts/ScriptMongo.ts:40

The unique name of the script.

___

###  published

• **published**: *boolean* = false

*Implementation of [Script](../interfaces/script.md).[published](../interfaces/script.md#published)*

Defined in src/scripts/ScriptMongo.ts:44

Indicates if the script is active for inclusion in the service runtime.

___

###  source

• **source**: *[ScriptSource](../enums/scriptsource.md)* = ScriptSource.USER

*Implementation of [Script](../interfaces/script.md).[source](../interfaces/script.md#source)*

Defined in src/scripts/ScriptMongo.ts:48

The original source of the document.

___

###  type

• **type**: *[ScriptType](../enums/scripttype.md)* = ScriptType.BACKGROUND_JOB

*Implementation of [Script](../interfaces/script.md).[type](../interfaces/script.md#type)*

Defined in src/scripts/ScriptMongo.ts:52

The script's function type describing how it should be loaded into the service.

___

###  uid

• **uid**: *string* = uuid.v4()

*Implementation of [Script](../interfaces/script.md).[uid](../interfaces/script.md#uid)*

*Inherited from [BaseEntity](baseentity.md).[uid](baseentity.md#uid)*

Defined in src/models/BaseEntity.ts:24

The universally unique identifier of the entity.

___

###  version

• **version**: *number* = 0

*Implementation of [Script](../interfaces/script.md).[version](../interfaces/script.md#version)*

*Inherited from [BaseEntity](baseentity.md).[version](baseentity.md#version)*

Defined in src/models/BaseEntity.ts:42

The optimistic lock version.
