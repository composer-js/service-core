import { ObjectDecorators } from "@composer-js/core";
import { CircularClassA } from "./CircularClassA";
const { Destroy, Inject } = ObjectDecorators;

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
