---
id: configuration
title: Configuration
description: Configuration Reference
slug: /configuration
---

# Configuration Reference

Kono uses a single declarative YAML configuration file.

:::info
Only YAML is supported. JSON and TOML are not supported to reduce complexity and avoid inconsistencies.
:::

## Root
---

```yaml
schema: v1
debug: false
```

| Field | Type | Required | Description |
|---|---|---|---|
| `schema` | string | ✅ | Must be `v1` |
| `debug` | bool | | Enables debug logging. Adds verbose output across router, dispatcher, and upstream components |

## Server
---

```yaml
gateway:
  server:
    port: 7805
    timeout: 20s
    pprof:
      enabled: true
      port: 6060
    metrics:
      enabled: true
      provider: prometheus
```

| Field | Type | Default | Description |
|---|---|---|---|
| `port` | int | — | HTTP port the gateway listens on |
| `timeout` | duration | `5s` | Read and write timeout for incoming requests |
| `pprof.enabled` | bool | `false` | Enable pprof profiling server (localhost only) |
| `pprof.port` | int | `6060` | Port for the pprof server |
| `metrics.enabled` | bool | `false` | Enable `/metrics` endpoint |
| `metrics.provider` | string | — | Metrics provider. Currently supports `prometheus` |

## Routing
---

```yaml
gateway:
  routing:
    trusted_proxies:
      - 127.0.0.1/32
      - 10.0.0.0/8
    rate_limiter:
      enabled: true
      config:
        limit: 100
        window: 1s
    flows:
      - ...
```

| Field | Type | Description |
|---|---|---|
| `trusted_proxies` | list[CIDR] | IP ranges whose `X-Forwarded-*` headers are trusted. Untrusted proxy headers are ignored and rewritten |
| `rate_limiter.enabled` | bool | Enable per-IP rate limiting |
| `rate_limiter.config` | map | Rate limiter configuration (`limit`, `window`) |

## Flows
---

A flow defines how an incoming request is matched, processed, and dispatched to upstreams.

```yaml
flows:
  - path: /api/v1/users/{user_id}
    method: GET
    aggregation:
      strategy: merge
      best_effort: true
      on_conflict:
        policy: prefer
        prefer_upstream: users
    max_parallel_upstreams: 10
    plugins:
      - ...
    middlewares:
      - ...
    scripts:
      - ...
    upstreams:
      - ...
```

| Field | Type | Required | Description |
|---|---|---|---|
| `path` | string | ✅ | URL path to match. Supports `{param}` path parameters |
| `method` | string | ✅ | HTTP method: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS` |
| `aggregation.strategy` | string | ✅ | How to combine upstream responses: `merge`, `array`, or `namespace` |
| `aggregation.best_effort` | bool | | If `true`, return partial results when some upstreams fail (HTTP 206 Partial Content) |
| `aggregation.on_conflict.policy` | string | | Conflict resolution for `merge` strategy: `overwrite`, `first`, `error`, `prefer` |
| `aggregation.on_conflict.prefer_upstream` | string | | Name of the upstream to prefer when `policy: prefer` |
| `max_parallel_upstreams` | int | | Max concurrent upstream calls for this flow. Defaults to `2 * NumCPU` |

### Aggregation Strategies
---

| Strategy | Description |
|---|---|
| `merge` | Merges JSON objects from all upstreams into one. Conflict policy controls key collisions |
| `array` | Wraps all upstream responses in a JSON array |
| `namespace` | Places each upstream response under its name as a key: `{"users": {...}, "orders": {...}}` |

### Conflict Policies (merge only)
---

| Policy | Description |
|---|---|
| `overwrite` | Later upstream overwrites earlier value on key collision |
| `first` | First upstream's value is kept on key collision |
| `error` | Return `409 Conflict` on any key collision |
| `prefer` | Value from `prefer_upstream` is always used on collision |

## Upstreams
---

```yaml
upstreams:
  - name: users
    hosts:
      - http://user-service-1.local
      - http://user-service-2.local
    path: /v1/users/{user_id}
    method: GET
    timeout: 3s
    forward_queries: ["*"]
    forward_headers: ["X-*"]
    forward_params: ["tenant_id"]
    policy:
      ...
