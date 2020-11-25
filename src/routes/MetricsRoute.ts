///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2019 AcceleratXR, Inc. All rights reserved.
///////////////////////////////////////////////////////////////////////////////
import * as prom from "prom-client";
import { Get, Param, Route, ContentType } from "../decorators/RouteDecorators";

/**
 * Handles all REST API requests for the endpoint `/metrics'. This route handler produces Prometheus compatible metrics
 * for use with a Prometheus based server.
 *
 * Services that wish to provide metrics to be exposed via this route can register them using the global registry
 * from the provided `prom-client` dependency. See the `prom-client` documentation for more details.
 */
@Route("/metrics")
export default class MetricsRoute {
    private config: any;
    private registry: prom.Registry;

    constructor(config: any) {
        this.config = config;
        this.registry = prom.register;
    }

    @Get()
    @ContentType(prom.register.contentType)
    private async getMetrics(): Promise<string> {
        return this.registry.metrics();
    }

    @Get("/:metric")
    @ContentType(prom.register.contentType)
    private getSingleMetric(@Param("metric") metric: any): string {
        return this.registry.getSingleMetricAsString(metric);
    }
}
