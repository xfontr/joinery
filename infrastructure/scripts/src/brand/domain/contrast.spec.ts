import { describe, expect, it } from "vitest";
import { contrastTable, failing, measure, pairs, resolve } from "./contrast.ts";

const ROLES = new Map([
    ["--color-ink-700", "#333333"],
    ["--color-paper-50", "#ffffff"],
    ["--ui-bg", "var(--color-paper-50)"],
    ["--ui-bg-muted", "var(--color-paper-50)"],
    ["--ui-bg-inverted", "var(--color-ink-700)"],
    ["--ui-text", "var(--color-ink-700)"],
    ["--ui-text-muted", "var(--color-ink-700)"],
    ["--ui-text-inverted", "var(--color-paper-50)"],
    ["--ui-primary", "var(--color-ink-700)"],
    ["--ui-border", "var(--color-ink-700)"],
]);

describe("pairs", () => {
    it("pairs every text role with every surface role, so a role added later can't miss the table", () => {
        const withNewRoles = new Map([
            ...ROLES,
            ["--ui-text-whisper", "var(--color-ink-700)"],
            ["--ui-bg-sunken", "var(--color-paper-50)"],
        ]);

        expect(pairs(withNewRoles)).toEqual([
            ...["--ui-text", "--ui-text-muted", "--ui-text-whisper", "--ui-primary"].flatMap(
                (text) =>
                    ["--ui-bg", "--ui-bg-muted", "--ui-bg-sunken"].map((surface) => ({
                        text,
                        surface,
                    })),
            ),
            { text: "--ui-text-inverted", surface: "--ui-bg-inverted" },
        ]);
    });
});

describe("resolve", () => {
    it("fails naming the variable when a role points at an undefined token, instead of printing a ratio for nothing", () => {
        const broken = new Map([...ROLES, ["--ui-text", "var(--color-ink-750)"]]);

        expect(() => resolve(broken, "--ui-text")).toThrow(/--color-ink-750/);
    });
});

describe("contrastTable", () => {
    it("prints 21.00:1 for black on white, the two-decimal form DESIGN.md quotes", () => {
        const rows = measure(
            new Map([
                ["--ui-text", "#000000"],
                ["--ui-bg", "#ffffff"],
            ]),
        );

        expect(contrastTable(rows)).toContain("| 21.00:1 |");
    });

    it("flags a pair just under 4.5:1 and passes one just over, so the gate sits on WCAG AA and not near it", () => {
        const rows = measure(
            new Map([
                ["--ui-text", "#767676"],
                ["--ui-text-muted", "#777777"],
                ["--ui-bg", "#ffffff"],
            ]),
        );
        const [over, under] = rows;
        const lines = contrastTable(rows).split("\n");

        expect(failing(rows)).toEqual([under]);
        expect(lines.filter((line) => line.includes("below 4.5:1"))).toEqual([
            expect.stringContaining("`--ui-text-muted`"),
        ]);
        expect(over?.text).toBe("--ui-text");
    });
});
