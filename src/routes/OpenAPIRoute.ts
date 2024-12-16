///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { ObjectDecorators } from "@composer-js/core";
import { OpenApiSpec } from "../OpenApiSpec";
import { Description, Returns, Summary } from "../decorators/DocDecorators";
import { Get, Route, ContentType } from "../decorators/RouteDecorators";
const swagger = require("swagger-ui-express");
const { Inject } = ObjectDecorators;

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

    @Summary("{{serviceName}} OpenAPI, HTLM format")
    @Description("Returns the OpenAPI specification for the service in HTML format.")
    @Get()
    @ContentType("text/html")
    @Returns([String])
    public getHTML(): string {
        return swagger.generateHTML(this.apiSpec.getSpec());
    }

    @Summary("{{serviceName}} OpenAPI, JSON format")
    @Description("Returns the OpenAPI specification for the service in JSON format.")
    @Get("openapi.json")
    @Returns([String])
    public getJSON(): any {
        return this.apiSpec.getSpec();
    }

    @Summary("{{serviceName}} OpenAPI, YAML format")
    @Description("Returns the OpenAPI specification for the service in YAML format.")
    @Get("openapi.yaml")
    @ContentType("text/yaml")
    @Returns([String])
    public getYAML(): string {
        return this.apiSpec.getSpecAsYaml();
    }
}