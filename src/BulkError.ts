/**
 * An error take that takes an array of other errors.
 */
export class BulkError extends Error {
    /**
     * The list of errors that have been thrown.
     */
    public readonly errors: (Error | null)[] = [];

    /**
     * The response status of the error.
     */
    public readonly status: number = 0;

    constructor(errs: (Error | null)[], message: string) {
        super(message);
        this.errors = errs;

        // Find the first valid status code
        for (const err of errs) {
            if (err && "status" in err) {
                this.status = (err as any).status;
                break;
            }
        }
    }
}