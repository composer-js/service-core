[@composer-js/service-core](../README.md) › [Globals](../globals.md) › [MetricsRoute](metricsroute.md)

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

* [config](metricsroute.md#private-config)
* [defaultIntervalId](metricsroute.md#private-defaultintervalid)
* [registry](metricsroute.md#private-registry)

### Methods

* [getMetrics](metricsroute.md#private-getmetrics)
* [getSingleMetric](metricsroute.md#private-getsinglemetric)

## Constructors

###  constructor

\+ **new MetricsRoute**(`config`: any): *[MetricsRoute](metricsroute.md)*

Defined in src/routes/MetricsRoute.ts:18

**Parameters:**

Name | Type |
------ | ------ |
`config` | any |

**Returns:** *[MetricsRoute](metricsroute.md)*

## Properties

### `Private` config

• **config**: *any*

Defined in src/routes/MetricsRoute.ts:16

___

### `Private` defaultIntervalId

• **defaultIntervalId**: *Timeout*

Defined in src/routes/MetricsRoute.ts:17

___

### `Private` registry

• **registry**: *Registry*

Defined in src/routes/MetricsRoute.ts:18

## Methods

### `Private` getMetrics

▸ **getMetrics**(): *Promise‹string›*

Defined in src/routes/MetricsRoute.ts:29

**Returns:** *Promise‹string›*

___

### `Private` getSingleMetric

▸ **getSingleMetric**(`metric`: any): *string*

Defined in src/routes/MetricsRoute.ts:35

**Parameters:**

Name | Type |
------ | ------ |
`metric` | any |

**Returns:** *string*
