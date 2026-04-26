---
id: intro
title: Introduction
description: Introduction
slug: /intro
---

# Kono API Gateway

[Kono](https://github.com/starwalkn/kono) is a lightweight, extensible API Gateway written in Go.
It simplifies request routing, fan-out to multiple upstream services, and response aggregation — while remaining fast, predictable, and easy to configure.

Kono focuses on **explicit configuration**, **minimal runtime overhead**, and **clear separation of concerns** between routing, middleware, plugins, and upstream policies.

## Key Features
---

- **High-performance Go core** — built with simplicity and low latency in mind
- **Multiple upstreams per route** — dispatch requests to several services in parallel and aggregate their responses
- **Flexible aggregation strategies** — merge, array, and namespace-based aggregation
- **Path parameter extraction** — native `{param}` support with automatic forwarding to upstreams
- **Pluggable architecture** — extend behavior using dynamically loaded `.so` plugins and middlewares
- **Lua scripting via Lumos** — modify requests using LuaJIT scripts over Unix sockets, no extra network overhead
- **Fine-grained upstream policies** — retries, circuit breaker, load balancing, timeouts, body limits, header filtering
- **Prometheus metrics** — built-in instrumentation with circuit breaker state tracking
- **Rate limiting & trusted proxy support**
- **Declarative YAML configuration**

## Typical Use Cases
---

- API composition / Backend-for-Frontend (BFF)
- Fan-out and aggregation of microservice responses
- Centralized request validation and transformation
- Edge gateway for internal services
- Lightweight alternative to large API gateway solutions

## Design Philosophy
---

Kono aims to be:

- **Small, not bloated** — only core gateway responsibilities
- **Explicit, not magical** — behavior is visible in configuration
- **Composable** — features are built from simple primitives
- **Safe by default** — timeouts, circuit breakers, and body limits are first-class

---