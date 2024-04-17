[@composer-js/service-core](../README.md) / [Exports](../modules.md) / OpenApiSpec

# Class: OpenApiSpec

`OpenApiSpec` is a container for an OpenAPI specification.

This class wraps the behavior of openapi-ts to make it easier to build an OpenAPI
specification dynamically at runtime using the server ComposerJS information.

**`Author`**

Jean-Philippe Steinmetz <info@acceleratxr.com>

## Table of contents

### Constructors

- [constructor](OpenApiSpec.md#constructor)

### Properties

- [builder](OpenApiSpec.md#builder)
- [config](OpenApiSpec.md#config)

### Accessors

- [components](OpenApiSpec.md#components)
- [externalDocs](OpenApiSpec.md#externaldocs)
- [info](OpenApiSpec.md#info)
- [openapi](OpenApiSpec.md#openapi)
- [paths](OpenApiSpec.md#paths)
- [security](OpenApiSpec.md#security)
- [servers](OpenApiSpec.md#servers)
- [tags](OpenApiSpec.md#tags)
- [webhooks](OpenApiSpec.md#webhooks)

### Methods

- [addCallback](OpenApiSpec.md#addcallback)
- [addContact](OpenApiSpec.md#addcontact)
- [addDescription](OpenApiSpec.md#adddescription)
- [addExample](OpenApiSpec.md#addexample)
- [addExternalDocs](OpenApiSpec.md#addexternaldocs)
- [addHeader](OpenApiSpec.md#addheader)
- [addInfo](OpenApiSpec.md#addinfo)
- [addLicense](OpenApiSpec.md#addlicense)
- [addLink](OpenApiSpec.md#addlink)
- [addModel](OpenApiSpec.md#addmodel)
- [addOpenApiVersion](OpenApiSpec.md#addopenapiversion)
- [addParameter](OpenApiSpec.md#addparameter)
- [addPath](OpenApiSpec.md#addpath)
- [addRequestBody](OpenApiSpec.md#addrequestbody)
- [addResponse](OpenApiSpec.md#addresponse)
- [addRoute](OpenApiSpec.md#addroute)
- [addSchema](OpenApiSpec.md#addschema)
- [addSecurityScheme](OpenApiSpec.md#addsecurityscheme)
- [addServer](OpenApiSpec.md#addserver)
- [addTag](OpenApiSpec.md#addtag)
- [addTermsOfService](OpenApiSpec.md#addtermsofservice)
- [addTitle](OpenApiSpec.md#addtitle)
- [addVersion](OpenApiSpec.md#addversion)
- [addWebhook](OpenApiSpec.md#addwebhook)
- [createSchemaClass](OpenApiSpec.md#createschemaclass)
- [createSchemaObject](OpenApiSpec.md#createschemaobject)
- [getParameterReference](OpenApiSpec.md#getparameterreference)
- [getSchemaReference](OpenApiSpec.md#getschemareference)
- [getSpec](OpenApiSpec.md#getspec)
- [getSpecAsJson](OpenApiSpec.md#getspecasjson)
- [getSpecAsYaml](OpenApiSpec.md#getspecasyaml)
- [init](OpenApiSpec.md#init)
- [isBuiltInType](OpenApiSpec.md#isbuiltintype)

## Constructors

### constructor

• **new OpenApiSpec**(`spec?`): [`OpenApiSpec`](OpenApiSpec.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `spec?` | `OpenAPIObject` |

#### Returns

[`OpenApiSpec`](OpenApiSpec.md)

#### Defined in

composer-service-core/src/OpenApiSpec.ts:23

## Properties

### builder

• `Private` **builder**: `OpenApiBuilder`

#### Defined in

composer-service-core/src/OpenApiSpec.ts:18

___

### config

• `Private` `Optional` **config**: `any`

#### Defined in

composer-service-core/src/OpenApiSpec.ts:21

## Accessors

### components

• `get` **components**(): `undefined` \| `ComponentsObject`

#### Returns

`undefined` \| `ComponentsObject`

#### Defined in

composer-service-core/src/OpenApiSpec.ts:43

___

### externalDocs

• `get` **externalDocs**(): `undefined` \| `ExternalDocumentationObject`

#### Returns

`undefined` \| `ExternalDocumentationObject`

#### Defined in

composer-service-core/src/OpenApiSpec.ts:55

___

### info

• `get` **info**(): `InfoObject`

#### Returns

`InfoObject`

#### Defined in

composer-service-core/src/OpenApiSpec.ts:31

___

### openapi

• `get` **openapi**(): `string`

#### Returns

`string`

#### Defined in

composer-service-core/src/OpenApiSpec.ts:27

___

### paths

• `get` **paths**(): `undefined` \| `PathsObject`

#### Returns

`undefined` \| `PathsObject`

#### Defined in

composer-service-core/src/OpenApiSpec.ts:39

___

### security

• `get` **security**(): `undefined` \| `SecurityRequirementObject`[]

#### Returns

`undefined` \| `SecurityRequirementObject`[]

#### Defined in

composer-service-core/src/OpenApiSpec.ts:47

___

### servers

• `get` **servers**(): `undefined` \| `ServerObject`[]

#### Returns

`undefined` \| `ServerObject`[]

#### Defined in

composer-service-core/src/OpenApiSpec.ts:35

___

### tags

• `get` **tags**(): `undefined` \| `TagObject`[]

#### Returns

`undefined` \| `TagObject`[]

#### Defined in

composer-service-core/src/OpenApiSpec.ts:51

___

### webhooks

• `get` **webhooks**(): `undefined` \| `PathsObject`

#### Returns

`undefined` \| `PathsObject`

#### Defined in

composer-service-core/src/OpenApiSpec.ts:59

## Methods

### addCallback

▸ **addCallback**(`name`, `callback`): [`OpenApiSpec`](OpenApiSpec.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `callback` | `ReferenceObject` \| `CallbackObject` |

#### Returns

[`OpenApiSpec`](OpenApiSpec.md)

#### Defined in

composer-service-core/src/OpenApiSpec.ts:254

___

### addContact

▸ **addContact**(`contact`): [`OpenApiSpec`](OpenApiSpec.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `contact` | `ContactObject` |

#### Returns

[`OpenApiSpec`](OpenApiSpec.md)

#### Defined in

composer-service-core/src/OpenApiSpec.ts:179

___

### addDescription

▸ **addDescription**(`description`): [`OpenApiSpec`](OpenApiSpec.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `description` | `string` |

#### Returns

[`OpenApiSpec`](OpenApiSpec.md)

#### Defined in

composer-service-core/src/OpenApiSpec.ts:194

___

### addExample

▸ **addExample**(`name`, `example`): [`OpenApiSpec`](OpenApiSpec.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `example` | `ReferenceObject` \| `ExampleObject` |

#### Returns

[`OpenApiSpec`](OpenApiSpec.md)

#### Defined in

composer-service-core/src/OpenApiSpec.ts:229

___

### addExternalDocs

▸ **addExternalDocs**(`extDoc`): [`OpenApiSpec`](OpenApiSpec.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `extDoc` | `ExternalDocumentationObject` |

#### Returns

[`OpenApiSpec`](OpenApiSpec.md)

#### Defined in

composer-service-core/src/OpenApiSpec.ts:269

___

### addHeader

▸ **addHeader**(`name`, `header`): [`OpenApiSpec`](OpenApiSpec.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `header` | `ReferenceObject` \| `HeaderObject` |

#### Returns

[`OpenApiSpec`](OpenApiSpec.md)

#### Defined in

composer-service-core/src/OpenApiSpec.ts:239

___

### addInfo

▸ **addInfo**(`info`): [`OpenApiSpec`](OpenApiSpec.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `info` | `InfoObject` |

#### Returns

[`OpenApiSpec`](OpenApiSpec.md)

#### Defined in

composer-service-core/src/OpenApiSpec.ts:174

___

### addLicense

▸ **addLicense**(`license`): [`OpenApiSpec`](OpenApiSpec.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `license` | `LicenseObject` |

#### Returns

[`OpenApiSpec`](OpenApiSpec.md)

#### Defined in

composer-service-core/src/OpenApiSpec.ts:184

___

### addLink

▸ **addLink**(`name`, `link`): [`OpenApiSpec`](OpenApiSpec.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `link` | `ReferenceObject` \| `LinkObject` |

#### Returns

[`OpenApiSpec`](OpenApiSpec.md)

#### Defined in

composer-service-core/src/OpenApiSpec.ts:249

___

### addModel

▸ **addModel**(`name`, `clazz`): [`OpenApiSpec`](OpenApiSpec.md)

Adds a ComposerJS model class to the OpenAPI specification as a schema.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the model to add. |
| `clazz` | `any` | The class prototype to build the schema from. |

#### Returns

[`OpenApiSpec`](OpenApiSpec.md)

#### Defined in

composer-service-core/src/OpenApiSpec.ts:285

___

### addOpenApiVersion

▸ **addOpenApiVersion**(`openApiVersion`): [`OpenApiSpec`](OpenApiSpec.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `openApiVersion` | `string` |

#### Returns

[`OpenApiSpec`](OpenApiSpec.md)

#### Defined in

composer-service-core/src/OpenApiSpec.ts:169

___

### addParameter

▸ **addParameter**(`name`, `parameter`): [`OpenApiSpec`](OpenApiSpec.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `parameter` | `ReferenceObject` \| `ParameterObject` |

#### Returns

[`OpenApiSpec`](OpenApiSpec.md)

#### Defined in

composer-service-core/src/OpenApiSpec.ts:224

___

### addPath

▸ **addPath**(`path`, `pathItem`): [`OpenApiSpec`](OpenApiSpec.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `pathItem` | `PathItemObject` |

#### Returns

[`OpenApiSpec`](OpenApiSpec.md)

#### Defined in

composer-service-core/src/OpenApiSpec.ts:209

___

### addRequestBody

▸ **addRequestBody**(`name`, `reqBody`): [`OpenApiSpec`](OpenApiSpec.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `reqBody` | `ReferenceObject` \| `RequestBodyObject` |

#### Returns

[`OpenApiSpec`](OpenApiSpec.md)

#### Defined in

composer-service-core/src/OpenApiSpec.ts:234

___

### addResponse

▸ **addResponse**(`name`, `response`): [`OpenApiSpec`](OpenApiSpec.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `response` | `ReferenceObject` \| `ResponseObject` |

#### Returns

[`OpenApiSpec`](OpenApiSpec.md)

#### Defined in

composer-service-core/src/OpenApiSpec.ts:219

___

### addRoute

▸ **addRoute**(`name`, `path`, `method`, `metadata`, `docs`, `routeClass`): [`OpenApiSpec`](OpenApiSpec.md)

Adds a ComposerJS route handler to the OpenAPI specification.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the route handler. (e.g. findAll) |
| `path` | `string` | The complete path of the route handler. (e.g. `/my/resources/:id`) |
| `method` | `string` | The HTTP verb type that the route handler processes. (e.g. `GET`) |
| `metadata` | `any` | The object containing all API information about the route handler. |
| `docs` | [`DocumentsData`](../interfaces/DocDecorators.DocumentsData.md) | The object containing all documentation information about the route handler. |
| `routeClass` | `any` | The parent route class that the route handler belongs to. |

#### Returns

[`OpenApiSpec`](OpenApiSpec.md)

#### Defined in

composer-service-core/src/OpenApiSpec.ts:301

___

### addSchema

▸ **addSchema**(`name`, `schema`): [`OpenApiSpec`](OpenApiSpec.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `schema` | `SchemaObject` \| `ReferenceObject` |

#### Returns

[`OpenApiSpec`](OpenApiSpec.md)

#### Defined in

composer-service-core/src/OpenApiSpec.ts:214

___

### addSecurityScheme

▸ **addSecurityScheme**(`name`, `secScheme`): [`OpenApiSpec`](OpenApiSpec.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `secScheme` | `ReferenceObject` \| `SecuritySchemeObject` |

#### Returns

[`OpenApiSpec`](OpenApiSpec.md)

#### Defined in

composer-service-core/src/OpenApiSpec.ts:244

___

### addServer

▸ **addServer**(`server`): [`OpenApiSpec`](OpenApiSpec.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `ServerObject` |

#### Returns

[`OpenApiSpec`](OpenApiSpec.md)

#### Defined in

composer-service-core/src/OpenApiSpec.ts:259

___

### addTag

▸ **addTag**(`tag`): [`OpenApiSpec`](OpenApiSpec.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `tag` | `TagObject` |

#### Returns

[`OpenApiSpec`](OpenApiSpec.md)

#### Defined in

composer-service-core/src/OpenApiSpec.ts:264

___

### addTermsOfService

▸ **addTermsOfService**(`termsOfService`): [`OpenApiSpec`](OpenApiSpec.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `termsOfService` | `string` |

#### Returns

[`OpenApiSpec`](OpenApiSpec.md)

#### Defined in

composer-service-core/src/OpenApiSpec.ts:199

___

### addTitle

▸ **addTitle**(`title`): [`OpenApiSpec`](OpenApiSpec.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `title` | `string` |

#### Returns

[`OpenApiSpec`](OpenApiSpec.md)

#### Defined in

composer-service-core/src/OpenApiSpec.ts:189

___

### addVersion

▸ **addVersion**(`version`): [`OpenApiSpec`](OpenApiSpec.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `version` | `string` |

#### Returns

[`OpenApiSpec`](OpenApiSpec.md)

#### Defined in

composer-service-core/src/OpenApiSpec.ts:204

___

### addWebhook

▸ **addWebhook**(`webhook`, `webhookItem`): [`OpenApiSpec`](OpenApiSpec.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `webhook` | `string` |
| `webhookItem` | `PathItemObject` |

#### Returns

[`OpenApiSpec`](OpenApiSpec.md)

#### Defined in

composer-service-core/src/OpenApiSpec.ts:274

___

### createSchemaClass

▸ **createSchemaClass**(`clazz`): `SchemaObject`

Creates a new SchemaObject given the specified class prototype.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `clazz` | `any` | The class prototype to build a schema object from. |

#### Returns

`SchemaObject`

The schema object with all information derived from the given class prototype.

#### Defined in

composer-service-core/src/OpenApiSpec.ts:544

___

### createSchemaObject

▸ **createSchemaObject**(`typeInfo`, `defaultValue?`, `description?`, `example?`, `format?`, `identifier?`): `SchemaObject` \| `ReferenceObject`

Creates a schema object for the given type.

#### Parameters

| Name | Type |
| :------ | :------ |
| `typeInfo` | `any` |
| `defaultValue?` | `any` |
| `description?` | `string` |
| `example?` | `any` |
| `format?` | `string` |
| `identifier?` | `boolean` |

#### Returns

`SchemaObject` \| `ReferenceObject`

#### Defined in

composer-service-core/src/OpenApiSpec.ts:626

___

### getParameterReference

▸ **getParameterReference**(`name`): `undefined` \| `ReferenceObject`

Returns a reference to an existing parameter defined in the OpenAPI specification for the given name.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the parameter to find a reference for. |

#### Returns

`undefined` \| `ReferenceObject`

The reference to the parameter with the given name, otherwise `undefined`.

#### Defined in

composer-service-core/src/OpenApiSpec.ts:715

___

### getSchemaReference

▸ **getSchemaReference**(`name`): `undefined` \| `ReferenceObject`

Returns a reference to an existing schema defined in the OpenAPI specification for the given name.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the schema to find a reference for. |

#### Returns

`undefined` \| `ReferenceObject`

The reference to the schema with the given name, otherwise `undefined`.

#### Defined in

composer-service-core/src/OpenApiSpec.ts:731

___

### getSpec

▸ **getSpec**(): `OpenAPIObject`

#### Returns

`OpenAPIObject`

#### Defined in

composer-service-core/src/OpenApiSpec.ts:157

___

### getSpecAsJson

▸ **getSpecAsJson**(`replacer?`, `space?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `replacer?` | (`key`: `string`, `value`: `unknown`) => `unknown` |
| `space?` | `string` \| `number` |

#### Returns

`string`

#### Defined in

composer-service-core/src/OpenApiSpec.ts:161

___

### getSpecAsYaml

▸ **getSpecAsYaml**(): `string`

#### Returns

`string`

#### Defined in

composer-service-core/src/OpenApiSpec.ts:165

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Defined in

composer-service-core/src/OpenApiSpec.ts:64

___

### isBuiltInType

▸ **isBuiltInType**(`value`): `boolean`

Determines if the given type is a primitive or built-in class type.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`boolean`

#### Defined in

composer-service-core/src/OpenApiSpec.ts:527
