import { describe, expect, it } from "vitest";
import { oklch } from "culori";
import { ramp } from "./ramp.ts";

describe("ramp", () => {
    it.each([
        ["a mid green", "#4A6B52", 600],
        ["a light cream", "#faf5eb", 100],
        ["a grey with no hue", "#333333", 700],
    ])(
        "keeps the anchor hex unchanged at its step, so the live brand colour survives ramp generation (%s)",
        (_, anchor, step) => {
            const steps = ramp(anchor);

            expect(steps).toHaveLength(11);
            expect(steps.find(({ hex }) => hex === anchor.toLowerCase())?.step).toBe(step);
        },
    );

    it("darkens step by step from 50 to 950, so a higher number is never lighter", () => {
        const lightness = ramp("#4A6B52").map(({ hex }) => oklch(hex)?.l ?? 0);

        const darker = lightness.slice(1).map((value, index) => value < (lightness[index] ?? 0));

        expect(darker).toEqual(Array.from({ length: 10 }, () => true));
    });
});
