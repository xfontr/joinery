import { describe, expect, it } from "vitest";
import { worstSeverity } from "./deps.ts";

const counts = (overrides = {}) => ({
    info: 0,
    low: 0,
    moderate: 0,
    high: 0,
    critical: 0,
    ...overrides,
});

describe("worstSeverity", () => {
    it("names the most severe band with an advisory, however many sit below it", () => {
        expect(worstSeverity(counts({ low: 9, high: 1 }))).toBe("high");
    });

    it("has no band when audit found nothing or never ran", () => {
        expect(worstSeverity(counts())).toBeNull();
        expect(worstSeverity(null)).toBeNull();
    });
});
