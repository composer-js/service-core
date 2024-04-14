import { ApiError } from "@composer-js/core";

/**
 * An error take that takes an array of other errors.
 */
export class BulkError extends ApiError {
    /**
     * The list of errors that have been thrown.
     */
    public readonly errors: (Error | null)[] = [];

    /**
     * The response status of the error.
     */
    public readonly status: number = 0;

    constructor(errs: (Error | null)[], code: string, status: number, message?: string) {
        super(code, status, message);
        this.errors = errs;
    }
}