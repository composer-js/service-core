///////////////////////////////////////////////////////////////////////////////
// Copyright (C) AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import "reflect-metadata";

/**
 * Indicates that the decorated class is a background service job.
 *
 * @param schedule The optional crontab style schedule that the job will be executed with. If `undefined` the job
 *                  executes exactly once.
 */
 export function Job(schedule?: string) {
    return function (target: Function) {
        Reflect.defineMetadata("cjs:job", true, target);
        Reflect.defineMetadata("cjs:schedule", schedule, target);
        Object.defineProperty(target, "job", {
            enumerable: true,
            writable: false,
            value: true,
        });
        Object.defineProperty(target, "schedule", {
            enumerable: true,
            writable: false,
            value: schedule,
        });
    };
}