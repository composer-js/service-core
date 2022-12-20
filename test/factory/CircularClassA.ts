import { Destroy, Inject } from "../../src/decorators/ObjectDecorators";
import { CircularClassB } from "./CircularClassB";

export class CircularClassA {
    @Inject("CircularClassB")
    public dep?: CircularClassB;

    constructor() {
    }

    @Destroy
    public async destroy(): Promise<void> {
        this.dep = undefined;
    }
}