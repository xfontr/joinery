import { describe, expect, it } from "vitest";
import { brandTable, summarise, type Sample } from "./brand.ts";

const WHITE = "rgb(255, 255, 255)";
const CREAM = "rgb(250, 245, 235)";
const CHARCOAL = "rgb(51, 51, 51)";
const GREEN = "rgb(74, 107, 82)";
const TERRACOTTA = "rgb(196, 98, 61)";
const GREY = "rgb(204, 204, 204)";
const TRANSPARENT = "rgba(0, 0, 0, 0)";
const PEACH = "rgb(250, 220, 190)";

const sample = (overrides: Partial<Sample>): Sample => ({
    tag: "div",
    isLink: false,
    isHeading: false,
    color: CHARCOAL,
    background: TRANSPARENT,
    fontFamily: "Lato, sans-serif",
    fontSize: "16px",
    lineHeight: "24px",
    fontWeight: "400",
    radius: "0px",
    area: 0,
    textChars: 0,
    ...overrides,
});

describe("summarise", () => {
    it("takes paper from the background covering the most area, not from the first element sampled", () => {
        const summary = summarise([
            sample({ tag: "header", background: WHITE, area: 1280 * 80 }),
            sample({ tag: "body", background: CREAM, area: 1280 * 3000 }),
            sample({
                tag: "dialog",
                background: CHARCOAL.replace(")", ", 0.5)"),
                area: 1280 * 9000,
            }),
        ]);

        expect(summary.paper).toBe("#faf5eb");
    });

    it("takes ink from the colour carrying the most body text, so a link colour can't become ink", () => {
        const summary = summarise([
            sample({ tag: "a", isLink: true, color: GREEN, textChars: 5000 }),
            sample({ tag: "h2", isHeading: true, color: TERRACOTTA, textChars: 3000 }),
            sample({ tag: "p", color: CHARCOAL, textChars: 800 }),
        ]);

        expect(summary.ink).toBe("#333333");
        expect(summary.primary).toBe("#4a6b52");
    });

    it("never picks a grey as the accent, so a neutral border can't pass for the brand colour", () => {
        const summary = summarise([
            sample({ tag: "body", background: WHITE, area: 1280 * 3000 }),
            sample({ tag: "hr", background: GREY, area: 1280 * 400 }),
            sample({ tag: "a", isLink: true, color: GREEN, textChars: 400 }),
            sample({ tag: "span", background: TERRACOTTA, area: 2000 }),
        ]);

        expect(summary.accent).toBe("#c4623d");
    });

    it("never picks the paper as the accent, so a tinted page can't pass for the brand colour", () => {
        const summary = summarise([
            sample({ tag: "body", background: PEACH, area: 1280 * 3000 }),
            sample({ tag: "a", isLink: true, color: GREEN, textChars: 400 }),
            sample({ tag: "span", background: TERRACOTTA, area: 2000 }),
        ]);

        expect(summary.paper).toBe("#fadcbe");
        expect(summary.accent).toBe("#c4623d");
    });

    it("skips a link colour equal to ink and takes the button fill, so charcoal nav links can't become primary", () => {
        const summary = summarise([
            sample({ tag: "body", background: WHITE, area: 1280 * 3000 }),
            sample({ tag: "p", color: CHARCOAL, textChars: 4000 }),
            sample({ tag: "a", isLink: true, color: CHARCOAL, textChars: 2000 }),
            sample({ tag: "button", isLink: true, color: WHITE, background: GREEN, textChars: 40 }),
        ]);

        expect(summary.ink).toBe("#333333");
        expect(summary.primary).toBe("#4a6b52");
    });

    it("takes the body font from body text and the heading font from headings, so a heading face can't become the body face", () => {
        const playfair = '"Playfair Display", serif';
        const summary = summarise([
            sample({ tag: "h1", isHeading: true, fontFamily: playfair, textChars: 3000 }),
            sample({ tag: "h2", isHeading: true, fontFamily: playfair, textChars: 3000 }),
            sample({ tag: "p", fontFamily: "Lato, sans-serif", textChars: 800 }),
        ]);

        expect(summary.bodyFont).toBe("Lato");
        expect(summary.headingFont).toBe("Playfair Display");
    });

    it("merges repeated tag/size/weight combinations into one type step, largest first", () => {
        const summary = summarise([
            sample({ tag: "p", fontSize: "16px", textChars: 300 }),
            sample({
                tag: "h2",
                isHeading: true,
                fontSize: "32px",
                fontWeight: "700",
                textChars: 20,
            }),
            sample({ tag: "p", fontSize: "16px", textChars: 200 }),
            sample({
                tag: "h2",
                isHeading: true,
                fontSize: "32px",
                fontWeight: "700",
                textChars: 15,
            }),
        ]);

        expect(summary.typeScale.map(({ tag, size, chars }) => [tag, size, chars])).toEqual([
            ["h2", "32px", 35],
            ["p", "16px", 500],
        ]);
    });
});

describe("brandTable", () => {
    it("prints the six ingredients DESIGN.md's brand table needs, with Tone left for a person", () => {
        const summary = summarise([
            sample({ tag: "body", background: CREAM, area: 1280 * 3000 }),
            sample({ tag: "h1", isHeading: true, fontFamily: "Playfair Display", textChars: 50 }),
            sample({ tag: "p", fontFamily: "Lato", textChars: 800 }),
            sample({ tag: "a", isLink: true, color: GREEN, textChars: 40 }),
        ]);
        const rows = brandTable(summary).split("\n").slice(2);

        expect(rows.map((row) => row.split("|")[1]?.trim())).toEqual([
            "Paper",
            "Ink",
            "Primary",
            "Accent",
            "Type",
            "Tone",
        ]);
        expect(rows[4]).toBe("| Type | Playfair Display for headings, Lato for body text |");
        expect(rows[5]).toBe("| Tone | — |");
    });
});
