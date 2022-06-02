///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { Get, Route, ContentType } from "../decorators/RouteDecorators";
const swagger = require("swagger-ui-express");

/**
 * The `OpenAPIController` provides a default route to `/openapi.json` that exposes a provided OpenAPI
 * specification to requesting clients.
 *
 * @author Jean-Philippe Steinmetz
 */
@Route("/")
export class OpenAPIRoute {
    /** The underlying OpenAPI specification. */
    private apiSpec: any;

    /**
     * Constructs a new `OpenAPIController` object with the specified defaults.
     *
     * @param apiSpec The OpenAPI specification object to serve.
     */
    constructor(apiSpec: any) {
        this.apiSpec = apiSpec;
    }

    @Get("api-docs")
    @ContentType("text/html")
    private get(): any {
        return swagger.generateHTML(this.apiSpec);
    }

    @Get("openapi.json")
    private getJSON(): any {
        return this.apiSpec;
    }
}