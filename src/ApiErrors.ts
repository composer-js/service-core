/**
 * Defines the unique codes for all common API errors.
 */
export enum ApiErrors {
    UNKNOWN = "api-1000",
    NOT_FOUND = "api-1001",
    AUTH_REQUIRED = "api-1002",
    AUTH_FAILED = "api-1003",
    SEARCH_INVALID_RANGE = "api-",
}

/**
 * Defines the default message of all common API errors.
 */
export enum ApiErrorMessages {
    AUTH_REQUIRED = "Authorization is required to access this resource.",
    AUTH_WEBSOCKET_FAILED = "Failed to authenticate.",
}