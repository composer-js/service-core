**[@composer-js/service-core](../README.md)**

> [Globals](../globals.md) / MetricsRoute

# Class: MetricsRoute

Handles all REST API requests for the endpoint `/metrics'. This route handler produces Prometheus compatible metrics
for use with a Prometheus based server.

Services that wish to provide metrics to be exposed via this route can register them using the global registry
from the provided `prom-client` dependency. See the `prom-client` documentation for more details.

## Hierarchy

* **MetricsRoute**

## Index

### Constructors

* [constructor](metricsroute.md#constructor)

### Properties

* [config](metricsroute.md#config)
* [registry](metricsroute.md#registry)

### Methods

* [getMetrics](metricsroute.md#getmetrics)
* [getSingleMetric](metricsroute.md#getsinglemetric)

## Constructors

### constructor

\+ **new MetricsRoute**(`config`: any): [MetricsRoute](metricsroute.md)

*Defined in src/routes/MetricsRoute.ts:17*

#### Parameters:

Name | Type |
------ | ------ |
`config` | any |

**Returns:** [MetricsRoute](metricsroute.md)

## Properties

### config

• `Private` **config**: any

*Defined in src/routes/MetricsRoute.ts:16*

___

### registry

• `Private` **registry**: Registry

*Defined in src/routes/MetricsRoute.ts:17*

## Methods

### getMetrics

▸ `Private`**getMetrics**(): Promise\<string>

*Defined in src/routes/MetricsRoute.ts:26*

**Returns:** Promise\<string>

___

### getSingleMetric

▸ `Private`**getSingleMetric**(`metric`: any): string

*Defined in src/routes/MetricsRoute.ts:32*

#### Parameters:

Name | Type |
------ | ------ |
`metric` | any |

**Returns:** string
