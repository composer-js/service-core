///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////

/**
 * Sends a `200 OK` response to the client containing a JSON body back to the client. The body to encode is determined
 * by the `result` property as set on the `res` argument. If no `result` property is found then a `204 NO_CONTENT`
 * response is sent instead.
 *
 * @param req The original HTTP request from the client.
 * @param res The outgoing HTTP response that will be sent to the client.
 */
export function marshall(req: any, res: any): any {
    if (res.result) {
        res.status(200).json(res.result);
    } else {
        res.send(204);
    }
}
