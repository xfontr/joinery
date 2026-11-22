import { describe, expect, it } from "vitest";
import { decisionStatusTone } from "./format.ts";

describe("decisionStatusTone", () => {
    it.each([
        ["to-implement", "warn"],
        ["implemented", "good"],
        ["wont-implement", "neutral"],
    ] as const)("maps %s to its tone", (status, tone) => {
        expect(decisionStatusTone(status)).toBe(tone);
    });
});
