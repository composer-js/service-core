///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Get, Route } from "../decorators/RouteDecorators";
import { Request, Response } from "express";

/**
 * The `IndexRoute` provides a default `/` endpoint the returns metadata information about the service such as
 * name, version.
 *
 * @author Jean-Philippe Steinmetz
 */
@Route("/")
class IndexRoute {
    private config: any;

    constructor(config: any) {
        this.config = config;
    }

    @Get()
    private get(): any {
        return {
            name: this.config.get("service_name"),
            time: new Date().toISOString(),
            version: this.config.get("version"),
        };
    }
}

export default IndexRoute;
