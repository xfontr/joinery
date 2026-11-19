import { afterEach, describe, expect, it, vi } from "vitest";
import { coverageTone, relativeTime, severityTone, shortAge } from "./format.ts";

describe("relativeTime", () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it("returns never for missing timestamps", () => {
        expect(relativeTime(null)).toBe("never");
        expect(relativeTime(undefined)).toBe("never");
    });

    it.each([
        ["2026-09-20T11:59:58.000Z", "2 seconds ago"],
        ["2026-09-20T10:00:00.000Z", "2 hours ago"],
        ["2026-09-18T12:00:00.000Z", "2 days ago"],
    ])("chooses the largest useful unit for %s", (timestamp, label) => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-09-20T12:00:00.000Z"));

        expect(relativeTime(timestamp)).toBe(label);
    });
});

describe("coverageTone", () => {
    it.each([
        [null, "neutral"],
        [undefined, "neutral"],
        [59.99, "bad"],
        [60, "warn"],
        [79.99, "warn"],
        [80, "good"],
    ] as const)("maps %s to %s", (value, tone) => {
        expect(coverageTone(value)).toBe(tone);
    });
});

describe("severityTone", () => {
    it.each([
        ["info", "neutral"],
        ["low", "neutral"],
        ["moderate", "warn"],
        ["high", "bad"],
        ["critical", "bad"],
    ] as const)("collapses %s severity to %s", (severity, tone) => {
        expect(severityTone(severity)).toBe(tone);
    });
});

describe("shortAge", () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it.each([
        [null, "never"],
        ["2026-09-20T11:59:58.000Z", "now"],
        ["2026-09-20T10:00:00.000Z", "2 h"],
        ["2026-09-18T12:00:00.000Z", "2 d"],
    ])("rounds %s down to its largest whole unit, %s", (timestamp, label) => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-09-20T12:00:00.000Z"));

        expect(shortAge(timestamp)).toBe(label);
    });
});
