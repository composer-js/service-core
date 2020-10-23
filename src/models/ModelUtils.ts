///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import * as fs from "fs";
import * as path from "path";

import { Logger } from "@composer-js/core";
import {
    getMetadataArgsStorage,
    Repository,
    Like,
    LessThanOrEqual,
    MoreThanOrEqual,
    Not,
    Equal,
    In,
    MoreThan,
    LessThan,
    Between,
    MongoRepository,
} from "typeorm";

const logger = Logger();

/**
 * Utility class for working with data model classes.
 *
 * @author Jean-Philippe Steinmetz
 */
class ModelUtils {
    /**
     * Retrieves a list of all of the specified class's properties that have the @Identifier decorator applied.
     *
     * @param modelClass The class definition to search for identifiers from.
     * @returns The list of all property names that have the @Identifier decorator applied.
     */
    public static getIdPropertyNames(modelClass: any): string[] {
        const results: string[] = [];

        // The props don't show up correctly on the class def. So instantiate a dummy object that we can read the props
        // from and look for identifiers.
        let proto: any = Object.getPrototypeOf(new modelClass());
        while (proto) {
            const props: string[] = Object.getOwnPropertyNames(proto);
            for (const prop of props) {
                const isIdentifier: boolean = Reflect.getMetadata("axr:isIdentifier", proto, prop);
                if (isIdentifier) {
                    results.push(prop);
                }
            }

            proto = Object.getPrototypeOf(proto);
        }

        return results;
    }

    /**
     * Builds a query object for use with `find` functions of the given repository for retrieving objects matching the
     * specified unique identifier.
     *
     * @param repo The repository to build the query for.
     * @param modelClass The class definition of the data model to build a search query for.
     * @param id The unique identifier to search for.
     * @returns An object that can be passed to a TypeORM `find` function.
     */
    public static buildIdSearchQuery<T>(
        repo: Repository<T> | MongoRepository<T> | undefined,
        modelClass: any,
        id: any,
        version?: number
    ): any {
        if (repo instanceof MongoRepository) {
            return ModelUtils.buildIdSearchQueryMongo(modelClass, id, version);
        } else {
            return ModelUtils.buildIdSearchQuerySQL(modelClass, id, version);
        }
    }

    /**
     * Builds a TypeORM compatible query object for use in `find` functions for retrieving objects matching the
     * specified unique identifier.
     *
     * @param modelClass The class definition of the data model to build a search query for.
     * @param id The unique identifier to search for.
     * @param version The version number of the document to search for.
     * @returns An object that can be passed to a TypeORM `find` function.
     */
    public static buildIdSearchQuerySQL(modelClass: any, id: any, version?: number): any {
        const props: string[] = ModelUtils.getIdPropertyNames(modelClass);

        // Create the where in SQL syntax. We only care about one of the identifier field's matching.
        // e.g. WHERE idField1 = :idField1 OR idField2 = :idField2 ...
        const where: any = [];
        for (const prop of props) {
            where.push(version !== undefined ? { [prop]: id, version } : { [prop]: id });
        }

        return { where };
    }

    /**
     * Builds a MongoDB compatible query object for use in `find` functions for retrieving objects matching the
     * specified unique identifier.
     *
     * @param modelClass The class definition of the data model to build a search query for.
     * @param id The unique identifier to search for.
     * @param version The version number of the document to search for.
     * @returns An object that can be passed to a MongoDB `find` function.
     */
    public static buildIdSearchQueryMongo(modelClass: any, id: any, version?: number): any {
        const props: string[] = ModelUtils.getIdPropertyNames(modelClass);

        // Create the where in SQL syntax. We only care about one of the identifier field's matching.
        // e.g. WHERE idField1 = :idField1 OR idField2 = :idField2 ...
        const query: any[] = [];
        for (const prop of props) {
            query.push({ [prop]: id });
        }

        if (version !== undefined) {
            return { $and: [{ $or: query }, { version }] };
        } else {
            return { $or: query };
        }
    }

