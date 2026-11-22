import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { Quadrants } from "#layers/telemetry/shared/usageView.ts";
import TelemetryQuadrantChart from "./TelemetryQuadrantChart.vue";

const axis = { ticks: [{ label: "10", at: 50 }], threshold: 40 };

const point = (name: string, x: number, labelled = true) => ({
    name,
    title: `${name} title`,
    kind: "dot" as const,
    x,
    y: 20,
    labelled,
});

const CHART = {
    x: axis,
    y: axis,
    points: [
        point("left", 10),
        point("right", 90),
        point("quiet", 30, false),
        point("beyond", 140),
    ],
} satisfies Quadrants<"dot">;

const mount = () =>
    mountSuspended(TelemetryQuadrantChart, {
        props: {
            chart: CHART,
            kinds: { dot: { label: "Dots", color: "red" } },
            quadrants: [{ corner: "top-right", label: "Fix first", bad: true }],
            xLabel: "Runs",
            yLabel: "Failures",
        },
    });

const labelOf = async (name: string) =>
    (await mount()).findAll("span.font-mono").find((label) => label.text() === name);

describe("TelemetryQuadrantChart", () => {
    it("names only the points marked labelled", async () => {
        expect(await labelOf("left")).toBeDefined();
        expect(await labelOf("quiet")).toBeUndefined();
    });

    it("puts a name left of a point near the right edge, so it stays on the plot", async () => {
        expect((await labelOf("left"))?.attributes("style")).toContain("left:");
        expect((await labelOf("right"))?.attributes("style")).toContain("right:");
    });

    it("pins a point past the axis to its edge", async () => {
        const dot = (await mount()).find("span[title='beyond title']");

        expect(dot.attributes("style")).toContain("left: 100%");
    });
});
