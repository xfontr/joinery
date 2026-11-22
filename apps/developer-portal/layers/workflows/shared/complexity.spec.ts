import { describe, expect, it } from "vitest";
import { complexityOf, formatPoints } from "./complexity.ts";
import type { Capability } from "./types/Capability.ts";

const block = (complexity: number | null) => ({ complexity }) as Capability;

describe("complexityOf", () => {
    it("adds nothing for an unestimated block instead of turning the total into NaN", () => {
        expect(complexityOf([block(5), block(null), block(8)])).toBe(13);
    });
});

describe("formatPoints", () => {
    it("keeps one decimal of a split ticket's share, so halves still add up to the whole", () => {
        expect(formatPoints(10.5)).toBe("10.5");
        expect(formatPoints(2.6666)).toBe("2.7");
        expect(formatPoints(21)).toBe("21");
    });
});