    /**
     * Given a string containing a parameter value and/or a comparison operation return a TypeORM compatible find value.
     * e.g.
     *  Given the string "myvalue" will return an Eq("myvalue") object.
     *  Given the string "Like(myvalue)" will return an Like("myvalue") object.
     *
     * @param param
     */
    private static getQueryParamValue(param: string): any {
        // The value of each param can optionally have the operation included. If no operator is included Eq is
        // always assumed.
        // e.g. ?param1=eq(value)&param2=not(value)&param3=gt(value)
        const matches: RegExpMatchArray | null = param.match(new RegExp(/^([a-zA-Z]+)\((.*)\)$/, "i"));
        if (matches) {
            const opName: string = matches[1].toLowerCase();
            let value: any = matches[2];
            try {
                // Attempt to parse the value to a native type
                value = JSON.parse(matches[2]);
            } catch (err) {
                // If an error occurred it's because the value is a string or date, not another type.
                value = new Date(matches[2]);
                if (isNaN(value)) {
                    value = matches[2];
                }
            }

            switch (opName) {
                case "eq":
                    return Equal(value);
                case "gt":
                    return MoreThan(value);
                case "gte":
                    return MoreThanOrEqual(value);
                case "in": {
                    const args: string[] = value.split(",");
                    return In(args);
                }
                case "like":
                    return Like(value);
                case "lt":
                    return LessThan(value);
                case "lte":
                    return LessThanOrEqual(value);
                case "ne":
                case "not":
                    return Not(value);
                case "range": {
                    const args: string[] = value.split(",");
                    if (args.length != 2) {
                        throw new Error(
                            "Invalid range value: '" + value + "'. Expected 2 arguments, got " + args.length
                        );
                    }
                    try {
                        // Attempt to parse the range values to native types
                        return Between(JSON.parse(args[0]), JSON.parse(args[1]));
                    } catch (err) {
                        return Between(args[0], args[1]);
                    }
                }
                default:
                    return Equal(value);
            }
        } else {
            try {
                // Attempt to parse the value to a native type
                return Equal(JSON.parse(param));
            } catch (err) {
                // If an error occurred it's because the value is a string, not another type.
                const date: Date = new Date(param);
                return Equal(!isNaN(date.valueOf()) ? date : param);
            }
        }
    }

    /**
     * Given a string containing a parameter value and/or a comparison operation return a MongoDB compatible find value.
     * e.g.
     *  Given the string "myvalue" will return an `"myvalue"` object.
     *  Given the string "not(myvalue)" will return an `{ $not: "myvalue" }` object.
     *
     * @param param
     */
    private static getQueryParamValueMongo(param: string): any {
        // The value of each param can optionally have the operation included. If no operator is included Eq is
        // always assumed.
        // e.g. ?param1=eq(value)&param2=not(value)&param3=gt(value)
        const matches: RegExpMatchArray | null = param.match(new RegExp(/^([a-zA-Z]+)\((.*)\)$/, "i"));
        if (matches) {
            const opName: string = matches[1].toLowerCase();
            let value: any = matches[2];
            try {
                // Attempt to parse the value to a native type
                value = JSON.parse(matches[2]);
            } catch (err) {
                // If an error occurred it's because the value is a string or date, not another type.
                value = new Date(matches[2]);
                if (isNaN(value)) {
                    value = matches[2];
                }
            }
            switch (opName) {
                case "eq":
                    return value;
                case "gt":
                    return { $gt: value };
                case "gte":
                    return { $gte: value };
                case "in": {
                    const args: string[] = value.split(",");
                    return { $in: args };
                }
                case "like":
                    return { $regex: value, $options: "i" };
                case "lt":
                    return { $lt: value };
                case "lte":
                    return { $lte: value };
                case "ne":
                    return { $ne: value };
                case "not":
                    return { $not: value };
                case "range": {
                    const args: string[] = value.split(",");
                    if (args.length != 2) {
                        throw new Error(
                            "Invalid range value: '" + value + "'. Expected 2 arguments, got " + args.length
                        );
                    }
                    try {
                        // Attempt to parse the range values to native types
                        return { $gte: JSON.parse(args[0]), $lte: JSON.parse(args[1]) };
                    } catch (err) {
                        return { $gte: args[0], $lte: args[1] };
                    }
                }
                default:
                    return value;
            }
        } else {
            try {
                // Attempt to parse the value to a native type
                return JSON.parse(param);
            } catch (err) {
                // If an error occurred it's because the value is a string or date, not another type.
                const date: Date = new Date(param);
                return !isNaN(date.valueOf()) ? date : param;
            }
        }
    }

