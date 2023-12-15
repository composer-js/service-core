///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Get, Route } from "../decorators/RouteDecorators";
import { Config } from "../decorators/ObjectDecorators";
import { Description, Returns } from "../decorators/DocDecorators";

/**
 * The `StatusRoute` provides a default `/` endpoint the returns metadata information about the service such as
 * name, version.
 *
 * @author Jean-Philippe Steinmetz
 */
@Route("/")
export class StatusRoute {
    @Config()
    private config: any;

    @Description("Returns information about the service and it's operational status.")
    @Get()
    @Returns([Object])
    private get(): any {
        return {
            name: this.config.get("service_name"),
            time: new Date().toISOString(),
            version: this.config.get("version"),
        };
    }
}
