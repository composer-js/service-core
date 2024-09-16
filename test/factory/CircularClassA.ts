import { ObjectDecorators } from "@composer-js/core";
import { CircularClassB } from "./CircularClassB";
const { Destroy, Inject } = ObjectDecorators;

export class CircularClassA {
    @Inject("CircularClassB")
    public dep?: CircularClassB;

    constructor() {
        // NO-OP
    }

    @Destroy
    public async destroy(): Promise<void> {
        this.dep = undefined;
    }
}
