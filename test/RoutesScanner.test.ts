///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2018 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import { RoutesScanner } from "../src/service_core";
import "reflect-metadata";

describe("RoutesScanner Tests", () => {
    it("Can scan for route classes.", async () => {
        let scanner: RoutesScanner = new RoutesScanner("./test/routes");
        expect(scanner).toBeDefined();
        let routes: any[] = await scanner.scan();
        expect(routes).toBeDefined();
        expect(routes).toHaveLength(5);
        expect(routes[0]).toHaveProperty("modelClass"); // CacheUserRoute
        expect(routes[2]).toHaveProperty("modelClass"); // ItemRoute
        expect(routes[3]).toHaveProperty("modelClass"); // UserRoute
        expect(routes[4]).toHaveProperty("modelClass"); // UserRoute
    });
});
