[@acceleratxr/service-core](../README.md) › [Globals](../globals.md) › [JWTStrategy](jwtstrategy.md)

# Class: JWTStrategy

Passport strategy for handling JSON Web Token authentication. This strategy performs JWT verification and will
search for a token by one of the following methods (in order of precedence).
* Cookie
* Query Parameter
* Header

**`author`** Jean-Philippe Steinmetz

## Hierarchy

* Strategy

  ↳ **JWTStrategy**

## Implements

* Strategy

## Index

### Constructors

* [constructor](jwtstrategy.md#constructor)

### Properties

* [options](jwtstrategy.md#private-options)

### Methods

* [authenticate](jwtstrategy.md#authenticate)
* [error](jwtstrategy.md#error)
* [fail](jwtstrategy.md#fail)
* [pass](jwtstrategy.md#pass)
* [redirect](jwtstrategy.md#redirect)
* [success](jwtstrategy.md#success)

## Constructors

###  constructor

\+ **new JWTStrategy**(`options`: [Options](options.md)): *[JWTStrategy](jwtstrategy.md)*

Defined in src/passportjs/JWTStrategy.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`options` | [Options](options.md) |

**Returns:** *[JWTStrategy](jwtstrategy.md)*

## Properties

### `Private` options

• **options**: *[Options](options.md)*

Defined in src/passportjs/JWTStrategy.ts:40

## Methods

###  authenticate

▸ **authenticate**(`req`: Request, `options?`: any): *void*

*Overrides void*

Defined in src/passportjs/JWTStrategy.ts:48

**Parameters:**

Name | Type |
------ | ------ |
`req` | Request |
`options?` | any |

**Returns:** *void*

___

###  error

▸ **error**(`err`: Error): *void*

*Inherited from [JWTStrategy](jwtstrategy.md).[error](jwtstrategy.md#error)*

Defined in node_modules/@types/passport-strategy/index.d.ts:96

Internal error while performing authentication.

Strategies should call this function when an internal error occurs
during the process of performing authentication; for example, if the
user directory is not available.

**`api`** public

**Parameters:**

Name | Type |
------ | ------ |
`err` | Error |

**Returns:** *void*

___

###  fail

▸ **fail**(`challenge`: any, `status`: number): *void*

*Inherited from [JWTStrategy](jwtstrategy.md).[fail](jwtstrategy.md#fail)*

Defined in node_modules/@types/passport-strategy/index.d.ts:60

Fail authentication, with optional `challenge` and `status`, defaulting
to 401.

Strategies should call this function to fail an authentication attempt.

**`api`** public

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`challenge` | any | (Can also be an object with 'message' and 'type' fields). |
`status` | number | - |

**Returns:** *void*

▸ **fail**(`status`: number): *void*

*Inherited from [JWTStrategy](jwtstrategy.md).[fail](jwtstrategy.md#fail)*

Defined in node_modules/@types/passport-strategy/index.d.ts:61

**Parameters:**

Name | Type |
------ | ------ |
`status` | number |

**Returns:** *void*

___

###  pass

▸ **pass**(): *void*

*Inherited from [JWTStrategy](jwtstrategy.md).[pass](jwtstrategy.md#pass)*

Defined in node_modules/@types/passport-strategy/index.d.ts:84

Pass without making a success or fail decision.

Under most circumstances, Strategies should not need to call this
function.  It exists primarily to allow previous authentication state
to be restored, for example from an HTTP session.

**`api`** public

**Returns:** *void*

___

###  redirect

▸ **redirect**(`url`: string, `status?`: undefined | number): *void*

*Inherited from [JWTStrategy](jwtstrategy.md).[redirect](jwtstrategy.md#redirect)*

Defined in node_modules/@types/passport-strategy/index.d.ts:73

Redirect to `url` with optional `status`, defaulting to 302.

Strategies should call this function to redirect the user (via their
user agent) to a third-party website for authentication.

**`api`** public

**Parameters:**

Name | Type |
------ | ------ |
`url` | string |
`status?` | undefined &#124; number |

**Returns:** *void*

___

###  success

▸ **success**(`user`: any, `info?`: any): *void*

*Inherited from [JWTStrategy](jwtstrategy.md).[success](jwtstrategy.md#success)*

Defined in node_modules/@types/passport-strategy/index.d.ts:48

Authenticate `user`, with optional `info`.

Strategies should call this function to successfully authenticate a
user.  `user` should be an object supplied by the application after it
has been given an opportunity to verify credentials.  `info` is an
optional argument containing additional user information.  This is
useful for third-party authentication strategies to pass profile
details.

**`api`** public

**Parameters:**

Name | Type |
------ | ------ |
`user` | any |
`info?` | any |

**Returns:** *void*
