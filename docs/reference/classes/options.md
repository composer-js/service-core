[@composer-js/service-core](../README.md) › [Globals](../globals.md) › [Options](options.md)

# Class: Options

Describes the configuration options that can be used to initialize JWTStrategy.

**`author`** Jean-Philippe Steinmetz

## Hierarchy

* **Options**

## Callable

▸ **Options**(`path?`: undefined | string): *(Anonymous function)*

Defined in src/decorators/RouteDecorators.ts:147

Indicates that the decorated function handles incoming `OPTIONS` requests at the given sub-path.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`path?` | undefined &#124; string | The sub-path that the route will handle requests for.  |

**Returns:** *(Anonymous function)*

## Index

### Properties

* [allowFailure](options.md#allowfailure)
* [cookieName](options.md#cookiename)
* [cookieSecure](options.md#cookiesecure)
* [headerKey](options.md#headerkey)
* [headerScheme](options.md#headerscheme)
* [queryKey](options.md#querykey)

### Object literals

* [config](options.md#config)

## Properties

###  allowFailure

• **allowFailure**: *boolean* = false

Defined in src/passportjs/JWTStrategy.ts:15

Set to true to allow a failure to be processed as a success, otherwise set to false. Default value is `false`.

___

###  cookieName

• **cookieName**: *string* = "jwt"

Defined in src/passportjs/JWTStrategy.ts:23

The name of the cookie to retrieve the token from when using cookie based authentication. Default value is `jwt`.

___

###  cookieSecure

• **cookieSecure**: *boolean* = false

Defined in src/passportjs/JWTStrategy.ts:25

The name of the secured cookie to retreive the token from when using cookie based authentication.

___

###  headerKey

• **headerKey**: *string* = "authorization"

Defined in src/passportjs/JWTStrategy.ts:19

The name of the header to look for when performing header based authentication. Default value is `Authorization`.

___

###  headerScheme

• **headerScheme**: *string* = "jwt"

Defined in src/passportjs/JWTStrategy.ts:21

The authorization scheme type when using header based authentication. Default value is `jwt`.

___

###  queryKey

• **queryKey**: *string* = "jwt_token"

Defined in src/passportjs/JWTStrategy.ts:27

The name of the requesty query parameter to retreive the token from when using query based authentication. Default value is `jwt_token`.

## Object literals

###  config

### ▪ **config**: *object*

Defined in src/passportjs/JWTStrategy.ts:17

The configuration options to pass to the JWTUtils library during token verification.

###  password

• **password**: *string* = ""

Defined in src/passportjs/JWTStrategy.ts:17
