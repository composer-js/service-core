///////////////////////////////////////////////////////////////////////////////
// Copyright (C) Xsolla USA, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import "reflect-metadata";

/**
 * Provides a detailed describing the class, property or function.
 *
 * @param value The description of the class, property or function.
 */
export function Description(value: string) {
    return function (target: any, propertyKey: string) {
        const docs: any = Reflect.getMetadata("cjs:docs", target, propertyKey) || {};
        docs.description = value;
        Reflect.defineMetadata("cjs:docs", docs, target, propertyKey);
    };
}

/**
 * Provides a example representation of the property or function return value.
 *
 * @param value The example value.
 */
export function Example(value: any) {
    return function (target: any, propertyKey: string) {
        const docs: any = Reflect.getMetadata("cjs:docs", target, propertyKey) || {};
        docs.example = value;
        Reflect.defineMetadata("cjs:docs", docs, target, propertyKey);
    };
}

/**
 * Describes the underlying format of a class's property.
 *
 * @param value The format of the property's property.
 */
export function Format(value: 'int32' | 'int64' | 'float' | 'double' | 'byte' | 'binary' | 'date' | 'date-time' | 'password' | string) {
    return function (target: any, propertyKey: string) {
        const docs: any = Reflect.getMetadata("cjs:docs", target, propertyKey) || {};
        docs.format = value;
        Reflect.defineMetadata("cjs:docs", docs, target, propertyKey);
    };
}

/**
 * Provides a brief summary about the class, property or function.
 *
 * @param value The summary of the class, property or function.
 */
export function Summary(value: string) {
    return function (target: any, propertyKey: string) {
        const docs: any = Reflect.getMetadata("cjs:docs", target, propertyKey) || {};
        docs.summary = value;
        Reflect.defineMetadata("cjs:docs", docs, target, propertyKey);
    };
}

/**
 * Provides a list of searchable tags associated with the property or function.
 *
 * @param value The list of searchable tags.
 */
export function Tags(value: string[]) {
    return function (target: any, propertyKey: string) {
        const docs: any = Reflect.getMetadata("cjs:docs", target, propertyKey) || {};
        docs.tags = value;
        Reflect.defineMetadata("cjs:docs", docs, target, propertyKey);
    };
}

/**
 * Stores runtime metadata about the typing information of a class property.
 * 
 * @param type The optional primary type of the property.
 * @param subtype The optional sub-type of the property (to identify underlying for containers).
 */
export function TypeInfo(type?: any, subtype?: any) {
    return function (target: any, propertyKey: string) {
        const designInfo: any = Reflect.getMetadata("design:type", target, propertyKey);
        Reflect.defineMetadata("design:type", type || designInfo, target, propertyKey);
        Reflect.defineMetadata("design:subtype", subtype, target, propertyKey);
    };
}