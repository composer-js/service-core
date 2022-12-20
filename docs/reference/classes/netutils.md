[@acceleratxr/service-core](../README.md) › [Globals](../globals.md) › [NetUtils](netutils.md)

# Class: NetUtils

Provides common utilities and functions for working with networking related problems.

**`author`** Jean-Philippe Steinmetz <info@acceleratxr.com>

## Hierarchy

* **NetUtils**

## Index

### Methods

* [getIPAddress](netutils.md#static-getipaddress)

## Methods

### `Static` getIPAddress

▸ **getIPAddress**(`urlOrRequest`: string | XRequest): *Promise‹string | undefined›*

Defined in src/NetUtils.ts:19

Extracts the IP address from a given url or HTTP request.

**Parameters:**

Name | Type |
------ | ------ |
`urlOrRequest` | string &#124; XRequest |

**Returns:** *Promise‹string | undefined›*

A `string` containing the IP address if found, otherwise `undefined`.