    /**
     * Builds a query object for the given criteria and repository. Query params can have a value containing a
     * conditional operator to apply for the search. The operator is encoded with the format `op(value)`. The following
     * operators are supported:
     * * `eq` - Returns matches whose parameter exactly matches of the given value. e.g. `param = value`
     * * `gt` - Returns matches whose parameter is greater than the given value. e.g. `param > value`
     * * `gte` - Returns matches whose parameter is greater than or equal to the given value. e.g. `param >= value`
     * * `in` - Returns matches whose parameter includes one of the given values. e.g. `param in ('value1', 'value2', 'value3', ...)`
     * * `like` - Returns matches whose parameter is lexographically similar to the given value. `param like value`
     * * `lt` -  Returns matches whose parameter is less than the given value. e.g. `param < value`
     * * `lte` - Returns matches whose parameter is less than or equal to than the given value. e.g. `param < value`
     * * `not` - Returns matches whose parameter is not equal to the given value. e.g. `param not value`
     * * `range` - Returns matches whose parameter is greater than or equal to first given value and less than or equal to the second. e.g. `param between(1,100)`
     *
     * When no operator is provided the comparison will always be evaluated as `eq`.
     *
     * @param modelClass The class definition of the data model to build a search query for.
     * @param repo The repository to build a search query for.
     * @param {any} params The URI parameters for the endpoint that was requested.
     * @param {any} queryParams The URI query parameters that were included in the request.
     * @param {bool} exactMatch Set to true to create a query where parameters are to be matched exactly, otherwise set to
     *                          false to use a 'contains' search.
     * @param {any} user The user that is performing the request.
     * @returns {object} The TypeORM compatible query object.
     */
    public static buildSearchQuery<T>(
        modelClass: any,
        repo: Repository<T> | MongoRepository<T> | undefined,
        params?: any,
        queryParams?: any,
        exactMatch: boolean = false,
        user?: any
    ): any {
        if (repo instanceof MongoRepository) {
            return ModelUtils.buildSearchQueryMongo(modelClass, params, queryParams, exactMatch, user);
        } else {
            return ModelUtils.buildSearchQuerySQL(modelClass, params, queryParams, exactMatch, user);
        }
    }

