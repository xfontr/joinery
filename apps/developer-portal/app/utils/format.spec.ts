import { afterEach, describe, expect, it, vi } from "vitest";
import { coverageTone, relativeTime, severityTone, shortAge } from "./format.ts";

const t = (key: string, named?: Record<string, unknown> | number): string =>
    named === undefined ? key : `${key} ${JSON.stringify(named)}`;

describe("relativeTime", () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it("returns never for missing timestamps", () => {
        expect(relativeTime(null, t)).toBe("common.never");
        expect(relativeTime(undefined, t)).toBe("common.never");
    });

    it.each([
        ["2026-09-20T11:59:58.000Z", "2 seconds ago"],
        ["2026-09-20T10:00:00.000Z", "2 hours ago"],
        ["2026-09-18T12:00:00.000Z", "2 days ago"],
    ])("chooses the largest useful unit for %s", (timestamp, label) => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-09-20T12:00:00.000Z"));

        expect(relativeTime(timestamp, t)).toBe(label);
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
        [null, "common.never"],
        ["2026-09-20T11:59:58.000Z", "common.now"],
        ["2026-09-20T10:00:00.000Z", 'common.shortAge.hours {"count":2}'],
        ["2026-09-18T12:00:00.000Z", 'common.shortAge.days {"count":2}'],
    ])("rounds %s down to its largest whole unit, %s", (timestamp, label) => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-09-20T12:00:00.000Z"));

        expect(shortAge(timestamp, t)).toBe(label);
    });
});