```

| Field | Type | Default | Description |
|---|---|---|---|
| `name` | string | auto-generated | Upstream identifier used in logs, metrics, and `namespace` strategy |
| `hosts` | list or string | — | Target host(s). Multiple hosts enable load balancing |
| `path` | string | | Upstream path. `{param}` placeholders are expanded from flow path parameters |
| `method` | string | | HTTP method override. Falls back to the original request method |
| `timeout` | duration | `3s` | Per-request timeout including retries |
| `forward_queries` | list | | Query params to forward. `"*"` forwards all, or specify exact keys |
| `forward_headers` | list | | Headers to forward. Supports `"*"`, prefix wildcards `"X-*"`, or exact names |
| `forward_params` | list | | Path parameters to forward as query string params. `"*"` forwards all |

## Upstream Policy
---

```yaml
policy:
  allowed_statuses: [200, 404]
  require_body: true
  max_response_body_size: 4096
  header_blacklist: ["X-Internal-Token"]
  retry:
    max_retries: 3
    retry_on_statuses: [500, 502, 503]
    backoff_delay: 500ms
  circuit_breaker:
    enabled: true
    max_failures: 5
    reset_timeout: 2s
  load_balancing:
    mode: round_robin
```

| Field | Type | Description |
|---|---|---|
| `allowed_statuses` | list[int] | Accepted HTTP status codes. Responses outside this list are treated as policy violations |
| `require_body` | bool | Fail if upstream response body is empty |
| `max_response_body_size` | int | Max response body in bytes. Responses exceeding this are rejected |
| `header_blacklist` | list[string] | Response headers to strip before passing to the aggregator |
| `retry.max_retries` | int | Maximum number of retry attempts after the initial request |
| `retry.retry_on_statuses` | list[int] | HTTP status codes that trigger a retry |
| `retry.backoff_delay` | duration | Fixed delay between retry attempts |
| `circuit_breaker.enabled` | bool | Enable circuit breaker for this upstream |
| `circuit_breaker.max_failures` | int | Consecutive failures before opening the circuit |
| `circuit_breaker.reset_timeout` | duration | Time in open state before transitioning to half-open |
| `load_balancing.mode` | string | `round_robin` or `least_conns`. Only applies when multiple `hosts` are configured |

:::info
The circuit breaker tracks three states: **closed** (normal), **open** (rejecting requests), **half-open** (testing recovery). All three are exposed via the `kono_circuit_breaker_state` metric.
:::

## Plugins
---

```yaml
plugins:
  - name: snakeify
    source: builtin
  - name: myplugin
    source: file
    path: /etc/kono/plugins/
    config:
      key: value
```

| Field | Type | Description |
|---|---|---|
| `name` | string | Plugin name |
| `source` | string | `builtin` (shipped with Kono) or `file` (custom `.so`) |
| `path` | string | Directory containing the `.so` file. Required when `source: file` |
| `config` | map | Plugin-specific configuration passed at initialization |

Plugins run in two phases:

- **Request phase** — before upstream dispatch. Can modify request context and headers
- **Response phase** — after aggregation. Can modify response headers and body

:::warning
Plugins are loaded as Go shared objects (`.so`). They must be compiled with the exact same Go version as the gateway binary. Version mismatch causes a panic at startup.
:::

## Middlewares
---

```yaml
middlewares:
  - name: recoverer
    source: builtin
  - name: logger
    source: builtin
    config:
      enabled: true
```

Middlewares use the same `name`, `source`, `path`, and `config` fields as plugins. They wrap the entire flow handler and execute in the order defined — outermost first. Built-in middlewares include `recoverer`, `logger`, `auth`, and `compressor`.

---