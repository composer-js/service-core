/**
 * Defines the unique codes for all common API errors.
 */
export enum ApiErrors {
    UNKNOWN = "api-001",
    INTERNAL_ERROR = "api-002",
    INVALID_REQUEST = "api-003",
    NOT_FOUND = "api-010",
    INVALID_OBJECT_VERSION = "api-011",
    OBJECT_ID_MISMATCH = "api-012",
    SEARCH_INVALID_RANGE = "api-013",
    SEARCH_INVALID_ME_REFERENCE = "api-014",
    BULK_UPDATE_FAILURE = "api-021",
    AUTH_REQUIRED = "api-100",
    AUTH_FAILED = "api-101",
    AUTH_PERMISSION_FAILURE = "api-102",
}

/**
 * Defines the default message of all common API errors.
 */
export enum ApiErrorMessages {
    UNKNOWN = "An unknown error has occurred. Please try again.",
    INTERNAL_ERROR = "An internal error has occurred. Please contact the adminstrator.",
    INVALID_REQUEST = "Invalid message or request.",
    NOT_FOUND = "No resource could be found with the specified identifier.",
    INVALID_OBJECT_VERSION = "Invalid object version. Do you have the latest version?",
    OBJECT_ID_MISMATCH = "The object provided does not match the identifier given.",
    SEARCH_INVALID_RANGE = "Invalid range value: '{{value}}'. Expected 2 arguments, got {{length}}",
    SEARCH_INVALID_ME_REFERENCE = "Use of the `me` reference requires authentication.",
    BULK_UPDATE_FAILURE = "Failed to update one or more objects.",
    AUTH_REQUIRED = "Authorization is required to access this resource.",
    AUTH_FAILED = "Invalid or missing authentication token.",
    AUTH_PERMISSION_FAILURE = "User does not have permission to perform this action.",
}