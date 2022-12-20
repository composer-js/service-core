[@acceleratxr/service-core](../README.md) › [Globals](../globals.md) › [ModelUtils](modelutils.md)

# Class: ModelUtils

Utility class for working with data model classes.

**`author`** Jean-Philippe Steinmetz

## Hierarchy

* **ModelUtils**

## Index

### Methods

* [buildIdSearchQuery](modelutils.md#static-buildidsearchquery)
* [buildIdSearchQueryMongo](modelutils.md#static-buildidsearchquerymongo)
* [buildIdSearchQuerySQL](modelutils.md#static-buildidsearchquerysql)
* [buildSearchQuery](modelutils.md#static-buildsearchquery)
* [buildSearchQueryMongo](modelutils.md#static-buildsearchquerymongo)
* [buildSearchQuerySQL](modelutils.md#static-buildsearchquerysql)
* [getIdPropertyNames](modelutils.md#static-getidpropertynames)
* [getQueryParamValue](modelutils.md#static-private-getqueryparamvalue)
* [getQueryParamValueMongo](modelutils.md#static-private-getqueryparamvaluemongo)
* [loadModels](modelutils.md#static-loadmodels)

## Methods

### `Static` buildIdSearchQuery

▸ **buildIdSearchQuery**‹**T**›(`repo`: Repository‹T› | MongoRepository‹T› | undefined, `modelClass`: any, `id`: any, `version?`: undefined | number): *any*

Defined in src/models/ModelUtils.ts:67

Builds a query object for use with `find` functions of the given repository for retrieving objects matching the
specified unique identifier.

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`repo` | Repository‹T› &#124; MongoRepository‹T› &#124; undefined | The repository to build the query for. |
`modelClass` | any | The class definition of the data model to build a search query for. |
`id` | any | The unique identifier to search for. |
`version?` | undefined &#124; number | - |

**Returns:** *any*

An object that can be passed to a TypeORM `find` function.

___

### `Static` buildIdSearchQueryMongo

▸ **buildIdSearchQueryMongo**(`modelClass`: any, `id`: any, `version?`: undefined | number): *any*

Defined in src/models/ModelUtils.ts:111

Builds a MongoDB compatible query object for use in `find` functions for retrieving objects matching the
specified unique identifier.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`modelClass` | any | The class definition of the data model to build a search query for. |
`id` | any | The unique identifier to search for. |
`version?` | undefined &#124; number | The version number of the document to search for. |

**Returns:** *any*

An object that can be passed to a MongoDB `find` function.

___

### `Static` buildIdSearchQuerySQL

▸ **buildIdSearchQuerySQL**(`modelClass`: any, `id`: any, `version?`: undefined | number): *any*

Defined in src/models/ModelUtils.ts:89

Builds a TypeORM compatible query object for use in `find` functions for retrieving objects matching the
specified unique identifier.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`modelClass` | any | The class definition of the data model to build a search query for. |
`id` | any | The unique identifier to search for. |
`version?` | undefined &#124; number | The version number of the document to search for. |

**Returns:** *any*

An object that can be passed to a TypeORM `find` function.

___

### `Static` buildSearchQuery

▸ **buildSearchQuery**‹**T**›(`modelClass`: any, `repo`: Repository‹T› | MongoRepository‹T› | undefined, `params?`: any, `queryParams?`: any, `exactMatch`: boolean, `user?`: any): *any*

Defined in src/models/ModelUtils.ts:305

Builds a query object for the given criteria and repository. Query params can have a value containing a
conditional operator to apply for the search. The operator is encoded with the format `op(value)`. The following
operators are supported:
* `eq` - Returns matches whose parameter exactly matches of the given value. e.g. `param = value`
* `gt` - Returns matches whose parameter is greater than the given value. e.g. `param > value`
* `gte` - Returns matches whose parameter is greater than or equal to the given value. e.g. `param >= value`
* `in` - Returns matches whose parameter includes one of the given values. e.g. `param in ('value1', 'value2', 'value3', ...)`
* `like` - Returns matches whose parameter is lexographically similar to the given value. `param like value`
* `lt` -  Returns matches whose parameter is less than the given value. e.g. `param < value`
* `lte` - Returns matches whose parameter is less than or equal to than the given value. e.g. `param < value`
* `not` - Returns matches whose parameter is not equal to the given value. e.g. `param not value`
* `range` - Returns matches whose parameter is greater than or equal to first given value and less than or equal to the second. e.g. `param between(1,100)`

When no operator is provided the comparison will always be evaluated as `eq`.

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`modelClass` | any | - | The class definition of the data model to build a search query for. |
`repo` | Repository‹T› &#124; MongoRepository‹T› &#124; undefined | - | The repository to build a search query for. |
`params?` | any | - | The URI parameters for the endpoint that was requested. |
`queryParams?` | any | - | The URI query parameters that were included in the request. |
`exactMatch` | boolean | false | Set to true to create a query where parameters are to be matched exactly, otherwise set to                          false to use a 'contains' search. |
`user?` | any | - | The user that is performing the request. |

**Returns:** *any*

The TypeORM compatible query object.

___

### `Static` buildSearchQueryMongo

▸ **buildSearchQueryMongo**(`modelClass`: any, `params?`: any, `queryParams?`: any, `exactMatch`: boolean, `user?`: any): *any*

Defined in src/models/ModelUtils.ts:481

Builds a MongoDB compatible query object for the given criteria. Query params can have a value containing a
conditional operator to apply for the search. The operator is encoded with the format `op(value)`. The following
operators are supported:
* `eq` - Returns matches whose parameter exactly matches of the given value. e.g. `param = value`
* `gt` - Returns matches whose parameter is greater than the given value. e.g. `param > value`
* `gte` - Returns matches whose parameter is greater than or equal to the given value. e.g. `param >= value`
* `in` - Returns matches whose parameter includes one of the given values. e.g. `param in ('value1', 'value2', 'value3', ...)`
* `like` - Returns matches whose parameter is lexographically similar to the given value. `param like value`
* `lt` -  Returns matches whose parameter is less than the given value. e.g. `param < value`
* `lte` - Returns matches whose parameter is less than or equal to than the given value. e.g. `param < value`
* `not` - Returns matches whose parameter is not equal to the given value. e.g. `param not value`
* `range` - Returns matches whose parameter is greater than or equal to first given value and less than or equal to the second. e.g. `param between(1,100)`

When no operator is provided the comparison will always be evaluated as `eq`.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`modelClass` | any | - | The class definition of the data model to build a search query for. |
`params?` | any | - | The URI parameters for the endpoint that was requested. |
`queryParams?` | any | - | The URI query parameters that were included in the request. |
`exactMatch` | boolean | false | Set to true to create a query where parameters are to be matched exactly, otherwise set to                          false to use a 'contains' search. |
`user?` | any | - | The user that is performing the request. |

**Returns:** *any*

The TypeORM compatible query object.

___

### `Static` buildSearchQuerySQL

▸ **buildSearchQuerySQL**(`modelClass`: any, `params?`: any, `queryParams?`: any, `exactMatch`: boolean, `user?`: any): *any*

Defined in src/models/ModelUtils.ts:344

Builds a TypeORM compatible query object for the given criteria. Query params can have a value containing a
conditional operator to apply for the search. The operator is encoded with the format `op(value)`. The following
operators are supported:
* `eq` - Returns matches whose parameter exactly matches of the given value. e.g. `param = value`
* `gt` - Returns matches whose parameter is greater than the given value. e.g. `param > value`
* `gte` - Returns matches whose parameter is greater than or equal to the given value. e.g. `param >= value`
* `in` - Returns matches whose parameter includes one of the given values. e.g. `param in ('value1', 'value2', 'value3', ...)`
* `like` - Returns matches whose parameter is lexographically similar to the given value. `param like value`
* `lt` -  Returns matches whose parameter is less than the given value. e.g. `param < value`
* `lte` - Returns matches whose parameter is less than or equal to than the given value. e.g. `param < value`
* `not` - Returns matches whose parameter is not equal to the given value. e.g. `param not value`
* `range` - Returns matches whose parameter is greater than or equal to first given value and less than or equal to the second. e.g. `param between(1,100)`

When no operator is provided the comparison will always be evaluated as `eq`.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`modelClass` | any | - | The class definition of the data model to build a search query for. |
`params?` | any | - | The URI parameters for the endpoint that was requested. |
`queryParams?` | any | - | The URI query parameters that were included in the request. |
`exactMatch` | boolean | false | Set to true to create a query where parameters are to be matched exactly, otherwise set to                          false to use a 'contains' search. |
`user?` | any | - | The user that is performing the request. |

**Returns:** *any*

The TypeORM compatible query object.

___

### `Static` getIdPropertyNames

▸ **getIdPropertyNames**(`modelClass`: any): *string[]*

Defined in src/models/ModelUtils.ts:37

Retrieves a list of all of the specified class's properties that have the @Identifier decorator applied.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`modelClass` | any | The class definition to search for identifiers from. |

**Returns:** *string[]*

The list of all property names that have the @Identifier decorator applied.

___

### `Static` `Private` getQueryParamValue

▸ **getQueryParamValue**(`param`: string): *any*

Defined in src/models/ModelUtils.ts:136

Given a string containing a parameter value and/or a comparison operation return a TypeORM compatible find value.
e.g.
 Given the string "myvalue" will return an Eq("myvalue") object.
 Given the string "Like(myvalue)" will return an Like("myvalue") object.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`param` | string |   |

**Returns:** *any*

___

### `Static` `Private` getQueryParamValueMongo

▸ **getQueryParamValueMongo**(`param`: string): *any*

Defined in src/models/ModelUtils.ts:212

Given a string containing a parameter value and/or a comparison operation return a MongoDB compatible find value.
e.g.
 Given the string "myvalue" will return an `"myvalue"` object.
 Given the string "not(myvalue)" will return an `{ $not: "myvalue" }` object.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`param` | string |   |

**Returns:** *any*

___

### `Static` loadModels

▸ **loadModels**(`src`: string, `result`: Map‹string, any›): *Promise‹Map‹string, any››*

Defined in src/models/ModelUtils.ts:575

Loads all model schema files from the specified path and returns a map containing all the definitions.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`src` | string | - | The path to the model files to load. |
`result` | Map‹string, any› | new Map | - |

**Returns:** *Promise‹Map‹string, any››*

A map containing of all loaded model names to their class definitions.
