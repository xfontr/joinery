# 📦 @monorepo/observability

Thin wrappers over Grafana Faro (browser) and the OpenTelemetry SDK (Node), so every app starts
telemetry the same way. Both land in Grafana Cloud's Tempo, so a browser span and the server span it
caused share a trace.

```ts
import { startWebTelemetry } from "@monorepo/observability";

const faro = startWebTelemetry({
    url: "<faro-collector-url>",
    app: { name: "@monorepo/huella-legal", version: "1.0.0", environment: "production" },
});

faro.api.pushError(new Error("boom"));
```

```ts
import { startNodeTelemetry } from "@monorepo/observability/node";

const provider = startNodeTelemetry({
    url: "<otlp-gateway-url>",
    instanceId: "123456",
    token: "glc_…",
    app: { name: "@monorepo/huella-legal", version: "1.0.0", environment: "production" },
});
```

That's the whole package: [`src/index.ts`](./src/index.ts) and [`src/node.ts`](./src/node.ts). The
two entries must never import each other — one needs `window`, the other Node built-ins.
[`@monorepo/huella-legal`](../../apps/huella-legal/README.md#-observability) is the worked example.

## 📥 What you get for free

**Browser.** `getWebInstrumentations()` covers errors, unhandled rejections, web vitals, console and
session tracking. `TracingInstrumentation` adds fetch/XHR spans and registers a global OpenTelemetry
tracer provider, so a caller that wants manual spans can install `@opentelemetry/api` and use
`trace.getTracer()` without this package being involved.

**Server.** Outbound `fetch` spans (via undici) and `traceparent` propagation in both directions —
an incoming header continues the browser's trace, an outgoing request carries ours. Every span is
stamped with `service.name`, `service.version` and `deployment.environment.name` from `app`.
`provider.register()` installs the W3C propagator and the async context manager, so a caller can
`trace.getTracer()` and open its own spans without this package being involved.

The inbound span is *not* included — see the gotcha below.

## ⚠️ Gotchas

- **Browser only for the default entry.** Faro touches `window` while initializing, so it must not
  run during SSR — in Nuxt that means a `.client` plugin.
- **No inbound span. The caller opens it.** `HttpInstrumentation` can't patch `node:http` under ESM
  without a preload, and Nitro imports it before any plugin runs. Without a request span, outbound
  fetches become root traces — [huella-legal](../../apps/huella-legal/server/plugins/observability.ts)
  wraps `nitroApp.h3App.handler` to open one.
- **`app.version` is the caller's to supply.** Telemetry stamped `0.0.0` cannot be attributed to a
  release.
- **Stack traces arrive minified.** No app uploads source maps yet.
- **The first page load's server trace stands alone**: a document navigation carries no
  `traceparent`. Everything fetched afterwards joins up.

## 🧭 Known gaps

| Gap | Note |
| --- | --- |
| Cross-origin propagation | Today every browser request is same-origin. Calling another origin needs Faro's `propagateTraceHeaderCorsUrls` |
| No metrics | RED metrics can be derived from spans in Grafana; runtime metrics need a `MeterProvider` |
