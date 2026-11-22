import { describe, expect, it } from "vitest";
import { capabilityColor, stageColor } from "./format.ts";

describe("capability marks", () => {
    it.each([
        ["done", "var(--state-done)"],
        ["in-flight", "var(--state-in-flight)"],
        ["ready", "var(--state-ready)"],
        ["waiting-on-you", "var(--state-waiting-on-you)"],
        ["blocked", "var(--state-blocked)"],
        ["can-file", "var(--state-can-file)"],
        ["waits", "var(--state-waits)"],
        ["off", "var(--state-off)"],
        ["skipped", "var(--state-skipped)"],
    ] as const)("draws %s as %s", (state, colour) => {
        expect(capabilityColor(state)).toBe(colour);
    });

    it("wraps the stage palette instead of running off its end", () => {
        expect(stageColor(7)).toBe(stageColor(0));
    });
});
