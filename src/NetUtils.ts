///////////////////////////////////////////////////////////////////////////////
// Copyright (C) AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { promises as dns, LookupAddress } from "dns";
import { Request as XRequest } from "express";

/**
 * Provides common utilities and functions for working with networking related problems.
 * 
 * @author Jean-Philippe Steinmetz <info@acceleratxr.com>
 */
export class NetUtils {
    /**
     * Extracts the IP address from a given url or HTTP request.
     * 
     * @param req The url or HTTP request to extract the IP from.
     * @returns A `string` containing the IP address if found, otherwise `undefined`.
     */
    public static async getIPAddress(urlOrRequest: string | XRequest): Promise<string | undefined> {
        let result: string | undefined = undefined;

        if (typeof urlOrRequest === "string") {
            const url: string = urlOrRequest as string;

            // Check that for IPv4/IPv6 addresses
            let matches: RegExpMatchArray | null = null;
            if ((matches = url.match(/^((?:[0-9]{1,3}\.){3}[0-9]{1,3}):?([0-9]+)?$/)) ||
                (matches = url.match(/^\[?((::)?([0-9a-fA-F]{1,4}:){0,7}:?([0-9a-fA-F]{1,4}:?){1,7})\]?:?([0-9]+)?$/))) {
                result = matches[1];
            }
            // Maybe it's a URL?
            else {
                try {
                    const tmp: URL = new URL(url);
                    // Check that the host isn't already an IPv4/IPv6 address
                    let matches: RegExpMatchArray | null = null;
                    if ((matches = tmp.host.match(/^((?:[0-9]{1,3}\.){3}[0-9]{1,3}):?([0-9]+)?$/)) ||
                        (matches = tmp.host.match(/^\[?((::)?([0-9a-fA-F]{1,4}:){0,7}:?([0-9a-fA-F]{1,4}:?){1,7})\]?:?([0-9]+)?$/))) {
                        result = matches[1];
                    } else {
                        // Attempt to resolve the domain name
                        matches = tmp.host.match(/^((?:[A-Za-z0-9-]+\.?)+[A-Za-z0-9]{1,3})(:\d{1,5})?$/);
                        if (matches) {
                            const lookup: LookupAddress = await dns.lookup(matches[1]);
                            result = lookup.address;
                        }
                    }
                } catch (err) {
                    // Do nothing
                }
            }
        }
        else if(urlOrRequest) {
            const req: XRequest = urlOrRequest as XRequest;

            if (req.headers["x-original-forwarded-for"]) {
                result = req.headers["x-original-forwarded-for"] as string;
            }
            else if (req.headers["x-forwarded-for"]) {
                result = req.headers["x-forwarded-for"] as string;
            }
            else if (req.headers["x-real-ip"]) {
                result = req.headers["x-real-ip"] as string;
            }
            else if (req.connection) {
                result = req.connection.remoteAddress;
            }
        }

        return result;
    }
}