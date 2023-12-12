import { Destroy, Inject } from "../../src/decorators/ObjectDecorators";
import { CircularClassA } from "./CircularClassA";

export class CircularClassB {
    @Inject("CircularClassA")
    public dep?: CircularClassA;

    constructor() {
        // NO-OP
    }

    @Destroy
    public async destroy(): Promise<void> {
        this.dep = undefined;
    }
}