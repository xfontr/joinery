import { describe, expect, it } from "vitest";
import {
    auditStateLabel,
    auditStateTone,
    findingStatusLabel,
    findingStatusTone,
} from "./format.ts";

describe("audit labels and tones", () => {
    it.each([
        ["open", "Open", "warn"],
        ["fixed", "Fixed", "good"],
        ["wont-fix", "Won't fix", "neutral"],
    ] as const)("maps the %s finding to its label and tone", (status, label, tone) => {
        expect(findingStatusLabel(status)).toBe(label);
        expect(findingStatusTone(status)).toBe(tone);
    });

    it.each([
        ["open", "Open", "warn"],
        ["in-progress", "In progress", "warn"],
        ["closed", "Closed", "good"],
    ] as const)("maps the %s audit to its label and tone", (state, label, tone) => {
        expect(auditStateLabel(state)).toBe(label);
        expect(auditStateTone(state)).toBe(tone);
    });
});
