///////////////////////////////////////////////////////////////////////////////
// Copyright (C) Xsolla USA, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import * as oa from "openapi3-ts/oas31";
import { Config, Init } from "./decorators/ObjectDecorators";
import { BaseMongoEntity } from "./models";

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

    /**
     * Adds a ComposerJS model class to the OpenAPI specification as a schema.
     * 
     * @param name The name of the model to add.
     * @param clazz The class prototype to build the schema from.
     */
    public addModel(name: string, clazz: any): OpenApiSpec {
        const schema: oa.SchemaObject = this.createSchemaObject(clazz);
        this.builder.addSchema(name, schema);
        return this;
    }

    /**
     * Adds a ComposerJS route handler to the OpenAPI specification.
     * 
     * @param name The name of the route handler. (e.g. findAll)
     * @param path The complete path of the route handler. (e.g. `/my/resources/:id`)
     * @param method The HTTP verb type that the route handler processes. (e.g. `GET`)
     * @param metadata The object containing all API information about the route handler.
     * @param docs The object containing all documentation information about the route handler.
     * @param routeClass The parent route class that the route handler belongs to.
     */
    public addRoute(name: string, path: string, method: string, metadata: any, docs: any, routeClass: any): OpenApiSpec {
        const { after, authRequired, before } = metadata;
        let { authStrategies } = metadata;
        const { description, example, summary, tags } = docs;
        const contentType = metadata.contentType || "application/json";

        if (authRequired && !authStrategies) {
            authStrategies = ["jwt"];
        }

        const extensions: oa.ISpecificationExtension[] = [];
        let parameters: (oa.ParameterObject | oa.ReferenceObject)[] | undefined = undefined;
        let schema: oa.SchemaObject | oa.ReferenceObject | undefined = undefined;
        const security: oa.SecurityRequirementObject[] | undefined = authRequired ? [] : undefined;

        if (after) {
            extensions.push({ "x-after": after });
        }

        if (before) {
            extensions.push({ "x-before": before });
        }
        
        if (routeClass.modelClass) {
            // Look up reference to schema for route's associated data model (where applicable)
            const fqn: string = routeClass.modelClass.name;
            schema = this.getSchemaReference(fqn);
            // If no reference was found we'll create the schema definition now and link it
            if (!schema) {
                this.addModel(fqn, routeClass.modelClass);
                schema = this.getSchemaReference(fqn);
            }
            extensions.push({"x-schema": fqn });
        } else {
            extensions.push({"x-name": routeClass.name.replace("Route", "") });
        }

        // If the path has `.websocket` at the end, make sure to add the `x-upgrade` extension
        if (path.includes(".websocket")) {
            extensions.push({ "x-upgrade": true });
        }

        // Convert the list of authStrategies to a SecurityRequirementObject array
        if (security) {
            for (const authStrategy of authStrategies) {
                security.push({ [authStrategy]: [] });
            }
        }
        
        const data: oa.PathItemObject = {
            [method]: {
                description,
                parameters,
                requestBody: ["patch", "post", "put"].includes(method.toLowerCase()) ? {
                    content: {
                        [contentType]: {
                            schema,
                            example,
                            // encoding?: EncodingObject; TODO?
                        }
                    }
                } : undefined,
                responses: {
                    default: {
                        description: "", // TODO
                        content: {
                            [contentType]: {
                                schema,
                                example,
                                // encoding?: EncodingObject; TODO?
                            }
                        }
                    }
                },
                security,
                summary,
                tags,
                "x-name": name
            },
            parameters,
            ...extensions
        };
        this.builder.addPath(path, data);

        return this;
    }

    /**
     * Determines if the given type is a primitive or built-in class type.
     * @param value 
     * @returns 
     */
    private isBuiltInType(value: any): boolean {
        // Is it a primitive type?
        if (typeof value !== 'object' || value === null) {
            return true;
        }
      
        const constructor = value.constructor;
      
        // Check against common built-in types
        const builtInTypes = [Object, Array, Date, RegExp, Map, Set, Promise, Function];
        return builtInTypes.some((type) => constructor === type || constructor.prototype instanceof type);
    }

    /**
     * Creates a new SchemaObject given the specified class prototype.
     * 
     * @param clazz The class prototype to build a schema object from.
     * @returns The schema object with all information derived from the given class prototype.
     */
    public createSchemaObject(clazz: any): oa.SchemaObject {
        const baseClass: any = Object.getPrototypeOf(clazz);
        const cache: any = Reflect.getMetadata("cjs:cacheTTL", clazz);
        const datastore: any = Reflect.getMetadata("cjs:datastore", clazz);
        const defaults: any = new clazz();
        const shardConfig: any = Reflect.getMetadata("cjs:shardConfig", clazz);
        const trackChanges: any = Reflect.getMetadata("cjs:trackChanges", clazz);

        const result: oa.SchemaObject = {};
        result.properties = {};
        result.required = [];

        if (baseClass && baseClass.name) {
            result["x-baseClass"] = baseClass.name;
        }
        if (cache) {
            result["x-cache"] = cache;
        }
        if (datastore) {
            result["x-datastore"] = datastore;
        }
        if (shardConfig) {
            result["x-shard"] = shardConfig;
        }
        if (trackChanges) {
            result["x-versioned"] = trackChanges;
        }

        const propertyNames: string[] = Object.getOwnPropertyNames(defaults);
        for (const member of propertyNames) {
            const docs: any = Reflect.getMetadata("cjs:docs", defaults, member);
            const { description, example, format } = docs;
            const identifier: boolean = Reflect.getMetadata("cjs:isIdentifier", defaults, member);
            const typeInfo: any = Reflect.getMetadata("design:type", defaults, member);
            const subTypeInfo: any = Reflect.getMetadata("design:subtype", defaults, member);

            // Is the type a primitive or built-in? If it's a built-in type we'll construct a SchemaObject for it.
            // If it's not a primitive or built-in, then it should have its own schema definition in the spec.
            if (this.isBuiltInType(typeInfo)) {
                const propSchema: oa.SchemaObject = {
                    default: defaults[member],
                    description,
                    example,
                    format,
                    type: typeInfo.name,
                };

                if (identifier) {
                    propSchema["x-identifier"] = identifier;
                }

                // When a sub-type is specified it's because we're either dealing with a container or an enum.
                if (subTypeInfo) {
                    // Enums have a main type of `string`, whereas containers will be an `array`,
                    if (typeInfo.name.toLowerCase() === "string") {
                        propSchema.enum = Object.getOwnPropertyNames(subTypeInfo).map((key: string) => subTypeInfo[key]);
                    } else if (typeInfo.name.toLowerCase() === "array") {
                        propSchema.items = this.getSchemaReference(subTypeInfo.name) || this.createSchemaObject(subTypeInfo);
                    } else {
                        propSchema["$ref"] = this.getSchemaReference(subTypeInfo.name);
                    }
                }
                
                result.properties[member] = propSchema;
            } else {
                // Unfortunately the TypeInfo information obtained from reflection here is not the same as the one
                // that you get from the import itself, it's just a constructor, with all other metadata and
                // inheritance information gone. So we're going to do something uncooth and assume we can link
                // to a schema even if one doesn't exist at this very moment (the schema for this type may not have
                // been created yet).
                result.properties[member] = {
                    $ref: `#/components/schemas/${subTypeInfo.name}`
                };
            }

            if (defaults[member] !== undefined) {
                result.required.push(member);
            }
        }

        return result;
    }

    /**
     * Returns a reference to an existing schema defined in the OpenAPI specification for the given name.
     * 
     * @param name The name of the schema to find a reference for.
     * @returns The reference to the schema with the given name, otherwise `undefined`.
     */
    public getSchemaReference(name: string): oa.ReferenceObject | undefined {
        const components: oa.ComponentsObject | undefined = this.components;
        if (components && components.schemas && components.schemas[name]) {
            return {
                $ref: `#/components/schemas/${name}`
            };
        }
        return undefined;
    }
}