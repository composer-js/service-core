///////////////////////////////////////////////////////////////////////////////
// Copyright (C) Xsolla USA, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import * as oa from "openapi3-ts/oas31";
import { Config, Init } from "./decorators/ObjectDecorators";

/**
 * `OpenApiSpec` is a container for an OpenAPI specification.
 * 
 * This class wraps the behavior of openapi-ts to make it easier to build an OpenAPI
 * specification dynamically at runtime using the server ComposerJS information.
 * 
 * @author Jean-Philippe Steinmetz <info@acceleratxr.com>
 */
export class OpenApiSpec {
    private builder: oa.OpenApiBuilder;

    @Config()
    private config?: any;

    constructor(spec?: oa.OpenAPIObject) {
        this.builder = oa.OpenApiBuilder.create(spec);
    }

    public get openapi(): string {
        return this.builder.getSpec().openapi;
    }

    public get info(): oa.InfoObject {
        return this.builder.getSpec().info;
    }

    public get servers(): oa.ServerObject[] | undefined {
        return this.builder.getSpec().servers;
    }

    public get paths(): oa.PathsObject | undefined {
        return this.builder.getSpec().paths;
    }

    public get components(): oa.ComponentsObject | undefined {
        return this.builder.getSpec().components;
    }

    public get security(): oa.SecurityRequirementObject[] | undefined {
        return this.builder.getSpec().security;
    }

    public get tags(): oa.TagObject[] | undefined {
        return this.builder.getSpec().tags;
    }

    public get externalDocs(): oa.ExternalDocumentationObject | undefined {
        return this.builder.getSpec().externalDocs;
    }

    public get webhooks(): oa.PathsObject | undefined {
        return this.builder.getSpec().webhooks;
    }

    @Init
    private init(): void {
        this.builder.addInfo({
            title: this.config.get("title"),
            description: this.config.get("description"),
            termsOfService: this.config.get("termsOfService"),
            contact: this.config.get("contact"),
            license: this.config.get("license"),
            version: this.config.get("version")
        });
    }

    public getSpec(): oa.OpenAPIObject {
        return this.builder.getSpec();
    }

    public getSpecAsJson(replacer?: (key: string, value: unknown) => unknown, space?: string | number): string {
        return this.builder.getSpecAsJson(replacer, space);
    }

    public getSpecAsYaml(): string {
        return this.builder.getSpecAsYaml();
    }

    public addOpenApiVersion(openApiVersion: string): OpenApiSpec {
        this.builder.addOpenApiVersion(openApiVersion);
        return this;
    }

    public addInfo(info: oa.InfoObject): OpenApiSpec {
        this.builder.addInfo(info);
        return this;
    }

    public addContact(contact: oa.ContactObject): OpenApiSpec {
        this.builder.addContact(contact);
        return this;
    }

    public addLicense(license: oa.LicenseObject): OpenApiSpec {
        this.builder.addLicense(license);
        return this;
    }

    public addTitle(title: string): OpenApiSpec {
        this.builder.addTitle(title);
        return this;
    }

    public addDescription(description: string): OpenApiSpec {
        this.builder.addDescription(description);
        return this;
    }

    public addTermsOfService(termsOfService: string): OpenApiSpec {
        this.builder.addTermsOfService(termsOfService);
        return this;
    }

    public addVersion(version: string): OpenApiSpec {
        this.builder.addVersion(version);
        return this;
    }

    public addPath(path: string, pathItem: oa.PathItemObject): OpenApiSpec {
        this.builder.addPath(path, pathItem);
        return this;
    }

    public addSchema(name: string, schema: oa.SchemaObject | oa.ReferenceObject): OpenApiSpec {
        this.builder.addSchema(name, schema);
        return this;
    }

    public addResponse(name: string, response: oa.ResponseObject | oa.ReferenceObject): OpenApiSpec {
        this.builder.addResponse(name, response);
        return this;
    }

    public addParameter(name: string, parameter: oa.ParameterObject | oa.ReferenceObject): OpenApiSpec {
        this.builder.addParameter(name, parameter);
        return this;
    }

    public addExample(name: string, example: oa.ExampleObject | oa.ReferenceObject): OpenApiSpec {
        this.builder.addExample(name, example);
        return this;
    }

    public addRequestBody(name: string, reqBody: oa.RequestBodyObject | oa.ReferenceObject): OpenApiSpec {
        this.builder.addRequestBody(name, reqBody);
        return this;
    }

    public addHeader(name: string, header: oa.HeaderObject | oa.ReferenceObject): OpenApiSpec {
        this.builder.addHeader(name, header);
        return this;
    }

    public addSecurityScheme(name: string, secScheme: oa.SecuritySchemeObject | oa.ReferenceObject): OpenApiSpec {
        this.builder.addSecurityScheme(name, secScheme);
        return this;
    }

    public addLink(name: string, link: oa.LinkObject | oa.ReferenceObject): OpenApiSpec {
        this.builder.addLink(name, link);
        return this;
    }

    public addCallback(name: string, callback: oa.CallbackObject | oa.ReferenceObject): OpenApiSpec {
        this.builder.addCallback(name, callback);
        return this;
    }

    public addServer(server: oa.ServerObject): OpenApiSpec {
        this.builder.addServer(server);
        return this;
    }

    public addTag(tag: oa.TagObject): OpenApiSpec {
        this.builder.addTag(tag);
        return this;
    }

    public addExternalDocs(extDoc: oa.ExternalDocumentationObject): OpenApiSpec {
        this.builder.addExternalDocs(extDoc);
        return this;
    }

    public addWebhook(webhook: string, webhookItem: oa.PathItemObject): OpenApiSpec {
        this.builder.addWebhook(webhook, webhookItem);
        return this;
    }

    public addModel(name: string, clazz: any): OpenApiSpec {
        // TODO
        return this;
    }

    public addRoute(path: string, clazz: any, funcName: string): OpenApiSpec {
        const argMetadata: any = Reflect.getMetadata("cjs:args", Object.getPrototypeOf(clazz), funcName);
        const routeMetadata: any = Reflect.getMetadata("cjs:route", Object.getPrototypeOf(clazz), funcName);
        const { authRequired, methods, requiredRoles, validator, authStrategies } = routeMetadata;

        // TODO Look up reference to schema for route's associated data model (where applicable)
        let schemaRef: oa.ReferenceObject | undefined = undefined;
        if (clazz.modelClass) {
            
        }

        const operations: oa.OperationObject[] = [];
        for (const method of methods) {
            // TODO
        }

        this.builder.addPath(path, {
            ...operations,
            // TODO summary?: string;
            // TODO description?: string;
            // TODO get?: OperationObject;
            // TODO put?: OperationObject;
            // TODO post?: OperationObject;
            // TODO delete?: OperationObject;
            // TODO options?: OperationObject;
            // TODO head?: OperationObject;
            // TODO patch?: OperationObject;
            // TODO trace?: OperationObject;
            // TODO servers?: ServerObject[];
            // TODO parameters?: (ParameterObject | ReferenceObject)[];
        });

        return this;
    }
}