    /**
     * Builds a TypeORM compatible query object for the given criteria. Query params can have a value containing a
     * conditional operator to apply for the search. The operator is encoded with the format `op(value)`. The following
     * operators are supported:
     * * `eq` - Returns matches whose parameter exactly matches of the given value. e.g. `param = value`
     * * `gt` - Returns matches whose parameter is greater than the given value. e.g. `param > value`
     * * `gte` - Returns matches whose parameter is greater than or equal to the given value. e.g. `param >= value`
     * * `in` - Returns matches whose parameter includes one of the given values. e.g. `param in ('value1', 'value2', 'value3', ...)`
     * * `like` - Returns matches whose parameter is lexographically similar to the given value. `param like value`
     * * `lt` -  Returns matches whose parameter is less than the given value. e.g. `param < value`
     * * `lte` - Returns matches whose parameter is less than or equal to than the given value. e.g. `param < value`
     * * `not` - Returns matches whose parameter is not equal to the given value. e.g. `param not value`
     * * `range` - Returns matches whose parameter is greater than or equal to first given value and less than or equal to the second. e.g. `param between(1,100)`
     *
     * When no operator is provided the comparison will always be evaluated as `eq`.
     *
     * @param modelClass The class definition of the data model to build a search query for.
     * @param {any} params The URI parameters for the endpoint that was requested.
     * @param {any} queryParams The URI query parameters that were included in the request.
     * @param {bool} exactMatch Set to true to create a query where parameters are to be matched exactly, otherwise set to
     *                          false to use a 'contains' search.
     * @param {any} user The user that is performing the request.
     * @returns {object} The TypeORM compatible query object.
     */
    public static buildSearchQuerySQL(
        modelClass: any,
        params?: any,
        queryParams?: any,
        exactMatch: boolean = false,
        user?: any
    ): any {
        const query: any = {};
        query.where = [];

        // Add the URL parameters
        for (const key in params) {
            // If the value is 'me' that's a special keyword to reference the user ID.
            if (params[key] === "me") {
                if (!user) {
                    throw new Error("An anonymous user cannot make a request with a `me` reference.");
                }
                query.where[key] = user.uid;
            } else {
                query.where[key] = params[key];
            }
        }

        // Query parameters can be a single value or multiple. In the case of multiple we want to perform an OR
        // operation for each value. But to do that we need to build a separate object for each value containing all
        // the parameters as well.

        // So first let's find out how many queries in total we are going to need.
        let numQueries = 1;
        for (const key in queryParams) {
            const value: string | string[] = queryParams[key];
            if (Array.isArray(value)) {
                if (value.length > numQueries) {
                    numQueries = value.length;
                }
            }
        }

        // Now go through each query paramater. If the parameter is a single value, add it to each query object. If it's an array,
        // add only one value to each query object.
        for (let key in queryParams) {
            // Ignore reserved query parameters
            if (key.match(new RegExp("(jwt_|oauth_).*", "i"))) {
                continue;
            }

            // Limit, skip and sort are reserved for specifying query limits
            if (key.match(new RegExp("(limit|skip|sort).*", "i"))) {
                let value: any = queryParams[key];

                if (key === "limit") {
                    key = "take";
                    query[key] = Number(value);
                } else if (key === "skip") {
                    query[key] = Number(value);
                } else if (key === "sort") {
                    key = "order";

                    if (typeof value === "string") {
                        if (value.match(new RegExp(/^\{.*\}$/, "i"))) {
                            value = JSON.parse(value);
                        } else {
                            let newValue: any = value;
                            newValue = {};
                            newValue[value] = "ASC";
                            value = newValue;
                        }
                    }

                    query[key] = value;
                }

                continue;
            }

            if (Array.isArray(queryParams[key])) {
                // Add each value in the array to each corresponding query
                let i = 0;
                for (const value of queryParams[key]) {
                    if (!query.where[i]) {
                        query.where[i] = {};
                    }

                    query.where[i][key] = ModelUtils.getQueryParamValue(value);

                    i++;
                }
            } else {
                // Add the parameter to every query
                for (let i = 0; i < numQueries; i++) {
                    if (!query.where[i]) {
                        query.where[i] = {};
                    }

                    query.where[i][key] = ModelUtils.getQueryParamValue(queryParams[key]);
                }
            }
        }

        if (query.where.length == 0) {
            delete query.where;
        }

        if (query.take) {
            query.take = Math.min(query.take, 1000);
        } else {
            query.take = 100;
        }
        query.skip = query.skip ? query.skip : 0;

        return query;
    }

