///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { OpenApiSpec } from "../OpenApiSpec";
import { Description, Returns } from "../decorators/DocDecorators";
import { Inject } from "../decorators/ObjectDecorators";
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
    @Inject(OpenApiSpec)
    private apiSpec: OpenApiSpec = new OpenApiSpec();

    @Description("Returns the OpenAPI specification for the service in HTML format.")
    @Get("api-docs")
    @ContentType("text/html")
    @Returns([String])
    public getHTML(): string {
        return swagger.generateHTML(this.apiSpec.getSpec());
    }

    @Description("Returns the OpenAPI specification for the service in JSON format.")
    @Get("openapi.json")
    @Returns([String])
    public getJSON(): string {
        return this.apiSpec.getSpecAsJson();
    }

    @Description("Returns the OpenAPI specification for the service in YAML format.")
    @Get("openapi.yaml")
    @ContentType("text/yaml")
    @Returns([String])
    public getYAML(): string {
        return this.apiSpec.getSpecAsYaml();
    }
}