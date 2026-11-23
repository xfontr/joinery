import { beforeEach, describe, expect, it, vi } from "vitest";
import { stubNitro } from "@joinery/configs/vitest/utils/nitro";
import type { H3Event } from "h3";
import { SpanKind, SpanStatusCode } from "@opentelemetry/api";
import {
    ATTR_HTTP_REQUEST_METHOD,
    ATTR_HTTP_RESPONSE_STATUS_CODE,
    ATTR_HTTP_ROUTE,
    ATTR_SERVER_ADDRESS,
    ATTR_URL_PATH,
} from "@opentelemetry/semantic-conventions";

const otel = vi.hoisted(() => {
    const span = {
        updateName: vi.fn(),
        setAttributes: vi.fn(),
        setStatus: vi.fn(),
        recordException: vi.fn(),
        end: vi.fn(),
    };

    const tracer = { startActiveSpan: vi.fn() };

    return {
        span,
        tracer,
        getTracer: vi.fn(),
        getActiveSpan: vi.fn(),
        extract: vi.fn(),
        active: vi.fn(),
    };
});

const telemetry = vi.hoisted(() => ({
    provider: { shutdown: vi.fn(), forceFlush: vi.fn() },
    startNodeTelemetry: vi.fn(),
}));

const netlify = vi.hoisted(() => ({ getContext: vi.fn(), waitUntil: vi.fn() }));

// Only the three entry points the plugin reaches through are replaced — SpanKind and SpanStatusCode
// stay real, so the spec pins the values a collector actually receives rather than its own sentinels
vi.mock("@opentelemetry/api", async (importOriginal) => ({
    ...(await importOriginal<typeof import("@opentelemetry/api")>()),
    trace: { getTracer: otel.getTracer, getActiveSpan: otel.getActiveSpan },
    context: { active: otel.active },
    propagation: { extract: otel.extract },
}));

vi.mock("@joinery/observability/node", () => ({
    startNodeTelemetry: telemetry.startNodeTelemetry,
}));

vi.mock("@netlify/functions", () => ({ getContext: netlify.getContext }));

const APP = { name: "@joinery/huella-legal", version: "1.4.0", environment: "production" };

const COLLECTOR = "https://otlp-gateway-prod-eu-west-0.grafana.net/otlp";

const PARENT = "parent-context";
const ACTIVE = "active-context";
const TRACEPARENT = "00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01";
const BODY = { ok: true };
const FLUSHED = Promise.resolve();

// Nitro auto-imports these at build time, so the plugin never imports them and they do not exist
// under vitest. `defineNitroPlugin` has to be stubbed before the module is imported: it runs at
// module evaluation, and the plugin function is its argument.
let runtimeConfig: ReturnType<typeof createConfig>;
let responseStatus: number;

vi.stubGlobal("defineNitroPlugin", (plugin: unknown) => plugin);
stubNitro();
vi.stubGlobal("useRuntimeConfig", () => runtimeConfig);
vi.stubGlobal("getRequestHeaders", () => ({ traceparent: TRACEPARENT }));
vi.stubGlobal("getRequestHost", () => "huella-legal.test");
vi.stubGlobal("getResponseStatus", () => responseStatus);

const plugin = (await import("./observability")).default as unknown as (nitroApp: NitroApp) => void;

type Handler = (event: H3Event) => unknown;

type NitroApp = ReturnType<typeof createNitroApp>;

function createConfig(url: string = COLLECTOR) {
    return {
        observability: { url, instanceId: "123456", token: "glc_token" },
        public: { observability: { url: "", app: APP } },
    };
}

function createNitroApp(handle: Handler) {
    const hooks = new Map<string, (payload: never) => unknown>();

    return {
        h3App: { handler: handle },
        hooks: {
            hook: (name: string, fn: (payload: never) => unknown) => {
                hooks.set(name, fn);
            },
        },
        fire: (name: string, payload?: unknown) => hooks.get(name)?.(payload as never),
    };
}

const createEvent = (path: string, matchedRoute?: string): H3Event =>
    ({
        path,
        method: "GET",
        context: matchedRoute === undefined ? {} : { matchedRoute: { path: matchedRoute } },
    }) as unknown as H3Event;

const start = (handle: Handler = () => BODY) => {
    const nitroApp = createNitroApp(handle);

    plugin(nitroApp);

    return { nitroApp, handler: nitroApp.h3App.handler };
};

// Always a promise: the span callback is async, so a traced request is awaited whatever the inner
// handler returned
const traced = (
    path: string,
    matchedRoute?: string,
    handler: Handler = () => BODY,
): Promise<unknown> => start(handler).handler(createEvent(path, matchedRoute)) as Promise<unknown>;

// Never a promise of its own: the untraced path hands the inner handler's value straight back
const untraced = (path: string): unknown => start().handler(createEvent(path));