    /**
     * Builds a MongoDB compatible query object for the given criteria. Query params can have a value containing a
     * conditional operator to apply for the search. The operator is encoded with the format `op(value)`. The following
     * operators are supported:
     * * `eq` - Returns matches whose parameter exactly matches of the given value. e.g. `param = value`
     * * `gt` - Returns matches whose parameter is greater than the given value. e.g. `param > value`
     * * `gte` - Returns matches whose parameter is greater than or equal to the given value. e.g. `param >= value`
     * * `in` - Returns matches whose parameter includes one of the given values. e.g. `param in ('value1', 'value2', 'value3', ...)`
     * * `like` - Returns matches whose parameter is lexographically similar to the given value. `param like value`
     * * `lt` -  Returns matches whose parameter is less than the given value. e.g. `param < value`
     * * `lte` - Returns matches whose parameter is less than or equal to than the given value. e.g. `param < value`
     * * `not` - Returns matches whose parameter is not equal to the given value. e.g. `param not value`
     * * `range` - Returns matches whose parameter is greater than or equal to first given value and less than or equal to the second. e.g. `param between(1,100)`
     *
     * When no operator is provided the comparison will always be evaluated as `eq`.
     *
     * @param modelClass The class definition of the data model to build a search query for.
     * @param {any} params The URI parameters for the endpoint that was requested.
     * @param {any} queryParams The URI query parameters that were included in the request.
     * @param {bool} exactMatch Set to true to create a query where parameters are to be matched exactly, otherwise set to
     *                          false to use a 'contains' search.
     * @param {any} user The user that is performing the request.
     * @returns {object} The TypeORM compatible query object.
     */
    public static buildSearchQueryMongo(
        modelClass: any,
        params?: any,
        queryParams?: any,
        exactMatch: boolean = false,
        user?: any
    ): any {
        const query: any = {};
        let sort: any = undefined;

        // Add the URL parameters
        for (const key in params) {
            // If the value is 'me' that's a special keyword to reference the user ID.
            if (params[key] === "me") {
                if (!user) {
                    throw new Error("An anonymous user cannot make a request with a `me` reference.");
                }
                query[key] = user.uid;
            } else {
                query[key] = params[key];
            }
        }

        for (const key in queryParams) {
            // Ignore reserved query parameters
            if (key.match(new RegExp("(jwt_|oauth_).*", "i"))) {
                continue;
            }

            // Limit, skip and sort are reserved for specifying query limits
            if (key.match(new RegExp("(limit|skip|sort).*", "i"))) {
                let value: any = queryParams[key];

                if (key === "sort") {
                    if (typeof value === "string") {
                        if (value.match(new RegExp(/^\{.*\}$/, "i"))) {
                            value = JSON.parse(value);
                        } else {
                            let newValue: any = value;
                            newValue = {};
                            newValue[value] = "ASC";
                            value = newValue;
                        }
                    }

                    sort = {
                        ...sort,
                        ...value
                    };
                }

                continue;
            }

            if (Array.isArray(queryParams[key])) {
                // Add each value in the array to each corresponding query
                const conditions: any[] = [];
                for (const value of queryParams[key]) {
                    conditions.push(ModelUtils.getQueryParamValueMongo(value));
                }

                query[key] = { $or: conditions };
            } else {
                query[key] = ModelUtils.getQueryParamValueMongo(queryParams[key]);
            }
        }

        // Determine if the model class is versioned or not. We provide a different
        // aggregation query if it is.
        let result: any[] = [];
        if (modelClass && modelClass.trackChanges !== undefined) {
            result = [
                { $match: query },
                { $sort: { version: -1 } },
                { $group: { _id: "$uid", doc: { $first: "$$ROOT" } } },
                { $replaceRoot: { newRoot: "$doc" } }
            ];
        } else {
            result.push({ $match: query });
        }

        // Add the sort if specified
        if (sort) {
            result.push({ $sort: sort });
        }
        return result;
    }

    /**
     * Loads all model schema files from the specified path and returns a map containing all the definitions.
     *
     * @param src The path to the model files to load.
     * @returns A map containing of all loaded model names to their class definitions.
     */
    public static async loadModels(src: string, result: any = {}): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const fullPath = path.resolve(src);

                fs.readdir(fullPath, { withFileTypes: true }, async (err: any, files: any) => {
                    if (files) {
                        files.forEach(async (file: any) => {
                            let extension = path.extname(file.name);
                            if (file.isDirectory()) {
                                await this.loadModels(path.join(fullPath, file.name), result);
                            } else if (extension === ".js") {
                                let filePath = path.join(fullPath, file.name);
                                let name = path.relative(src, filePath).replace(path.sep, ".");
                                name = name.substr(0, name.length - 3);
                                let clazz: any = require(filePath).default;
                                if (clazz) {
                                    clazz.fqn = name;
                                    result[name] = clazz;
                                    logger.info("Loaded model: " + name);
                                }
                            } else if (extension === ".ts") {
                                let filePath = path.join(fullPath, file.name);
                                let name = path.relative(src, filePath).replace(path.sep, ".");
                                name = name.substr(0, name.length - 3);
                                let clazz: any = require(filePath).default;
                                if (clazz) {
                                    clazz.fqn = name;
                                    result[name] = clazz;
                                    logger.info("Loaded model: " + name);
                                }
                            }
                        });
                    }

                    resolve(result);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default ModelUtils;
