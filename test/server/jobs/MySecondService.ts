///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2019 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { BackgroundService } from "../../../src/BackgroundService";
import { Job } from "../../../src/decorators/JobDecorators";

@Job("* * * * * *")
export default class MySecondService extends BackgroundService {
    public counter: number;
    public started: boolean;
    public stopped: boolean;

    constructor(config: any, logger: any) {
        super(config, logger);

        this.counter = -1;
        this.started = false;
        this.stopped = true;
    }

    public run(): void {
        this.counter++;
    }

    public async start(): Promise<void> {
        this.counter = 0;
        this.started = true;
        this.stopped = false;
    }

    public async stop(): Promise<void> {
        this.started = false;
        this.stopped = true;
    }
}