const spanCall = () =>
    otel.tracer.startActiveSpan.mock.calls[0] as unknown as [
        string,
        { kind: SpanKind; attributes: Record<string, string | undefined> },
        string,
    ];

const attributes = () =>
    otel.span.setAttributes.mock.calls[0]?.[0] as Record<string, string | number>;

beforeEach(() => {
    vi.clearAllMocks();

    runtimeConfig = createConfig();
    responseStatus = 200;

    telemetry.startNodeTelemetry.mockReturnValue(telemetry.provider);
    telemetry.provider.forceFlush.mockReturnValue(FLUSHED);
    netlify.getContext.mockReturnValue({ waitUntil: netlify.waitUntil });
    otel.getTracer.mockReturnValue(otel.tracer);
    otel.getActiveSpan.mockReturnValue(otel.span);
    otel.extract.mockReturnValue(PARENT);
    otel.active.mockReturnValue(ACTIVE);
    otel.tracer.startActiveSpan.mockImplementation(
        (
            _name: string,
            _options: object,
            _parent: string,
            run: (span: typeof otel.span) => unknown,
        ) => run(otel.span),
    );
});

describe("the nitro observability plugin", () => {
    it("starts no exporter and leaves the handler alone when no collector URL is set", () => {
        runtimeConfig = createConfig("");

        const { nitroApp, handler } = start();

        expect(telemetry.startNodeTelemetry).not.toHaveBeenCalled();
        expect(handler).toBe(nitroApp.h3App.handler);

        expect(handler(createEvent("/articles"))).toBe(BODY);
        expect(otel.tracer.startActiveSpan).not.toHaveBeenCalled();
    });

    it("starts no exporter while prerendering, so a build without the token still finishes", () => {
        vi.stubEnv("prerender", "true");

        const { nitroApp, handler } = start();

        vi.unstubAllEnvs();

        expect(telemetry.startNodeTelemetry).not.toHaveBeenCalled();
        expect(handler).toBe(nitroApp.h3App.handler);
    });

    it("hands the collector credentials and the app identity to the exporter", () => {
        start();

        expect(telemetry.startNodeTelemetry).toHaveBeenCalledWith({
            url: COLLECTOR,
            instanceId: "123456",
            token: "glc_token",
            app: APP,
        });

        expect(otel.getTracer).toHaveBeenCalledWith(APP.name, APP.version);
    });

    it("returns the handler's body untouched", async () => {
        await expect(traced("/articles", "/articles")).resolves.toBe(BODY);
    });

    it("continues an incoming trace rather than opening a second one for the same request", async () => {
        await traced("/articles", "/articles");

        expect(otel.extract).toHaveBeenCalledWith(ACTIVE, { traceparent: TRACEPARENT });
        expect(spanCall()[2]).toBe(PARENT);
    });

    it("opens the request span as a server span, since no instrumentation will", async () => {
        await traced("/articles", "/articles");

        expect(spanCall()[1].kind).toBe(SpanKind.SERVER);
    });

    it("renames the span to the matched route, so a path carrying an id cannot multiply span names", async () => {
        await traced("/articles/hello-world", "/articles/:slug");

        expect(spanCall()[0]).toBe("GET /articles/hello-world");
        expect(otel.span.updateName).toHaveBeenCalledWith("GET /articles/:slug");
        expect(attributes()[ATTR_HTTP_ROUTE]).toBe("/articles/:slug");
    });

    it("falls back to the request path when nothing matched, rather than leaving the span unnamed", async () => {
        await traced("/nope");

        expect(otel.span.updateName).toHaveBeenCalledWith("GET /nope");
        expect(attributes()[ATTR_HTTP_ROUTE]).toBe("/nope");
    });

    it("strips the query off the fallback route, so an unmatched path cannot mint a name per query", async () => {
        await traced("/nope?a=1");

        expect(otel.span.updateName).toHaveBeenCalledWith("GET /nope");
        expect(attributes()[ATTR_HTTP_ROUTE]).toBe("/nope");
    });

    it("stamps no attribute that identifies the reader or what they typed", async () => {
        await traced("/buscar?q=despido", "/buscar");

        expect(spanCall()[1].attributes).toEqual({
            [ATTR_HTTP_REQUEST_METHOD]: "GET",
            [ATTR_URL_PATH]: "/buscar",
            [ATTR_SERVER_ADDRESS]: "huella-legal.test",
        });
    });

    it("records the response status and closes the span", async () => {
        responseStatus = 201;

        await traced("/articles", "/articles");

        expect(attributes()[ATTR_HTTP_RESPONSE_STATUS_CODE]).toBe(201);
        expect(otel.span.end).toHaveBeenCalledOnce();
    });

    describe("when the response is a failure", () => {
        it.each([400, 404, 499])(
            "leaves %i unmarked, since the client is what went wrong",
            async (status) => {
                responseStatus = status;

                await traced("/nope", "/nope");

                expect(otel.span.setStatus).not.toHaveBeenCalled();
                expect(otel.span.end).toHaveBeenCalledOnce();
            },
        );

        it.each([500, 502, 503])("marks %i as a failed span", async (status) => {
            responseStatus = status;

            await traced("/articles", "/articles");

            expect(otel.span.setStatus).toHaveBeenCalledWith({ code: SpanStatusCode.ERROR });
        });
    });

    describe("when the handler throws", () => {
        const cause = Object.assign(new Error("upstream down"), { statusCode: 502 });

        it("rethrows, so a traced request is still a handled one", async () => {
            await expect(
                traced("/articles", "/articles", () => Promise.reject(cause)),
            ).rejects.toBe(cause);
        });

        it("records the exception and closes the span with the status the error carries", async () => {
            await expect(
                traced("/articles", "/articles", () => Promise.reject(cause)),
            ).rejects.toBe(cause);

            expect(otel.span.recordException).toHaveBeenCalledWith(cause);
            expect(attributes()[ATTR_HTTP_RESPONSE_STATUS_CODE]).toBe(502);
            expect(otel.span.setStatus).toHaveBeenCalledWith({ code: SpanStatusCode.ERROR });
            expect(otel.span.end).toHaveBeenCalledOnce();
        });

        it("records the cause as well, since the exception event drops it", async () => {
            const upstream = new Error("connect ECONNREFUSED");
            const wrapped = Object.assign(
                new Error("Upstream request failed", { cause: upstream }),
                {
                    statusCode: 502,
                },
            );

            await expect(
                traced("/articles", "/articles", () => Promise.reject(wrapped)),
            ).rejects.toBe(wrapped);

            expect(otel.span.recordException).toHaveBeenCalledTimes(2);
            expect(otel.span.recordException).toHaveBeenCalledWith(wrapped);
            expect(otel.span.recordException).toHaveBeenCalledWith(upstream);
        });

        it("records an error once when it has no cause", async () => {
            await expect(
                traced("/articles", "/articles", () => Promise.reject(cause)),
            ).rejects.toBe(cause);

            expect(otel.span.recordException).toHaveBeenCalledOnce();
        });

        it("closes the span as a 500 when the error carries no status", async () => {
            const boom = new Error("boom");

            await expect(traced("/articles", "/articles", () => Promise.reject(boom))).rejects.toBe(
                boom,
            );

            expect(attributes()[ATTR_HTTP_RESPONSE_STATUS_CODE]).toBe(500);
        });
    });

    it.each(["/_nuxt/entry.abc123.js", "/_fonts/inter.woff2", "/__nuxt/island", "/favicon.ico"])(
        "does not trace %s",
        (path) => {
            expect(untraced(path)).toBe(BODY);

            expect(otel.tracer.startActiveSpan).not.toHaveBeenCalled();
        },
    );

    it("records an error reported through Nitro's hook on the span that is open", () => {
        const error = new Error("render failed");

        start().nitroApp.fire("error", error);

        expect(otel.span.recordException).toHaveBeenCalledWith(error);
    });

    it("records the cause of an error reported through Nitro's hook", () => {
        const upstream = new Error("connect ECONNREFUSED");

        start().nitroApp.fire("error", new Error("Upstream request failed", { cause: upstream }));

        expect(otel.span.recordException).toHaveBeenLastCalledWith(upstream);
    });

    it("survives an error reported with no span open", () => {
        otel.getActiveSpan.mockReturnValue(undefined);

        expect(() => start().nitroApp.fire("error", new Error("render failed"))).not.toThrow();
    });

    describe("flushing on Netlify", () => {
        it("hands the flush to waitUntil once the request span has ended", async () => {
            otel.span.end.mockImplementationOnce(() =>
                expect(telemetry.provider.forceFlush).not.toHaveBeenCalled(),
            );

            await traced("/articles", "/articles");

            expect(netlify.waitUntil).toHaveBeenCalledWith(FLUSHED);
        });

        it("flushes a request whose handler threw, since that is the span most worth seeing", async () => {
            await expect(
                traced("/articles", "/articles", () => Promise.reject(new Error("boom"))),
            ).rejects.toThrow("boom");

            expect(netlify.waitUntil).toHaveBeenCalledWith(FLUSHED);
        });

        // `getContext` throws outside a Netlify request, which is every local `nuxi dev` or preview
        it("serves the request untouched when there is no Netlify context to flush through", async () => {
            netlify.getContext.mockImplementation(() => {
                throw new Error("getContext() can only be called within a Netlify function");
            });

            await expect(traced("/articles", "/articles")).resolves.toBe(BODY);
            expect(telemetry.provider.forceFlush).not.toHaveBeenCalled();
        });
    });

    it("shuts the exporter down when Nitro closes, so buffered spans are flushed", () => {
        start().nitroApp.fire("close");

        expect(telemetry.provider.shutdown).toHaveBeenCalledOnce();
    });
});
