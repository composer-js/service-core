///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
const fs = require("fs");
import "reflect-metadata";

import { ModelUtils, Identifier } from "../src/service_core";
import {
    Not,
    Like,
    Equal,
    Between,
    MoreThan,
    MoreThanOrEqual,
    LessThan,
    LessThanOrEqual,
    In,
    Entity,
    PrimaryColumn,
    Column,
} from "typeorm";

@Entity()
class SingleIdentifierClass {
    @Identifier
    @PrimaryColumn()
    public id: string = "";
}

@Entity()
class DoubleIdentifierClass {
    @Identifier
    @PrimaryColumn()
    public id: string = "";

    @Identifier
    @Column()
    public id2: number = 0;
}

describe("ModelUtils Tests", () => {
    const config = require("./config");

    describe("MongoDB Tests", () => {
        it("Can build id search query with single identifier.", () => {
            const query: any = ModelUtils.buildIdSearchQueryMongo(SingleIdentifierClass, "MyID");
            expect(query).toEqual({
                $or: [{ id: "MyID" }],
            });
        });

        it("Can build id search query with multiple identifiers.", () => {
            const query: any = ModelUtils.buildIdSearchQueryMongo(DoubleIdentifierClass, "MyID");
            expect(query).toEqual({
                $or: [{ id: "MyID" }, { id2: "MyID" }],
            });
        });

        it.skip("Can build search query with limit.", () => {
            const request: any = {};
            request.query = {
                limit: 100,
            };

            const query = ModelUtils.buildSearchQueryMongo(request.params, request.query, true, request.user);
            expect(query).toEqual({
                take: 100,
                skip: 0,
            });
        });

        it.skip("Can build search query with capped limit.", () => {
            const request: any = {};
            request.query = {
                limit: 99999,
            };

            const query = ModelUtils.buildSearchQueryMongo(request.params, request.query, true, request.user);
            expect(query).toEqual({
                take: 1000,
                skip: 0,
            });
        });

        it.skip("Can build search query with skip.", () => {
            const request: any = {};
            request.query = {
                skip: 10,
            };

            const query = ModelUtils.buildSearchQueryMongo(request.params, request.query, true, request.user);
            expect(query).toEqual({
                skip: 10,
                take: 100,
            });
        });

        it.skip("Can build search query with sort (default).", () => {
            const request: any = {};
            request.query = {
                sort: "paramName",
            };

            const query = ModelUtils.buildSearchQueryMongo(request.params, request.query, true, request.user);
            expect(query).toEqual({
                order: {
                    paramName: "ASC",
                },
                skip: 0,
                take: 100,
            });
        });

        it.skip("Can build search query with sort (desc).", () => {
            const request: any = {};
            request.query = {
                sort: JSON.stringify({ paramName: "DESC" }),
            };

            const query = ModelUtils.buildSearchQueryMongo(request.params, request.query, true, request.user);
            expect(query).toEqual({
                order: {
                    paramName: "DESC",
                },
                skip: 0,
                take: 100,
            });
        });

        it.skip("Can build search query with sort (desc as object).", () => {
            const request: any = {};
            request.query = {
                sort: { paramName: "DESC" },
            };

            const query = ModelUtils.buildSearchQueryMongo(request.params, request.query, true, request.user);
            expect(query).toEqual({
                order: {
                    paramName: "DESC",
                },
                skip: 0,
                take: 100,
            });
        });

        it("Can build search query with single param (default)", () => {
            const request: any = {};
            request.query = {
                myParam: "myValue",
            };

            const query = ModelUtils.buildSearchQueryMongo(request.params, request.query, true, request.user);
            expect(query).toEqual({
                myParam: "myValue",
            });
        });

        it("Can build search query with single param of int type default", () => {
            const request: any = {};
            request.query = {
                myParam: "100.00",
            };

            const query = ModelUtils.buildSearchQueryMongo(request.params, request.query, true, request.user);
            expect(query).toEqual({
                myParam: 100,
            });
        });

        it("Can build search query with single param of boolean type (default)", () => {
            const request: any = {};
            request.query = {
                myParam: "true",
            };

            const query = ModelUtils.buildSearchQueryMongo(request.params, request.query, true, request.user);
            expect(query).toEqual({
                myParam: true,
            });
        });

        it("Can build search query with single param of date type (default)", () => {
            const request: any = {};
            request.query = {
                myParam: "2019-09-05T03:27:13.258Z",
            };

            const query = ModelUtils.buildSearchQueryMongo(request.params, request.query, true, request.user);
            expect(query).toEqual({
                myParam: new Date("2019-09-05T03:27:13.258Z"),
            });
        });

        it("Can build search query with single param (eq)", () => {
            const request: any = {};
            request.query = {
                myParam: "eq(myValue)",
            };

            const query = ModelUtils.buildSearchQueryMongo(request.params, request.query, true, request.user);
            expect(query).toEqual({
                myParam: "myValue",
            });
        });

        it("Can build search query with single param of boolean type (eq)", () => {
            const request: any = {};
            request.query = {
                myParam: "eq(true)",
            };

            const query = ModelUtils.buildSearchQueryMongo(request.params, request.query, true, request.user);
            expect(query).toEqual({
                myParam: true,
            });
        });

        it("Can build search query with single param of number type (eq)", () => {
            const request: any = {};
            request.query = {
                myParam: "eq(105.56)",
            };

            const query = ModelUtils.buildSearchQueryMongo(request.params, request.query, true, request.user);
            expect(query).toEqual({
                myParam: 105.56,
            });
        });

        it("Can build search query with single param (gt)", () => {
            const request: any = {};
            request.query = {
                myParam: "gt(myValue)",
            };

            const query = ModelUtils.buildSearchQueryMongo(request.params, request.query, true, request.user);
            expect(query).toEqual({
                myParam: { $gt: "myValue" },
            });
        });

        it("Can build search query with single param of date type (gt)", () => {
            const request: any = {};
            request.query = {
                myParam: "gt(2019-09-05T03:27:13.258Z)",
            };

            const query = ModelUtils.buildSearchQueryMongo(request.params, request.query, true, request.user);
            expect(query).toEqual({
                myParam: { $gt: new Date("2019-09-05T03:27:13.258Z") },
            });
        });

        it("Can build search query with single param (gte)", () => {
            const request: any = {};
            request.query = {
                myParam: "gte(myValue)",
            };

            const query = ModelUtils.buildSearchQueryMongo(request.params, request.query, true, request.user);
            expect(query).toEqual({
                myParam: { $gte: "myValue" },
            });
        });

        it("Can build search query with single param (in)", () => {
            const request: any = {};
            request.query = {
                myParam: "in(myValue,myValue2,myValue3,myValue4)",
            };

            const query = ModelUtils.buildSearchQueryMongo(request.params, request.query, true, request.user);
            expect(query).toEqual({
                myParam: { $in: ["myValue", "myValue2", "myValue3", "myValue4"] },
            });
        });

        it("Can build search query with single param (like)", () => {
            const request: any = {};
            request.query = {
                myParam: "like(myValue)",
            };

            const query = ModelUtils.buildSearchQueryMongo(request.params, request.query, true, request.user);
            expect(query).toEqual({
                myParam: { $options: "i", $regex: "myValue" },
            });
        });

        it("Can build search query with single param (lt)", () => {
            const request: any = {};
            request.query = {
                myParam: "lt(myValue)",
            };

            const query = ModelUtils.buildSearchQueryMongo(request.params, request.query, true, request.user);
            expect(query).toEqual({
                myParam: { $lt: "myValue" },
            });
        });

        it("Can build search query with single param (lte)", () => {
            const request: any = {};
            request.query = {
                myParam: "lte(myValue)",
            };

            const query = ModelUtils.buildSearchQueryMongo(request.params, request.query, true, request.user);
            expect(query).toEqual({
                myParam: { $lte: "myValue" },
            });
        });

        it("Can build search query with single param (not)", () => {
            const request: any = {};
            request.query = {
                myParam: "not(myValue)",
            };

            const query = ModelUtils.buildSearchQueryMongo(request.params, request.query, true, request.user);
            expect(query).toEqual({
                myParam: { $not: "myValue" },
            });
        });

        it("Can build search query with single param (range)", () => {
            const request: any = {};
            request.query = {
                myParam: "range(1,100)",
            };

            const query = ModelUtils.buildSearchQueryMongo(request.params, request.query, true, request.user);
            expect(query).toEqual({
                myParam: { $gte: "1", $lte: "100" },
            });
        });

        it("Can build search query with multiple params.", () => {
            const request: any = {};
            request.query = {
                equals: "myValue",
                not: "not(myValue2)",
                range: "range(1,100)",
            };

            const query = ModelUtils.buildSearchQueryMongo(request.params, request.query, true, request.user);
            expect(query).toEqual({
                equals: "myValue",
                not: { $not: "myValue2" },
                range: { $gte: "1", $lte: "100" },
            });
        });

        // TODO Fix me
        it.skip("Can build search query with multiple params with same name.", () => {
            const request: any = {};
            request.query = {
                param: ["Eq(myValue)", "Not(myValue2)", "Like(myValue3)"],
            };

            const query = ModelUtils.buildSearchQueryMongo(request.params, request.query, true, request.user);
            expect(query).toEqual({
                $or: [
                    {
                        param: "myValue",
                    },
                    {
                        param: { $not: "myValue2" },
                    },
                    {
                        param: { $options: "i", $regex: "myValue3" },
                    },
                ],
            });
        });

        // TODO Fix me
        it.skip("Can build search query with multiple params and with same name.", () => {
            const request: any = {};
            request.query = {
                param: ["Eq(myValue)", "Not(myValue2)", "Like(myValue3)"],
                param2: "range(0,100)",
                param3: "hello",
            };

            const query = ModelUtils.buildSearchQueryMongo(request.params, request.query, true, request.user);
            expect(query).toEqual({
                where: [
                    {
                        param: Equal("myValue"),
                        param2: Between("0", "100"),
                        param3: Equal("hello"),
                    },
                    {
                        param: Not("myValue2"),
                        param2: Between("0", "100"),
                        param3: Equal("hello"),
                    },
                    {
                        param: Like("myValue3"),
                        param2: Between("0", "100"),
                        param3: Equal("hello"),
                    },
                ],
                skip: 0,
                take: 100,
            });
        });

        it("Can build search query and filter reserved words.", () => {
            const request: any = {};
            request.query = {
                jwt_token: "df0afawfa09uf093joihff3983ufq3olifhj329f8uh.f23908uf2ofj32fo2u.f208f09qf2",
                oauth_token: "df0afawfa09uf093joihff3983ufq3olifhj329f8uh.f23908uf2ofj32fo2u.f208f09qf2",
            };

            const query = ModelUtils.buildSearchQueryMongo(request.params, request.query, true, request.user);
            expect(query).toEqual({});
        });
    });

    describe("SQL Tests", () => {
        it("Can build search query with limit.", () => {
            const request: any = {};
            request.query = {
                limit: 100,
            };

            const query = ModelUtils.buildSearchQuerySQL(request.params, request.query, true, request.user);
            expect(query).toEqual({
                take: 100,
                skip: 0,
            });
        });

        it("Can build search query with capped limit.", () => {
            const request: any = {};
            request.query = {
                limit: 99999,
            };

            const query = ModelUtils.buildSearchQuerySQL(request.params, request.query, true, request.user);
            expect(query).toEqual({
                take: 1000,
                skip: 0,
            });
        });

        it("Can build search query with skip.", () => {
            const request: any = {};
            request.query = {
                skip: 10,
            };

            const query = ModelUtils.buildSearchQuerySQL(request.params, request.query, true, request.user);
            expect(query).toEqual({
                skip: 10,
                take: 100,
            });
        });

        it("Can build search query with sort (default).", () => {
            const request: any = {};
            request.query = {
                sort: "paramName",
            };

            const query = ModelUtils.buildSearchQuerySQL(request.params, request.query, true, request.user);
            expect(query).toEqual({
                order: {
                    paramName: "ASC",
                },
                skip: 0,
                take: 100,
            });
        });

        it("Can build search query with sort (desc).", () => {
            const request: any = {};
            request.query = {
                sort: JSON.stringify({ paramName: "DESC" }),
            };

            const query = ModelUtils.buildSearchQuerySQL(request.params, request.query, true, request.user);
            expect(query).toEqual({
                order: {
                    paramName: "DESC",
                },
                skip: 0,
                take: 100,
            });
        });

        it("Can build search query with sort (desc as object).", () => {
            const request: any = {};
            request.query = {
                sort: { paramName: "DESC" },
            };

            const query = ModelUtils.buildSearchQuerySQL(request.params, request.query, true, request.user);
            expect(query).toEqual({
                order: {
                    paramName: "DESC",
                },
                skip: 0,
                take: 100,
            });
        });

        it("Can build search query with single param (default)", () => {
            const request: any = {};
            request.query = {
                myParam: "myValue",
            };

            const query = ModelUtils.buildSearchQuerySQL(request.params, request.query, true, request.user);
            expect(query).toEqual({
                where: [
                    {
                        myParam: Equal("myValue"),
                    },
                ],
                skip: 0,
                take: 100,
            });
        });

        it("Can build search query with single param of type boolean (default)", () => {
            const request: any = {};
            request.query = {
                myParam: "true",
            };

            const query = ModelUtils.buildSearchQuerySQL(request.params, request.query, true, request.user);
            expect(query).toEqual({
                where: [
                    {
                        myParam: Equal(true),
                    },
                ],
                skip: 0,
                take: 100,
            });
        });

        it("Can build search query with single param of date type (default)", () => {
            const request: any = {};
            request.query = {
                myParam: "2019-09-05T03:27:13.258Z",
            };

            const query = ModelUtils.buildSearchQuerySQL(request.params, request.query, true, request.user);
            expect(query).toEqual({
                skip: 0,
                take: 100,
                where: [
                    {
                        myParam: Equal(new Date("2019-09-05T03:27:13.258Z")),
                    },
                ],
            });
        });

        it("Can build search query with single param of type number (default)", () => {
            const request: any = {};
            request.query = {
                myParam: "105.56",
            };

            const query = ModelUtils.buildSearchQuerySQL(request.params, request.query, true, request.user);
            expect(query).toEqual({
                where: [
                    {
                        myParam: Equal(105.56),
                    },
                ],
                skip: 0,
                take: 100,
            });
        });

        it("Can build search query with single param (eq)", () => {
            const request: any = {};
            request.query = {
                myParam: "eq(myValue)",
            };

            const query = ModelUtils.buildSearchQuerySQL(request.params, request.query, true, request.user);
            expect(query).toEqual({
                where: [
                    {
                        myParam: Equal("myValue"),
                    },
                ],
                skip: 0,
                take: 100,
            });
        });

        it("Can build search query with single param of type boolean (eq)", () => {
            const request: any = {};
            request.query = {
                myParam: "eq(false)",
            };

            const query = ModelUtils.buildSearchQuerySQL(request.params, request.query, true, request.user);
            expect(query).toEqual({
                where: [
                    {
                        myParam: Equal(false),
                    },
                ],
                skip: 0,
                take: 100,
            });
        });

        it("Can build search query with single param of type number (eq)", () => {
            const request: any = {};
            request.query = {
                myParam: "eq(105.56)",
            };

            const query = ModelUtils.buildSearchQuerySQL(request.params, request.query, true, request.user);
            expect(query).toEqual({
                where: [
                    {
                        myParam: Equal(105.56),
                    },
                ],
                skip: 0,
                take: 100,
            });
        });

        it("Can build search query with single param (gt)", () => {
            const request: any = {};
            request.query = {
                myParam: "gt(myValue)",
            };

            const query = ModelUtils.buildSearchQuerySQL(request.params, request.query, true, request.user);
            expect(query).toEqual({
                where: [
                    {
                        myParam: MoreThan("myValue"),
                    },
                ],
                skip: 0,
                take: 100,
            });
        });

        it("Can build search query with single param of date type (gt)", () => {
            const request: any = {};
            request.query = {
                myParam: "gt(2019-09-05T03:27:13.258Z)",
            };

            const query = ModelUtils.buildSearchQuerySQL(request.params, request.query, true, request.user);
            expect(query).toEqual({
                skip: 0,
                take: 100,
                where: [
                    {
                        myParam: MoreThan(new Date("2019-09-05T03:27:13.258Z")),
                    },
                ],
            });
        });

        it("Can build search query with single param (gte)", () => {
            const request: any = {};
            request.query = {
                myParam: "gte(myValue)",
            };

            const query = ModelUtils.buildSearchQuerySQL(request.params, request.query, true, request.user);
            expect(query).toEqual({
                where: [
                    {
                        myParam: MoreThanOrEqual("myValue"),
                    },
                ],
                skip: 0,
                take: 100,
            });
        });

        it("Can build search query with single param (in)", () => {
            const request: any = {};
            request.query = {
                myParam: "in(myValue,myValue2,myValue3,myValue4)",
            };

            const query = ModelUtils.buildSearchQuerySQL(request.params, request.query, true, request.user);
            expect(query).toEqual({
                where: [
                    {
                        myParam: In(["myValue", "myValue2", "myValue3", "myValue4"]),
                    },
                ],
                skip: 0,
                take: 100,
            });
        });

        it("Can build search query with single param (like)", () => {
            const request: any = {};
            request.query = {
                myParam: "like(myValue)",
            };

            const query = ModelUtils.buildSearchQuerySQL(request.params, request.query, true, request.user);
            expect(query).toEqual({
                where: [
                    {
                        myParam: Like("myValue"),
                    },
                ],
                skip: 0,
                take: 100,
            });
        });

        it("Can build search query with single param (lt)", () => {
            const request: any = {};
            request.query = {
                myParam: "lt(myValue)",
            };

            const query = ModelUtils.buildSearchQuerySQL(request.params, request.query, true, request.user);
            expect(query).toEqual({
                where: [
                    {
                        myParam: LessThan("myValue"),
                    },
                ],
                skip: 0,
                take: 100,
            });
        });

        it("Can build search query with single param (lte)", () => {
            const request: any = {};
            request.query = {
                myParam: "lte(myValue)",
            };

            const query = ModelUtils.buildSearchQuerySQL(request.params, request.query, true, request.user);
            expect(query).toEqual({
                where: [
                    {
                        myParam: LessThanOrEqual("myValue"),
                    },
                ],
                skip: 0,
                take: 100,
            });
        });

        it("Can build search query with single param (not)", () => {
            const request: any = {};
            request.query = {
                myParam: "not(myValue)",
            };

            const query = ModelUtils.buildSearchQuerySQL(request.params, request.query, true, request.user);
            expect(query).toEqual({
                where: [
                    {
                        myParam: Not("myValue"),
                    },
                ],
                skip: 0,
                take: 100,
            });
        });

        it("Can build search query with single param (range)", () => {
            const request: any = {};
            request.query = {
                myParam: "range(1,100)",
            };

            const query = ModelUtils.buildSearchQuerySQL(request.params, request.query, true, request.user);
            expect(query).toEqual({
                where: [
                    {
                        myParam: Between("1", "100"),
                    },
                ],
                skip: 0,
                take: 100,
            });
        });
        it("Can build search query with multiple params.", () => {
            const request: any = {};
            request.query = {
                equals: "myValue",
                not: "not(myValue2)",
                range: "range(1,100)",
            };

            const query = ModelUtils.buildSearchQuerySQL(request.params, request.query, true, request.user);
            expect(query).toEqual({
                where: [
                    {
                        equals: Equal("myValue"),
                        not: Not("myValue2"),
                        range: Between("1", "100"),
                    },
                ],
                skip: 0,
                take: 100,
            });
        });

        it("Can build search query with multiple params with same name.", () => {
            const request: any = {};
            request.query = {
                param: ["Eq(myValue)", "Not(myValue2)", "Like(myValue3)"],
            };

            const query = ModelUtils.buildSearchQuerySQL(request.params, request.query, true, request.user);
            expect(query).toEqual({
                where: [
                    {
                        param: Equal("myValue"),
                    },
                    {
                        param: Not("myValue2"),
                    },
                    {
                        param: Like("myValue3"),
                    },
                ],
                skip: 0,
                take: 100,
            });
        });

        it("Can build search query with multiple params and with same name.", () => {
            const request: any = {};
            request.query = {
                param: ["Eq(myValue)", "Not(myValue2)", "Like(myValue3)"],
                param2: "range(0,100)",
                param3: "hello",
            };

            const query = ModelUtils.buildSearchQuerySQL(request.params, request.query, true, request.user);
            expect(query).toEqual({
                where: [
                    {
                        param: Equal("myValue"),
                        param2: Between("0", "100"),
                        param3: Equal("hello"),
                    },
                    {
                        param: Not("myValue2"),
                        param2: Between("0", "100"),
                        param3: Equal("hello"),
                    },
                    {
                        param: Like("myValue3"),
                        param2: Between("0", "100"),
                        param3: Equal("hello"),
                    },
                ],
                skip: 0,
                take: 100,
            });
        });

        it("Can build search query and filter reserved words.", () => {
            const request: any = {};
            request.query = {
                jwt_token: "df0afawfa09uf093joihff3983ufq3olifhj329f8uh.f23908uf2ofj32fo2u.f208f09qf2",
                oauth_token: "df0afawfa09uf093joihff3983ufq3olifhj329f8uh.f23908uf2ofj32fo2u.f208f09qf2",
            };

            const query = ModelUtils.buildSearchQuerySQL(request.params, request.query, true, request.user);
            expect(query).toEqual({
                skip: 0,
                take: 100,
            });
        });
    });

    it("Can load models.", async () => {
        const results: Map<string, any> = await ModelUtils.loadModels("./test/models");
        expect(results).toBeDefined();
        expect(results).toHaveProperty("Item");
        expect(results).toHaveProperty("User");
    });
});
