import { beforeEach, describe, expect, it, vi } from "vitest";
import { startWebTelemetry } from "./index";

const faro = vi.hoisted(() => ({
    initializeFaro: vi.fn(),
    getWebInstrumentations: vi.fn(() => [{ name: "web" }]),
}));

const tracing = vi.hoisted(() => ({ TracingInstrumentation: vi.fn() }));

vi.mock("@grafana/faro-web-sdk", () => ({
    initializeFaro: faro.initializeFaro,
    getWebInstrumentations: faro.getWebInstrumentations,
}));

vi.mock("@grafana/faro-web-tracing", () => ({
    TracingInstrumentation: tracing.TracingInstrumentation,
}));

const url = "https://faro-collector.grafana.net/collect/abc123";
const app = { name: "@joinery/external", version: "1.0.0", environment: "production" };

const start = () => startWebTelemetry({ url, app });

const instrumentations = () =>
    (faro.initializeFaro.mock.calls[0]?.[0] as { instrumentations: unknown[] }).instrumentations;

beforeEach(() => {
    vi.clearAllMocks();
});

describe("startWebTelemetry", () => {
    it("reports to the collector as the app, with web instrumentations plus tracing", () => {
        start();

        expect(faro.initializeFaro).toHaveBeenCalledWith(
            expect.objectContaining({ url, app }) as object,
        );
        expect(instrumentations()).toContainEqual({ name: "web" });
        expect(instrumentations()).toHaveLength(2);
    });
});
