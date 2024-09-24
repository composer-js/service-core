///////////////////////////////////////////////////////////////////////////////
// Copyright (C) Xsolla (USA), Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { BackgroundService } from "../../../src/BackgroundService";

export default class MyFirstService extends BackgroundService {
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
        return "* * * * * *";
    }

    public async run(): Promise<void> {
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
