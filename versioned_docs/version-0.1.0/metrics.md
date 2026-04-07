---
id: metrics
title: Metrics
description: Metrics Overview
slug: /metrics
---

# Metrics

When `metrics.provider: prometheus` is configured, metrics are exposed at `/metrics` in Prometheus format and can be scraped by any compatible collector.

```yaml
gateway:
  server:
    metrics:
      enabled: true
      provider: prometheus
```

## Available Metrics
---

| Metric | Type | Labels | Description |
|---|---|---|---|
| `kono_requests_total` | Counter | `route`, `method`, `status` | Total incoming requests that reached a flow, labeled by final HTTP status |
| `kono_requests_duration_seconds` | Histogram | `route`, `method` | End-to-end request latency from gateway entry to response write |
| `kono_requests_in_flight` | Gauge | — | Current number of requests being processed |
| `kono_failed_requests_total` | Counter | `reason` | Requests rejected before reaching a flow (see reasons below) |
| `kono_upstream_requests_total` | Counter | `route`, `upstream` | Total requests dispatched to each upstream |
| `kono_upstream_errors_total` | Counter | `route`, `upstream`, `kind` | Upstream errors broken down by error kind |
| `kono_upstream_latency_seconds` | Histogram | `route`, `upstream` | Time from upstream request dispatch to response received |
| `kono_upstream_retries_total` | Counter | `route`, `upstream` | Number of retry attempts per upstream |
| `kono_circuit_breaker_state` | Gauge | `upstream` | Circuit breaker state: `0`=closed, `1`=open, `2`=half-open |

## Upstream Error Kinds
---

The `kind` label on `kono_upstream_errors_total` reflects the internal error classification:

| Kind | Description |
|---|---|
| `timeout` | Upstream did not respond within the configured timeout |
| `connection` | Failed to establish a connection to the upstream |
| `bad_status` | Upstream returned HTTP 5xx |
| `read_error` | Connection was closed while reading the response body |
| `body_too_large` | Response body exceeded `max_response_body_size` |
| `canceled` | Request was canceled by the client |
| `circuit_open` | Request was rejected by an open circuit breaker (upstream not contacted) |
| `policy_violation` | Response violated upstream policy (`allowed_statuses`, `require_body`) |

## Failure Reasons
---

`kono_failed_requests_total` tracks requests that never reach a flow:

| Reason | Description |
|---|---|
| `too_many_requests` | Rate limiter rejected the request |
| `no_matched_flow` | No flow matched the request path or method |
| `body_too_large` | Request body exceeded the gateway body size limit (5MB) |

## Grafana
---

Connect Prometheus as a data source and use `kono_*` metrics to build dashboards. Recommended starting panels:

- **RPS** — `rate(kono_requests_total[1m])`
- **p99 latency** — `histogram_quantile(0.99, rate(kono_requests_duration_seconds_bucket[5m]))`
- **Upstream error rate** — `rate(kono_upstream_errors_total[1m])`
- **Circuit breaker open** — `kono_circuit_breaker_state == 1`
- **Retry pressure** — `rate(kono_upstream_retries_total[5m])`
- **In-flight requests** — `kono_requests_in_flight`
---