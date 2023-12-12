///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Get, Route } from "../decorators/RouteDecorators";
import { Config } from "../decorators/ObjectDecorators";
import { Returns } from "../decorators/DocDecorators";

/**
 * The `IndexRoute` provides a default `/` endpoint the returns metadata information about the service such as
 * name, version.
 *
 * @author Jean-Philippe Steinmetz
 */
@Route("/")
export class IndexRoute {
    @Config()
    private config: any;

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
