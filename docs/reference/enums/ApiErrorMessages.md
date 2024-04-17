[@composer-js/service-core](../README.md) / [Exports](../modules.md) / ApiErrorMessages

# Enumeration: ApiErrorMessages

Defines the default message of all common API errors.

## Table of contents

### Enumeration Members

- [AUTH\_FAILED](ApiErrorMessages.md#auth_failed)
- [AUTH\_PERMISSION\_FAILURE](ApiErrorMessages.md#auth_permission_failure)
- [AUTH\_REQUIRED](ApiErrorMessages.md#auth_required)
- [BULK\_UPDATE\_FAILURE](ApiErrorMessages.md#bulk_update_failure)
- [IDENTIFIER\_EXISTS](ApiErrorMessages.md#identifier_exists)
- [INTERNAL\_ERROR](ApiErrorMessages.md#internal_error)
- [INVALID\_OBJECT\_VERSION](ApiErrorMessages.md#invalid_object_version)
- [INVALID\_REQUEST](ApiErrorMessages.md#invalid_request)
- [NOT\_FOUND](ApiErrorMessages.md#not_found)
- [OBJECT\_ID\_MISMATCH](ApiErrorMessages.md#object_id_mismatch)
- [SEARCH\_INVALID\_ME\_REFERENCE](ApiErrorMessages.md#search_invalid_me_reference)
- [SEARCH\_INVALID\_RANGE](ApiErrorMessages.md#search_invalid_range)
- [UNKNOWN](ApiErrorMessages.md#unknown)

## Enumeration Members

### AUTH\_FAILED

• **AUTH\_FAILED** = ``"Invalid or missing authentication token."``

#### Defined in

composer-service-core/src/ApiErrors.ts:35

___

### AUTH\_PERMISSION\_FAILURE

• **AUTH\_PERMISSION\_FAILURE** = ``"User does not have permission to perform this action."``

#### Defined in

composer-service-core/src/ApiErrors.ts:36

___

### AUTH\_REQUIRED

• **AUTH\_REQUIRED** = ``"Authorization is required to access this resource."``

#### Defined in

composer-service-core/src/ApiErrors.ts:34

___

### BULK\_UPDATE\_FAILURE

• **BULK\_UPDATE\_FAILURE** = ``"Failed to update one or more objects."``

#### Defined in

composer-service-core/src/ApiErrors.ts:33

___

### IDENTIFIER\_EXISTS

• **IDENTIFIER\_EXISTS** = ``"A resource with that identifier already exists."``

#### Defined in

composer-service-core/src/ApiErrors.ts:28

___

### INTERNAL\_ERROR

• **INTERNAL\_ERROR** = ``"An internal error has occurred. Please contact the adminstrator."``

#### Defined in

composer-service-core/src/ApiErrors.ts:25

___

### INVALID\_OBJECT\_VERSION

• **INVALID\_OBJECT\_VERSION** = ``"Invalid object version. Do you have the latest version?"``

#### Defined in

composer-service-core/src/ApiErrors.ts:29

___

### INVALID\_REQUEST

• **INVALID\_REQUEST** = ``"Invalid message or request."``

#### Defined in

composer-service-core/src/ApiErrors.ts:26

___

### NOT\_FOUND

• **NOT\_FOUND** = ``"No resource could be found with the specified identifier."``

#### Defined in

composer-service-core/src/ApiErrors.ts:27

___

### OBJECT\_ID\_MISMATCH

• **OBJECT\_ID\_MISMATCH** = ``"The object provided does not match the identifier given."``

#### Defined in

composer-service-core/src/ApiErrors.ts:30

___

### SEARCH\_INVALID\_ME\_REFERENCE

• **SEARCH\_INVALID\_ME\_REFERENCE** = ``"Use of the `me` reference requires authentication."``

#### Defined in

composer-service-core/src/ApiErrors.ts:32

___

### SEARCH\_INVALID\_RANGE

• **SEARCH\_INVALID\_RANGE** = ``"Invalid range value: '{{value}}'. Expected 2 arguments, got {{length}}"``

#### Defined in

composer-service-core/src/ApiErrors.ts:31

___

### UNKNOWN

• **UNKNOWN** = ``"An unknown error has occurred. Please try again."``

#### Defined in

composer-service-core/src/ApiErrors.ts:24
