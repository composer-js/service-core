///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2019 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { BackgroundService } from "../../../src/BackgroundService";

export default class MyThirdService extends BackgroundService {
    public counter: number;
    public started: boolean;
    public stopped: boolean;

    constructor(config: any, logger: any) {
        super(config, logger);

        this.counter = -1;
        this.started = false;
        this.stopped = true;
    }

    public get schedule(): string | undefined {
        return undefined;
    }

    public run(): void {
        this.counter++;
    }

    public async start(): Promise<void> {
        this.counter = 0;
        this.started = true;
    }

    public async stop(): Promise<void> {
        this.stopped = true;
    }
}
