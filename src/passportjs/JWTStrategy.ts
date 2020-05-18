////////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Request } from "express";
import { Strategy } from "passport-strategy";
import { JWTUtils, JWTUtilsConfig, JWTUser } from "@composer-js/core";

/**
 * Describes the configuration options that can be used to initialize JWTStrategy.
 *
 * @author Jean-Philippe Steinmetz
 */
export class Options {
    /** Set to true to allow a failure to be processed as a success, otherwise set to false. Default value is `false`. */
    public allowFailure: boolean = false;
    /** The configuration options to pass to the JWTUtils library during token verification. */
    public config: JWTUtilsConfig = { password: "" };
    /** The name of the header to look for when performing header based authentication. Default value is `Authorization`. */
    public headerKey: string = "authorization";
    /** The authorization scheme type when using header based authentication. Default value is `jwt`. */
    public headerScheme: string = "jwt";
    /** The name of the cookie to retrieve the token from when using cookie based authentication. Default value is `jwt`. */
    public cookieName: string = "jwt";
    /** The name of the secured cookie to retreive the token from when using cookie based authentication. */
    public cookieSecure: boolean = false;
    /** The name of the requesty query parameter to retreive the token from when using query based authentication. Default value is `jwt_token`. */
    public queryKey: string = "jwt_token";
}

/**
 * Passport strategy for handling JSON Web Token authentication. This strategy performs JWT verification and will
 * search for a token by one of the following methods (in order of precedence).
 * * Cookie
 * * Query Parameter
 * * Header
 *
 * @author Jean-Philippe Steinmetz
 */
export class JWTStrategy extends Strategy {
    private options: Options;

    constructor(options: Options) {
        super();
        this.options = options;
        this.options.headerKey = options.headerKey.toLowerCase();
    }

    public authenticate(req: Request, options?: any): void {
        options = options || {};

        // The token may be embedded either in a cookie or as a query parameter
        let token: string = "";
        if (this.options.cookieSecure && this.options.cookieName && req.signedCookies) {
            token = req.signedCookies[this.options.cookieName] as string;
        }
        if (!token && !this.options.cookieSecure && this.options.cookieName && req.cookies) {
            token = req.cookies[this.options.cookieName] as string;
        }
        if (!token && this.options.queryKey && req.query && this.options.queryKey in req.query) {
            token = req.query[this.options.queryKey] as string;
        }

        let error: string = "";
        let user: JWTUser | undefined = undefined;

        // If the token has been found, verify it.
        if (token && token.length > 0) {
            try {
                user = JWTUtils.decodeToken(this.options.config, token);
            } catch (err) {
                error = err;
            }
        }

        // Next check the headers. It's possible there is more than one header value defined. Loop through each of
        // them until we have a verified token.
        if (!user && this.options.headerKey && this.options.headerKey in req.headers) {
            const value: string | string[] | undefined = req.headers[this.options.headerKey];
            const headers: string[] = Array.isArray(value)
                ? (value as string[])
                : typeof value === "string"
                ? [value as string]
                : [];

            // Loop throught th
            for (const header in headers) {
                const parts: string[] = headers[header].split(" ");
                if (parts.length != 2) {
                    error = "Invalid or missing token.";
                    continue;
                }

                if (!parts[0].match(new RegExp("^" + this.options.headerScheme + "$", "i"))) {
                    error = "Missing or invalid token";
                    continue;
                }

                token = parts[1];
                try {
                    user = JWTUtils.decodeToken(this.options.config, token);
                    // If the verification succeeded clear out any existing error, we have success
                    if (user) {
                        error = "";
                        // No need to continue checking remaining headers. We have our success.
                        break;
                    }
                } catch (err) {
                    error = err;
                }
            }
        }

        // Record any final error that occurred.
        if (error.length > 0) {
            this.error(new Error(error));
        }

        // Did we succeed at decoding a JWT payload?
        if (user) {
            this.success(user);
        }
        // If failure is allowed perform a pass to let prior strategies determine final success
        else if (options.allowFailure) {
            this.pass();
        } else {
            this.fail(undefined, 401);
        }
    }
}
