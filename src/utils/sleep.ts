///////////////////////////////////////////////////////////////////////////////
// Copyright (C) AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
/**
 * Starts a timer to suspend execution for a given number of milliseconds.
 * @param ms The number of milliseconds to suspend. Default is `1`.
 */
export default async function(ms: number = 1): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(async () => {
            resolve();
        }, ms);
    });
}