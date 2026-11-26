import { describe, expect, it } from "vitest";
import { auditStateTone, findingStatusTone } from "./format.ts";

describe("audit tones", () => {
    it.each([
        ["open", "warn"],
        ["fixed", "good"],
        ["wont-fix", "neutral"],
    ] as const)("maps the %s finding to its tone", (status, tone) => {
        expect(findingStatusTone(status)).toBe(tone);
    });

    it.each([
        ["open", "warn"],
        ["in-progress", "warn"],
        ["closed", "good"],
    ] as const)("maps the %s audit to its tone", (state, tone) => {
        expect(auditStateTone(state)).toBe(tone);
    });
});
