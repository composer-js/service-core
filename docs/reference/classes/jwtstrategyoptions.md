**[@composer-js/service-core](../README.md)**

> [Globals](../globals.md) / JWTStrategyOptions

# Class: JWTStrategyOptions

Describes the configuration options that can be used to initialize JWTStrategy.

**`author`** Jean-Philippe Steinmetz

## Hierarchy

* **JWTStrategyOptions**

## Index

### Properties

* [allowFailure](jwtstrategyoptions.md#allowfailure)
* [cookieName](jwtstrategyoptions.md#cookiename)
* [cookieSecure](jwtstrategyoptions.md#cookiesecure)
* [headerKey](jwtstrategyoptions.md#headerkey)
* [headerScheme](jwtstrategyoptions.md#headerscheme)
* [queryKey](jwtstrategyoptions.md#querykey)

### Object literals

* [config](jwtstrategyoptions.md#config)

## Properties

### allowFailure

•  **allowFailure**: boolean = false

*Defined in src/passportjs/JWTStrategy.ts:15*

Set to true to allow a failure to be processed as a success, otherwise set to false. Default value is `false`.

___

### cookieName

•  **cookieName**: string = "jwt"

*Defined in src/passportjs/JWTStrategy.ts:23*

The name of the cookie to retrieve the token from when using cookie based authentication. Default value is `jwt`.

___

### cookieSecure

•  **cookieSecure**: boolean = false

*Defined in src/passportjs/JWTStrategy.ts:25*

The name of the secured cookie to retreive the token from when using cookie based authentication.

___

### headerKey

•  **headerKey**: string = "authorization"

*Defined in src/passportjs/JWTStrategy.ts:19*

The name of the header to look for when performing header based authentication. Default value is `Authorization`.

___

### headerScheme

•  **headerScheme**: string = "jwt"

*Defined in src/passportjs/JWTStrategy.ts:21*

The authorization scheme type when using header based authentication. Default value is `jwt`.

___

### queryKey

•  **queryKey**: string = "jwt\_token"

*Defined in src/passportjs/JWTStrategy.ts:27*

The name of the requesty query parameter to retreive the token from when using query based authentication. Default value is `jwt_token`.

## Object literals

### config

▪  **config**: object

*Defined in src/passportjs/JWTStrategy.ts:17*

The configuration options to pass to the JWTUtils library during token verification.

#### Properties:

Name | Type | Value |
------ | ------ | ------ |
`password` | string | "" |
