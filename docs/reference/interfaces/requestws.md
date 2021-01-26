**[@composer-js/service-core](../README.md)**

> [Globals](../globals.md) / RequestWS

# Interface: RequestWS\<P, ResBody, ReqBody, ReqQuery>

HTTP request type for handling WebSockets.

## Type parameters

Name | Default |
------ | ------ |
`P` | ParamsDictionary |
`ResBody` | any |
`ReqBody` | any |
`ReqQuery` | core.Query |

## Hierarchy

* Request

  ↳ **RequestWS**

## Implements

* ReadableStream

## Index

### Constructors

* [constructor](requestws.md#constructor)

### Properties

* [aborted](requestws.md#aborted)
* [accepted](requestws.md#accepted)
* [app](requestws.md#app)
* [baseUrl](requestws.md#baseurl)
* [body](requestws.md#body)
* [complete](requestws.md#complete)
* [connection](requestws.md#connection)
* [cookies](requestws.md#cookies)
* [destroyed](requestws.md#destroyed)
* [fresh](requestws.md#fresh)
* [headers](requestws.md#headers)
* [host](requestws.md#host)
* [hostname](requestws.md#hostname)
* [httpVersion](requestws.md#httpversion)
* [httpVersionMajor](requestws.md#httpversionmajor)
* [httpVersionMinor](requestws.md#httpversionminor)
* [ip](requestws.md#ip)
* [ips](requestws.md#ips)
* [method](requestws.md#method)
* [next](requestws.md#next)
* [originalUrl](requestws.md#originalurl)
* [params](requestws.md#params)
* [path](requestws.md#path)
* [protocol](requestws.md#protocol)
* [query](requestws.md#query)
* [rawHeaders](requestws.md#rawheaders)
* [rawTrailers](requestws.md#rawtrailers)
* [readable](requestws.md#readable)
* [readableEncoding](requestws.md#readableencoding)
* [readableEnded](requestws.md#readableended)
* [readableFlowing](requestws.md#readableflowing)
* [readableHighWaterMark](requestws.md#readablehighwatermark)
* [readableLength](requestws.md#readablelength)
* [readableObjectMode](requestws.md#readableobjectmode)
* [res](requestws.md#res)
* [route](requestws.md#route)
* [secure](requestws.md#secure)
* [signedCookies](requestws.md#signedcookies)
* [socket](requestws.md#socket)
* [stale](requestws.md#stale)
* [statusCode](requestws.md#statuscode)
* [statusMessage](requestws.md#statusmessage)
* [subdomains](requestws.md#subdomains)
* [trailers](requestws.md#trailers)
* [url](requestws.md#url)
* [websocket](requestws.md#websocket)
* [wsHandled](requestws.md#wshandled)
* [xhr](requestws.md#xhr)

### Methods

* [[Symbol.asyncIterator]](requestws.md#[symbol.asynciterator])
* [\_destroy](requestws.md#_destroy)
* [\_read](requestws.md#_read)
* [accepts](requestws.md#accepts)
* [acceptsCharsets](requestws.md#acceptscharsets)
* [acceptsEncodings](requestws.md#acceptsencodings)
* [acceptsLanguages](requestws.md#acceptslanguages)
* [addListener](requestws.md#addlistener)
* [destroy](requestws.md#destroy)
* [emit](requestws.md#emit)
* [eventNames](requestws.md#eventnames)
* [get](requestws.md#get)
* [getMaxListeners](requestws.md#getmaxlisteners)
* [header](requestws.md#header)
* [is](requestws.md#is)
* [isPaused](requestws.md#ispaused)
* [listenerCount](requestws.md#listenercount)
* [listeners](requestws.md#listeners)
* [off](requestws.md#off)
* [on](requestws.md#on)
* [once](requestws.md#once)
* [param](requestws.md#param)
* [pause](requestws.md#pause)
* [pipe](requestws.md#pipe)
* [prependListener](requestws.md#prependlistener)
* [prependOnceListener](requestws.md#prependoncelistener)
* [push](requestws.md#push)
* [range](requestws.md#range)
* [rawListeners](requestws.md#rawlisteners)
* [read](requestws.md#read)
* [removeAllListeners](requestws.md#removealllisteners)
* [removeListener](requestws.md#removelistener)
* [resume](requestws.md#resume)
* [setEncoding](requestws.md#setencoding)
* [setMaxListeners](requestws.md#setmaxlisteners)
* [setTimeout](requestws.md#settimeout)
* [unpipe](requestws.md#unpipe)
* [unshift](requestws.md#unshift)
* [wrap](requestws.md#wrap)
* [from](requestws.md#from)

## Constructors

### constructor

\+ **new RequestWS**(`socket`: Socket): [RequestWS](requestws.md)

*Inherited from [RequestWS](requestws.md).[constructor](requestws.md#constructor)*

*Overrides void*

*Defined in node_modules/@types/node/http.d.ts:310*

#### Parameters:

Name | Type |
------ | ------ |
`socket` | Socket |

**Returns:** [RequestWS](requestws.md)

## Properties

### aborted

•  **aborted**: boolean

*Inherited from [RequestWS](requestws.md).[aborted](requestws.md#aborted)*

*Defined in node_modules/@types/node/http.d.ts:313*

___

### accepted

•  **accepted**: MediaType[]

*Inherited from [RequestWS](requestws.md).[accepted](requestws.md#accepted)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:342*

Return an array of Accepted media types
ordered from highest quality to lowest.

___

### app

•  **app**: Application

*Inherited from [RequestWS](requestws.md).[app](requestws.md#app)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:485*

___

### baseUrl

•  **baseUrl**: string

*Inherited from [RequestWS](requestws.md).[baseUrl](requestws.md#baseurl)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:483*

___

### body

•  **body**: ReqBody

*Inherited from [RequestWS](requestws.md).[body](requestws.md#body)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:464*

___

### complete

•  **complete**: boolean

*Inherited from [RequestWS](requestws.md).[complete](requestws.md#complete)*

*Defined in node_modules/@types/node/http.d.ts:317*

___

### connection

•  **connection**: Socket

*Inherited from [RequestWS](requestws.md).[connection](requestws.md#connection)*

*Defined in node_modules/@types/node/http.d.ts:321*

**`deprecate`** Use `socket` instead.

___

### cookies

•  **cookies**: any

*Inherited from [RequestWS](requestws.md).[cookies](requestws.md#cookies)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:467*

___

### destroyed

•  **destroyed**: boolean

*Inherited from [RequestWS](requestws.md).[destroyed](requestws.md#destroyed)*

*Defined in node_modules/@types/node/stream.d.ts:35*

___

### fresh

•  **fresh**: boolean

*Inherited from [RequestWS](requestws.md).[fresh](requestws.md#fresh)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:449*

Check if the request is fresh, aka
Last-Modified and/or the ETag
still match.

___

### headers

•  **headers**: IncomingHttpHeaders

*Inherited from [RequestWS](requestws.md).[headers](requestws.md#headers)*

*Defined in node_modules/@types/node/http.d.ts:323*

___

### host

•  **host**: string

*Inherited from [RequestWS](requestws.md).[host](requestws.md#host)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:442*

**`deprecated`** Use hostname instead.

___

### hostname

•  **hostname**: string

*Inherited from [RequestWS](requestws.md).[hostname](requestws.md#hostname)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:437*

Parse the "Host" header field hostname.

___

### httpVersion

•  **httpVersion**: string

*Inherited from [RequestWS](requestws.md).[httpVersion](requestws.md#httpversion)*

*Defined in node_modules/@types/node/http.d.ts:314*

___

### httpVersionMajor

•  **httpVersionMajor**: number

*Inherited from [RequestWS](requestws.md).[httpVersionMajor](requestws.md#httpversionmajor)*

*Defined in node_modules/@types/node/http.d.ts:315*

___

### httpVersionMinor

•  **httpVersionMinor**: number

*Inherited from [RequestWS](requestws.md).[httpVersionMinor](requestws.md#httpversionminor)*

*Defined in node_modules/@types/node/http.d.ts:316*

___

### ip

•  **ip**: string

*Inherited from [RequestWS](requestws.md).[ip](requestws.md#ip)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:404*

Return the remote address, or when
"trust proxy" is `true` return
the upstream addr.

___

### ips

•  **ips**: string[]

*Inherited from [RequestWS](requestws.md).[ips](requestws.md#ips)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:414*

When "trust proxy" is `true`, parse
the "X-Forwarded-For" ip address list.

For example if the value were "client, proxy1, proxy2"
you would receive the array `["client", "proxy1", "proxy2"]`
where "proxy2" is the furthest down-stream.

___

### method

•  **method**: string

*Inherited from [RequestWS](requestws.md).[method](requestws.md#method)*

*Overrides void*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:469*

___

### next

• `Optional` **next**: NextFunction

*Inherited from [RequestWS](requestws.md).[next](requestws.md#next)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:492*

___

### originalUrl

•  **originalUrl**: string

*Inherited from [RequestWS](requestws.md).[originalUrl](requestws.md#originalurl)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:479*

___

### params

•  **params**: P

*Inherited from [RequestWS](requestws.md).[params](requestws.md#params)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:471*

___

### path

•  **path**: string

*Inherited from [RequestWS](requestws.md).[path](requestws.md#path)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:432*

Short-hand for `url.parse(req.url).pathname`.

___

### protocol

•  **protocol**: string

*Inherited from [RequestWS](requestws.md).[protocol](requestws.md#protocol)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:390*

Return the protocol string "http" or "https"
when requested with TLS. When the "trust proxy"
setting is enabled the "X-Forwarded-Proto" header
field will be trusted. If you're running behind
a reverse proxy that supplies https for you this
may be enabled.

___

### query

•  **query**: ReqQuery

*Inherited from [RequestWS](requestws.md).[query](requestws.md#query)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:473*

___

### rawHeaders

•  **rawHeaders**: string[]

*Inherited from [RequestWS](requestws.md).[rawHeaders](requestws.md#rawheaders)*

*Defined in node_modules/@types/node/http.d.ts:324*

___

### rawTrailers

•  **rawTrailers**: string[]

*Inherited from [RequestWS](requestws.md).[rawTrailers](requestws.md#rawtrailers)*

*Defined in node_modules/@types/node/http.d.ts:326*

___

### readable

•  **readable**: boolean

*Inherited from [RequestWS](requestws.md).[readable](requestws.md#readable)*

*Defined in node_modules/@types/node/stream.d.ts:28*

___

### readableEncoding

• `Readonly` **readableEncoding**: BufferEncoding \| null

*Inherited from [RequestWS](requestws.md).[readableEncoding](requestws.md#readableencoding)*

*Defined in node_modules/@types/node/stream.d.ts:29*

___

### readableEnded

• `Readonly` **readableEnded**: boolean

*Inherited from [RequestWS](requestws.md).[readableEnded](requestws.md#readableended)*

*Defined in node_modules/@types/node/stream.d.ts:30*

___

### readableFlowing

• `Readonly` **readableFlowing**: boolean \| null

*Inherited from [RequestWS](requestws.md).[readableFlowing](requestws.md#readableflowing)*

*Defined in node_modules/@types/node/stream.d.ts:31*

___

### readableHighWaterMark

• `Readonly` **readableHighWaterMark**: number

*Inherited from [RequestWS](requestws.md).[readableHighWaterMark](requestws.md#readablehighwatermark)*

*Defined in node_modules/@types/node/stream.d.ts:32*

___

### readableLength

• `Readonly` **readableLength**: number

*Inherited from [RequestWS](requestws.md).[readableLength](requestws.md#readablelength)*

*Defined in node_modules/@types/node/stream.d.ts:33*

___

### readableObjectMode

• `Readonly` **readableObjectMode**: boolean

*Inherited from [RequestWS](requestws.md).[readableObjectMode](requestws.md#readableobjectmode)*

*Defined in node_modules/@types/node/stream.d.ts:34*

___

### res

• `Optional` **res**: [Response](../globals.md#response)\<ResBody>

*Inherited from [RequestWS](requestws.md).[res](requestws.md#res)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:491*

After middleware.init executed, Request will contain res and next properties
See: express/lib/middleware/init.js

___

### route

•  **route**: any

*Inherited from [RequestWS](requestws.md).[route](requestws.md#route)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:475*

___

### secure

•  **secure**: boolean

*Inherited from [RequestWS](requestws.md).[secure](requestws.md#secure)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:397*

Short-hand for:

   req.protocol == 'https'

___

### signedCookies

•  **signedCookies**: any

*Inherited from [RequestWS](requestws.md).[signedCookies](requestws.md#signedcookies)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:477*

___

### socket

•  **socket**: Socket

*Inherited from [RequestWS](requestws.md).[socket](requestws.md#socket)*

*Defined in node_modules/@types/node/http.d.ts:322*

___

### stale

•  **stale**: boolean

*Inherited from [RequestWS](requestws.md).[stale](requestws.md#stale)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:456*

Check if the request is stale, aka
"Last-Modified" and / or the "ETag" for the
resource has changed.

___

### statusCode

• `Optional` **statusCode**: undefined \| number

*Inherited from [RequestWS](requestws.md).[statusCode](requestws.md#statuscode)*

*Defined in node_modules/@types/node/http.d.ts:339*

Only valid for response obtained from http.ClientRequest.

___

### statusMessage

• `Optional` **statusMessage**: undefined \| string

*Inherited from [RequestWS](requestws.md).[statusMessage](requestws.md#statusmessage)*

*Defined in node_modules/@types/node/http.d.ts:343*

Only valid for response obtained from http.ClientRequest.

___

### subdomains

•  **subdomains**: string[]

*Inherited from [RequestWS](requestws.md).[subdomains](requestws.md#subdomains)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:427*

Return subdomains as an array.

Subdomains are the dot-separated parts of the host before the main domain of
the app. By default, the domain of the app is assumed to be the last two
parts of the host. This can be changed by setting "subdomain offset".

For example, if the domain is "tobi.ferrets.example.com":
If "subdomain offset" is not set, req.subdomains is `["ferrets", "tobi"]`.
If "subdomain offset" is 3, req.subdomains is `["tobi"]`.

___

### trailers

•  **trailers**: Dict\<string>

*Inherited from [RequestWS](requestws.md).[trailers](requestws.md#trailers)*

*Defined in node_modules/@types/node/http.d.ts:325*

___

### url

•  **url**: string

*Inherited from [RequestWS](requestws.md).[url](requestws.md#url)*

*Overrides void*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:481*

___

### websocket

•  **websocket**: WebSocket \| undefined

*Defined in src/express/WebSocket.ts:15*

The associated WebSocket connection with this request.

___

### wsHandled

•  **wsHandled**: boolean

*Defined in src/express/WebSocket.ts:20*

Indicates if the request is a websocket request that has been handled.

___

### xhr

•  **xhr**: boolean

*Inherited from [RequestWS](requestws.md).[xhr](requestws.md#xhr)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:461*

Check if the request was an _XMLHttpRequest_.

## Methods

### [Symbol.asyncIterator]

▸ **[Symbol.asyncIterator]**(): AsyncIterableIterator\<any>

*Inherited from [RequestWS](requestws.md).[[Symbol.asyncIterator]](requestws.md#[symbol.asynciterator])*

*Defined in node_modules/@types/node/stream.d.ts:124*

**Returns:** AsyncIterableIterator\<any>

___

### \_destroy

▸ **_destroy**(`error`: Error \| null, `callback`: (error?: Error \| null) => void): void

*Inherited from [RequestWS](requestws.md).[_destroy](requestws.md#_destroy)*

*Defined in node_modules/@types/node/stream.d.ts:47*

#### Parameters:

Name | Type |
------ | ------ |
`error` | Error \| null |
`callback` | (error?: Error \| null) => void |

**Returns:** void

___

### \_read

▸ **_read**(`size`: number): void

*Inherited from [RequestWS](requestws.md).[_read](requestws.md#_read)*

*Defined in node_modules/@types/node/stream.d.ts:37*

#### Parameters:

Name | Type |
------ | ------ |
`size` | number |

**Returns:** void

___

### accepts

▸ **accepts**(): string[]

*Inherited from [RequestWS](requestws.md).[accepts](requestws.md#accepts)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:282*

Check if the given `type(s)` is acceptable, returning
the best match when true, otherwise `undefined`, in which
case you should respond with 406 "Not Acceptable".

The `type` value may be a single mime type string
such as "application/json", the extension name
such as "json", a comma-delimted list such as "json, html, text/plain",
or an array `["json", "html", "text/plain"]`. When a list
or array is given the _best_ match, if any is returned.

Examples:

    // Accept: text/html
    req.accepts('html');
    // => "html"

    // Accept: text/*, application/json
    req.accepts('html');
    // => "html"
    req.accepts('text/html');
    // => "text/html"
    req.accepts('json, text');
    // => "json"
    req.accepts('application/json');
    // => "application/json"

    // Accept: text/*, application/json
    req.accepts('image/png');
    req.accepts('png');
    // => undefined

    // Accept: text/*;q=.5, application/json
    req.accepts(['html', 'json']);
    req.accepts('html, json');
    // => "json"

**Returns:** string[]

▸ **accepts**(`type`: string): string \| false

*Inherited from [RequestWS](requestws.md).[accepts](requestws.md#accepts)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:283*

#### Parameters:

Name | Type |
------ | ------ |
`type` | string |

**Returns:** string \| false

▸ **accepts**(`type`: string[]): string \| false

*Inherited from [RequestWS](requestws.md).[accepts](requestws.md#accepts)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:284*

#### Parameters:

Name | Type |
------ | ------ |
`type` | string[] |

**Returns:** string \| false

▸ **accepts**(...`type`: string[]): string \| false

*Inherited from [RequestWS](requestws.md).[accepts](requestws.md#accepts)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:285*

#### Parameters:

Name | Type |
------ | ------ |
`...type` | string[] |

**Returns:** string \| false

___

### acceptsCharsets

▸ **acceptsCharsets**(): string[]

*Inherited from [RequestWS](requestws.md).[acceptsCharsets](requestws.md#acceptscharsets)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:294*

Returns the first accepted charset of the specified character sets,
based on the request's Accept-Charset HTTP header field.
If none of the specified charsets is accepted, returns false.

For more information, or if you have issues or concerns, see accepts.

**Returns:** string[]

▸ **acceptsCharsets**(`charset`: string): string \| false

*Inherited from [RequestWS](requestws.md).[acceptsCharsets](requestws.md#acceptscharsets)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:295*

#### Parameters:

Name | Type |
------ | ------ |
`charset` | string |

**Returns:** string \| false

▸ **acceptsCharsets**(`charset`: string[]): string \| false

*Inherited from [RequestWS](requestws.md).[acceptsCharsets](requestws.md#acceptscharsets)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:296*

#### Parameters:

Name | Type |
------ | ------ |
`charset` | string[] |

**Returns:** string \| false

▸ **acceptsCharsets**(...`charset`: string[]): string \| false

*Inherited from [RequestWS](requestws.md).[acceptsCharsets](requestws.md#acceptscharsets)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:297*

#### Parameters:

Name | Type |
------ | ------ |
`...charset` | string[] |

**Returns:** string \| false

___

### acceptsEncodings

▸ **acceptsEncodings**(): string[]

*Inherited from [RequestWS](requestws.md).[acceptsEncodings](requestws.md#acceptsencodings)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:306*

Returns the first accepted encoding of the specified encodings,
based on the request's Accept-Encoding HTTP header field.
If none of the specified encodings is accepted, returns false.

For more information, or if you have issues or concerns, see accepts.

**Returns:** string[]

▸ **acceptsEncodings**(`encoding`: string): string \| false

*Inherited from [RequestWS](requestws.md).[acceptsEncodings](requestws.md#acceptsencodings)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:307*

#### Parameters:

Name | Type |
------ | ------ |
`encoding` | string |

**Returns:** string \| false

▸ **acceptsEncodings**(`encoding`: string[]): string \| false

*Inherited from [RequestWS](requestws.md).[acceptsEncodings](requestws.md#acceptsencodings)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:308*

#### Parameters:

Name | Type |
------ | ------ |
`encoding` | string[] |

**Returns:** string \| false

▸ **acceptsEncodings**(...`encoding`: string[]): string \| false

*Inherited from [RequestWS](requestws.md).[acceptsEncodings](requestws.md#acceptsencodings)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:309*

#### Parameters:

Name | Type |
------ | ------ |
`...encoding` | string[] |

**Returns:** string \| false

___

### acceptsLanguages

▸ **acceptsLanguages**(): string[]

*Inherited from [RequestWS](requestws.md).[acceptsLanguages](requestws.md#acceptslanguages)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:318*

Returns the first accepted language of the specified languages,
based on the request's Accept-Language HTTP header field.
If none of the specified languages is accepted, returns false.

For more information, or if you have issues or concerns, see accepts.

**Returns:** string[]

▸ **acceptsLanguages**(`lang`: string): string \| false

*Inherited from [RequestWS](requestws.md).[acceptsLanguages](requestws.md#acceptslanguages)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:319*

#### Parameters:

Name | Type |
------ | ------ |
`lang` | string |

**Returns:** string \| false

▸ **acceptsLanguages**(`lang`: string[]): string \| false

*Inherited from [RequestWS](requestws.md).[acceptsLanguages](requestws.md#acceptslanguages)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:320*

#### Parameters:

Name | Type |
------ | ------ |
`lang` | string[] |

**Returns:** string \| false

▸ **acceptsLanguages**(...`lang`: string[]): string \| false

*Inherited from [RequestWS](requestws.md).[acceptsLanguages](requestws.md#acceptslanguages)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:321*

#### Parameters:

Name | Type |
------ | ------ |
`...lang` | string[] |

**Returns:** string \| false

___

### addListener

▸ **addListener**(`event`: \"close\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[addListener](requestws.md#addlistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:61*

Event emitter
The defined events on documents including:
1. close
2. data
3. end
4. error
5. pause
6. readable
7. resume

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"close\" |
`listener` | () => void |

**Returns:** this

▸ **addListener**(`event`: \"data\", `listener`: (chunk: any) => void): this

*Inherited from [RequestWS](requestws.md).[addListener](requestws.md#addlistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:62*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"data\" |
`listener` | (chunk: any) => void |

**Returns:** this

▸ **addListener**(`event`: \"end\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[addListener](requestws.md#addlistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:63*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"end\" |
`listener` | () => void |

**Returns:** this

▸ **addListener**(`event`: \"error\", `listener`: (err: Error) => void): this

*Inherited from [RequestWS](requestws.md).[addListener](requestws.md#addlistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:64*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"error\" |
`listener` | (err: Error) => void |

**Returns:** this

▸ **addListener**(`event`: \"pause\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[addListener](requestws.md#addlistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:65*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"pause\" |
`listener` | () => void |

**Returns:** this

▸ **addListener**(`event`: \"readable\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[addListener](requestws.md#addlistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:66*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"readable\" |
`listener` | () => void |

**Returns:** this

▸ **addListener**(`event`: \"resume\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[addListener](requestws.md#addlistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:67*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"resume\" |
`listener` | () => void |

**Returns:** this

▸ **addListener**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [RequestWS](requestws.md).[addListener](requestws.md#addlistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:68*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### destroy

▸ **destroy**(`error?`: Error): void

*Inherited from [RequestWS](requestws.md).[destroy](requestws.md#destroy)*

*Overrides void*

*Defined in node_modules/@types/node/http.d.ts:344*

#### Parameters:

Name | Type |
------ | ------ |
`error?` | Error |

**Returns:** void

___

### emit

▸ **emit**(`event`: \"close\"): boolean

*Inherited from [RequestWS](requestws.md).[emit](requestws.md#emit)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:70*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"close\" |

**Returns:** boolean

▸ **emit**(`event`: \"data\", `chunk`: any): boolean

*Inherited from [RequestWS](requestws.md).[emit](requestws.md#emit)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:71*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"data\" |
`chunk` | any |

**Returns:** boolean

▸ **emit**(`event`: \"end\"): boolean

*Inherited from [RequestWS](requestws.md).[emit](requestws.md#emit)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:72*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"end\" |

**Returns:** boolean

▸ **emit**(`event`: \"error\", `err`: Error): boolean

*Inherited from [RequestWS](requestws.md).[emit](requestws.md#emit)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:73*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"error\" |
`err` | Error |

**Returns:** boolean

▸ **emit**(`event`: \"pause\"): boolean

*Inherited from [RequestWS](requestws.md).[emit](requestws.md#emit)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:74*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"pause\" |

**Returns:** boolean

▸ **emit**(`event`: \"readable\"): boolean

*Inherited from [RequestWS](requestws.md).[emit](requestws.md#emit)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:75*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"readable\" |

**Returns:** boolean

▸ **emit**(`event`: \"resume\"): boolean

*Inherited from [RequestWS](requestws.md).[emit](requestws.md#emit)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:76*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"resume\" |

**Returns:** boolean

▸ **emit**(`event`: string \| symbol, ...`args`: any[]): boolean

*Inherited from [RequestWS](requestws.md).[emit](requestws.md#emit)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:77*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`...args` | any[] |

**Returns:** boolean

___

### eventNames

▸ **eventNames**(): Array\<string \| symbol>

*Inherited from [RequestWS](requestws.md).[eventNames](requestws.md#eventnames)*

*Defined in node_modules/@types/node/events.d.ts:77*

**Returns:** Array\<string \| symbol>

___

### get

▸ **get**(`name`: \"set-cookie\"): string[] \| undefined

*Inherited from [RequestWS](requestws.md).[get](requestws.md#get)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:239*

Return request header.

The `Referrer` header field is special-cased,
both `Referrer` and `Referer` are interchangeable.

Examples:

    req.get('Content-Type');
    // => "text/plain"

    req.get('content-type');
    // => "text/plain"

    req.get('Something');
    // => undefined

Aliased as `req.header()`.

#### Parameters:

Name | Type |
------ | ------ |
`name` | \"set-cookie\" |

**Returns:** string[] \| undefined

▸ **get**(`name`: string): string \| undefined

*Inherited from [RequestWS](requestws.md).[get](requestws.md#get)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:240*

#### Parameters:

Name | Type |
------ | ------ |
`name` | string |

**Returns:** string \| undefined

___

### getMaxListeners

▸ **getMaxListeners**(): number

*Inherited from [RequestWS](requestws.md).[getMaxListeners](requestws.md#getmaxlisteners)*

*Defined in node_modules/@types/node/events.d.ts:69*

**Returns:** number

___

### header

▸ **header**(`name`: \"set-cookie\"): string[] \| undefined

*Inherited from [RequestWS](requestws.md).[header](requestws.md#header)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:242*

#### Parameters:

Name | Type |
------ | ------ |
`name` | \"set-cookie\" |

**Returns:** string[] \| undefined

▸ **header**(`name`: string): string \| undefined

*Inherited from [RequestWS](requestws.md).[header](requestws.md#header)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:243*

#### Parameters:

Name | Type |
------ | ------ |
`name` | string |

**Returns:** string \| undefined

___

### is

▸ **is**(`type`: string \| string[]): string \| false \| null

*Inherited from [RequestWS](requestws.md).[is](requestws.md#is)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:380*

Check if the incoming request contains the "Content-Type"
header field, and it contains the give mime `type`.

Examples:

     // With Content-Type: text/html; charset=utf-8
     req.is('html');
     req.is('text/html');
     req.is('text/*');
     // => true

     // When Content-Type is application/json
     req.is('json');
     req.is('application/json');
     req.is('application/*');
     // => true

     req.is('html');
     // => false

#### Parameters:

Name | Type |
------ | ------ |
`type` | string \| string[] |

**Returns:** string \| false \| null

___

### isPaused

▸ **isPaused**(): boolean

*Inherited from [RequestWS](requestws.md).[isPaused](requestws.md#ispaused)*

*Defined in node_modules/@types/node/stream.d.ts:42*

**Returns:** boolean

___

### listenerCount

▸ **listenerCount**(`event`: string \| symbol): number

*Inherited from [RequestWS](requestws.md).[listenerCount](requestws.md#listenercount)*

*Defined in node_modules/@types/node/events.d.ts:73*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |

**Returns:** number

___

### listeners

▸ **listeners**(`event`: string \| symbol): Function[]

*Inherited from [RequestWS](requestws.md).[listeners](requestws.md#listeners)*

*Defined in node_modules/@types/node/events.d.ts:70*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |

**Returns:** Function[]

___

### off

▸ **off**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [RequestWS](requestws.md).[off](requestws.md#off)*

*Defined in node_modules/@types/node/events.d.ts:66*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### on

▸ **on**(`event`: \"close\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[on](requestws.md#on)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:79*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"close\" |
`listener` | () => void |

**Returns:** this

▸ **on**(`event`: \"data\", `listener`: (chunk: any) => void): this

*Inherited from [RequestWS](requestws.md).[on](requestws.md#on)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:80*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"data\" |
`listener` | (chunk: any) => void |

**Returns:** this

▸ **on**(`event`: \"end\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[on](requestws.md#on)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:81*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"end\" |
`listener` | () => void |

**Returns:** this

▸ **on**(`event`: \"error\", `listener`: (err: Error) => void): this

*Inherited from [RequestWS](requestws.md).[on](requestws.md#on)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:82*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"error\" |
`listener` | (err: Error) => void |

**Returns:** this

▸ **on**(`event`: \"pause\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[on](requestws.md#on)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:83*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"pause\" |
`listener` | () => void |

**Returns:** this

▸ **on**(`event`: \"readable\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[on](requestws.md#on)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:84*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"readable\" |
`listener` | () => void |

**Returns:** this

▸ **on**(`event`: \"resume\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[on](requestws.md#on)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:85*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"resume\" |
`listener` | () => void |

**Returns:** this

▸ **on**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [RequestWS](requestws.md).[on](requestws.md#on)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:86*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### once

▸ **once**(`event`: \"close\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[once](requestws.md#once)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:88*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"close\" |
`listener` | () => void |

**Returns:** this

▸ **once**(`event`: \"data\", `listener`: (chunk: any) => void): this

*Inherited from [RequestWS](requestws.md).[once](requestws.md#once)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:89*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"data\" |
`listener` | (chunk: any) => void |

**Returns:** this

▸ **once**(`event`: \"end\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[once](requestws.md#once)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:90*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"end\" |
`listener` | () => void |

**Returns:** this

▸ **once**(`event`: \"error\", `listener`: (err: Error) => void): this

*Inherited from [RequestWS](requestws.md).[once](requestws.md#once)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:91*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"error\" |
`listener` | (err: Error) => void |

**Returns:** this

▸ **once**(`event`: \"pause\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[once](requestws.md#once)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:92*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"pause\" |
`listener` | () => void |

**Returns:** this

▸ **once**(`event`: \"readable\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[once](requestws.md#once)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:93*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"readable\" |
`listener` | () => void |

**Returns:** this

▸ **once**(`event`: \"resume\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[once](requestws.md#once)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:94*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"resume\" |
`listener` | () => void |

**Returns:** this

▸ **once**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [RequestWS](requestws.md).[once](requestws.md#once)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:95*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### param

▸ **param**(`name`: string, `defaultValue?`: any): string

*Inherited from [RequestWS](requestws.md).[param](requestws.md#param)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:357*

**`deprecated`** since 4.11 Use either req.params, req.body or req.query, as applicable.

Return the value of param `name` when present or `defaultValue`.

 - Checks route placeholders, ex: _/user/:id_
 - Checks body params, ex: id=12, {"id":12}
 - Checks query string params, ex: ?id=12

To utilize request bodies, `req.body`
should be an object. This can be done by using
the `connect.bodyParser()` middleware.

#### Parameters:

Name | Type |
------ | ------ |
`name` | string |
`defaultValue?` | any |

**Returns:** string

___

### pause

▸ **pause**(): this

*Inherited from [RequestWS](requestws.md).[pause](requestws.md#pause)*

*Defined in node_modules/@types/node/stream.d.ts:40*

**Returns:** this

___

### pipe

▸ **pipe**\<T>(`destination`: T, `options?`: undefined \| { end?: undefined \| false \| true  }): T

*Inherited from [RequestWS](requestws.md).[pipe](requestws.md#pipe)*

*Defined in node_modules/@types/node/stream.d.ts:5*

#### Type parameters:

Name | Type |
------ | ------ |
`T` | WritableStream |

#### Parameters:

Name | Type |
------ | ------ |
`destination` | T |
`options?` | undefined \| { end?: undefined \| false \| true  } |

**Returns:** T

___

### prependListener

▸ **prependListener**(`event`: \"close\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[prependListener](requestws.md#prependlistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:97*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"close\" |
`listener` | () => void |

**Returns:** this

▸ **prependListener**(`event`: \"data\", `listener`: (chunk: any) => void): this

*Inherited from [RequestWS](requestws.md).[prependListener](requestws.md#prependlistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:98*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"data\" |
`listener` | (chunk: any) => void |

**Returns:** this

▸ **prependListener**(`event`: \"end\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[prependListener](requestws.md#prependlistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:99*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"end\" |
`listener` | () => void |

**Returns:** this

▸ **prependListener**(`event`: \"error\", `listener`: (err: Error) => void): this

*Inherited from [RequestWS](requestws.md).[prependListener](requestws.md#prependlistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:100*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"error\" |
`listener` | (err: Error) => void |

**Returns:** this

▸ **prependListener**(`event`: \"pause\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[prependListener](requestws.md#prependlistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:101*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"pause\" |
`listener` | () => void |

**Returns:** this

▸ **prependListener**(`event`: \"readable\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[prependListener](requestws.md#prependlistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:102*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"readable\" |
`listener` | () => void |

**Returns:** this

▸ **prependListener**(`event`: \"resume\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[prependListener](requestws.md#prependlistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:103*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"resume\" |
`listener` | () => void |

**Returns:** this

▸ **prependListener**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [RequestWS](requestws.md).[prependListener](requestws.md#prependlistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:104*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### prependOnceListener

▸ **prependOnceListener**(`event`: \"close\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[prependOnceListener](requestws.md#prependoncelistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:106*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"close\" |
`listener` | () => void |

**Returns:** this

▸ **prependOnceListener**(`event`: \"data\", `listener`: (chunk: any) => void): this

*Inherited from [RequestWS](requestws.md).[prependOnceListener](requestws.md#prependoncelistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:107*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"data\" |
`listener` | (chunk: any) => void |

**Returns:** this

▸ **prependOnceListener**(`event`: \"end\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[prependOnceListener](requestws.md#prependoncelistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:108*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"end\" |
`listener` | () => void |

**Returns:** this

▸ **prependOnceListener**(`event`: \"error\", `listener`: (err: Error) => void): this

*Inherited from [RequestWS](requestws.md).[prependOnceListener](requestws.md#prependoncelistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:109*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"error\" |
`listener` | (err: Error) => void |

**Returns:** this

▸ **prependOnceListener**(`event`: \"pause\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[prependOnceListener](requestws.md#prependoncelistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:110*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"pause\" |
`listener` | () => void |

**Returns:** this

▸ **prependOnceListener**(`event`: \"readable\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[prependOnceListener](requestws.md#prependoncelistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:111*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"readable\" |
`listener` | () => void |

**Returns:** this

▸ **prependOnceListener**(`event`: \"resume\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[prependOnceListener](requestws.md#prependoncelistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:112*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"resume\" |
`listener` | () => void |

**Returns:** this

▸ **prependOnceListener**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [RequestWS](requestws.md).[prependOnceListener](requestws.md#prependoncelistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:113*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### push

▸ **push**(`chunk`: any, `encoding?`: BufferEncoding): boolean

*Inherited from [RequestWS](requestws.md).[push](requestws.md#push)*

*Defined in node_modules/@types/node/stream.d.ts:46*

#### Parameters:

Name | Type |
------ | ------ |
`chunk` | any |
`encoding?` | BufferEncoding |

**Returns:** boolean

___

### range

▸ **range**(`size`: number, `options?`: RangeParserOptions): RangeParserRanges \| RangeParserResult \| undefined

*Inherited from [RequestWS](requestws.md).[range](requestws.md#range)*

*Defined in node_modules/@types/express-serve-static-core/index.d.ts:336*

Parse Range header field, capping to the given `size`.

Unspecified ranges such as "0-" require knowledge of your resource length. In
the case of a byte range this is of course the total number of bytes.
If the Range header field is not given `undefined` is returned.
If the Range header field is given, return value is a result of range-parser.
See more ./types/range-parser/index.d.ts

NOTE: remember that ranges are inclusive, so for example "Range: users=0-3"
should respond with 4 users when available, not 3.

#### Parameters:

Name | Type |
------ | ------ |
`size` | number |
`options?` | RangeParserOptions |

**Returns:** RangeParserRanges \| RangeParserResult \| undefined

___

### rawListeners

▸ **rawListeners**(`event`: string \| symbol): Function[]

*Inherited from [RequestWS](requestws.md).[rawListeners](requestws.md#rawlisteners)*

*Defined in node_modules/@types/node/events.d.ts:71*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |

**Returns:** Function[]

___

### read

▸ **read**(`size?`: undefined \| number): any

*Inherited from [RequestWS](requestws.md).[read](requestws.md#read)*

*Defined in node_modules/@types/node/stream.d.ts:38*

#### Parameters:

Name | Type |
------ | ------ |
`size?` | undefined \| number |

**Returns:** any

___

### removeAllListeners

▸ **removeAllListeners**(`event?`: string \| symbol): this

*Inherited from [RequestWS](requestws.md).[removeAllListeners](requestws.md#removealllisteners)*

*Defined in node_modules/@types/node/events.d.ts:67*

#### Parameters:

Name | Type |
------ | ------ |
`event?` | string \| symbol |

**Returns:** this

___

### removeListener

▸ **removeListener**(`event`: \"close\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[removeListener](requestws.md#removelistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:115*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"close\" |
`listener` | () => void |

**Returns:** this

▸ **removeListener**(`event`: \"data\", `listener`: (chunk: any) => void): this

*Inherited from [RequestWS](requestws.md).[removeListener](requestws.md#removelistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:116*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"data\" |
`listener` | (chunk: any) => void |

**Returns:** this

▸ **removeListener**(`event`: \"end\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[removeListener](requestws.md#removelistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:117*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"end\" |
`listener` | () => void |

**Returns:** this

▸ **removeListener**(`event`: \"error\", `listener`: (err: Error) => void): this

*Inherited from [RequestWS](requestws.md).[removeListener](requestws.md#removelistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:118*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"error\" |
`listener` | (err: Error) => void |

**Returns:** this

▸ **removeListener**(`event`: \"pause\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[removeListener](requestws.md#removelistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:119*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"pause\" |
`listener` | () => void |

**Returns:** this

▸ **removeListener**(`event`: \"readable\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[removeListener](requestws.md#removelistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:120*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"readable\" |
`listener` | () => void |

**Returns:** this

▸ **removeListener**(`event`: \"resume\", `listener`: () => void): this

*Inherited from [RequestWS](requestws.md).[removeListener](requestws.md#removelistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:121*

#### Parameters:

Name | Type |
------ | ------ |
`event` | \"resume\" |
`listener` | () => void |

**Returns:** this

▸ **removeListener**(`event`: string \| symbol, `listener`: (...args: any[]) => void): this

*Inherited from [RequestWS](requestws.md).[removeListener](requestws.md#removelistener)*

*Overrides void*

*Defined in node_modules/@types/node/stream.d.ts:122*

#### Parameters:

Name | Type |
------ | ------ |
`event` | string \| symbol |
`listener` | (...args: any[]) => void |

**Returns:** this

___

### resume

▸ **resume**(): this

*Inherited from [RequestWS](requestws.md).[resume](requestws.md#resume)*

*Defined in node_modules/@types/node/stream.d.ts:41*

**Returns:** this

___

### setEncoding

▸ **setEncoding**(`encoding`: BufferEncoding): this

*Inherited from [RequestWS](requestws.md).[setEncoding](requestws.md#setencoding)*

*Defined in node_modules/@types/node/stream.d.ts:39*

#### Parameters:

Name | Type |
------ | ------ |
`encoding` | BufferEncoding |

**Returns:** this

___

### setMaxListeners

▸ **setMaxListeners**(`n`: number): this

*Inherited from [RequestWS](requestws.md).[setMaxListeners](requestws.md#setmaxlisteners)*

*Defined in node_modules/@types/node/events.d.ts:68*

#### Parameters:

Name | Type |
------ | ------ |
`n` | number |

**Returns:** this

___

### setTimeout

▸ **setTimeout**(`msecs`: number, `callback?`: undefined \| () => void): this

*Inherited from [RequestWS](requestws.md).[setTimeout](requestws.md#settimeout)*

*Defined in node_modules/@types/node/http.d.ts:327*

#### Parameters:

Name | Type |
------ | ------ |
`msecs` | number |
`callback?` | undefined \| () => void |

**Returns:** this

___

### unpipe

▸ **unpipe**(`destination?`: NodeJS.WritableStream): this

*Inherited from [RequestWS](requestws.md).[unpipe](requestws.md#unpipe)*

*Defined in node_modules/@types/node/stream.d.ts:43*

#### Parameters:

Name | Type |
------ | ------ |
`destination?` | NodeJS.WritableStream |

**Returns:** this

___

### unshift

▸ **unshift**(`chunk`: any, `encoding?`: BufferEncoding): void

*Inherited from [RequestWS](requestws.md).[unshift](requestws.md#unshift)*

*Defined in node_modules/@types/node/stream.d.ts:44*

#### Parameters:

Name | Type |
------ | ------ |
`chunk` | any |
`encoding?` | BufferEncoding |

**Returns:** void

___

### wrap

▸ **wrap**(`oldStream`: ReadableStream): this

*Inherited from [RequestWS](requestws.md).[wrap](requestws.md#wrap)*

*Defined in node_modules/@types/node/stream.d.ts:45*

#### Parameters:

Name | Type |
------ | ------ |
`oldStream` | ReadableStream |

**Returns:** this

___

### from

▸ `Static`**from**(`iterable`: Iterable\<any> \| AsyncIterable\<any>, `options?`: ReadableOptions): Readable

*Inherited from [RequestWS](requestws.md).[from](requestws.md#from)*

*Defined in node_modules/@types/node/stream.d.ts:26*

A utility method for creating Readable Streams out of iterators.

#### Parameters:

Name | Type |
------ | ------ |
`iterable` | Iterable\<any> \| AsyncIterable\<any> |
`options?` | ReadableOptions |

**Returns:** Readable
