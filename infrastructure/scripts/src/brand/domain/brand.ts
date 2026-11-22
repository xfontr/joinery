import { formatHex, oklch, parse } from "culori";

/** One visible element's computed style, as the browser adapter reads it. */
export interface Sample {
    tag: string;
    /** An `a`, a `button`, a `[role=button]` or a submit input. */
    isLink: boolean;
    isHeading: boolean;
    color: string;
    background: string;
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    fontWeight: string;
    radius: string;
    /** Bounding box in CSS px². */
    area: number;
    /** Characters in the element's own text nodes, not its descendants'. */
    textChars: number;
}

interface TypeStep {
    tag: string;
    family: string;
    size: string;
    lineHeight: string;
    weight: string;
    chars: number;
}

export interface Weighted {
    value: string;
    weight: number;
}

interface BrandSummary {
    paper: string;
    ink: string;
    headingInk: string;
    primary: string;
    accent: string;
    bodyFont: string;
    headingFont: string;
    typeScale: TypeStep[];
    radii: Weighted[];
    palette: Weighted[];
}

/** Below this OKLCH chroma a colour reads as a grey, whatever its hue. */
const CHROMATIC = 0.04;

const TYPE_TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6", "p", "small"]);
const CONTROL_TAGS = new Set(["a", "button", "input", "select", "textarea"]);
const PALETTE_SIZE = 12;

/** Lower-case `#rrggbb`, or undefined for a transparent or unparseable colour. */
const opaqueHex = (css: string): string | undefined => {
    const colour = parse(css);
    if (colour === undefined || (colour.alpha !== undefined && colour.alpha < 1)) return undefined;
    return formatHex(colour);
};

export const chroma = (hex: string): number => oklch(hex)?.c ?? 0;

const tally = (entries: [string | undefined, number][]): Weighted[] => {
    const totals = new Map<string, number>();
    for (const [value, weight] of entries) {
        if (value === undefined || weight <= 0) continue;
        totals.set(value, (totals.get(value) ?? 0) + weight);
    }
    return [...totals]
        .map(([value, weight]) => ({ value, weight }))
        .sort((a, b) => b.weight - a.weight);
};

const top = (ranked: Weighted[], fallback: string): string => ranked[0]?.value ?? fallback;

const px = (size: string): number => Number.parseFloat(size) || 0;

/** The page area a sample's text paints, so text and fills can share one weight. */
const textArea = (sample: Sample): number => sample.textChars * px(sample.fontSize) ** 2 * 0.5;

const firstFamily = (stack: string): string =>
    (stack.split(",")[0] ?? "").trim().replace(/^["']|["']$/g, "");

export const summarise = (samples: Sample[]): BrandSummary => {
    const texts = samples.filter((sample) => sample.textChars > 0);
    const body = texts.filter((sample) => !sample.isLink && !sample.isHeading);
    const headings = texts.filter((sample) => sample.isHeading);
    const links = texts.filter((sample) => sample.isLink);

    const paper = top(
        tally(samples.map((sample) => [opaqueHex(sample.background), sample.area])),
        "#ffffff",
    );
    const ink = top(
        tally(body.map((sample) => [opaqueHex(sample.color), sample.textChars])),
        "#000000",
    );
    const headingInk = top(
        tally(headings.map((sample) => [opaqueHex(sample.color), sample.textChars])),
        ink,
    );

    const primary = top(
        tally(
            links.flatMap((sample): [string | undefined, number][] => [
                [opaqueHex(sample.color), sample.textChars],
                [opaqueHex(sample.background), sample.textChars],
            ]),
        ).filter(({ value }) => value !== ink && value !== paper),
        ink,
    );

    const palette = tally(
        samples.flatMap((sample): [string | undefined, number][] => [
            [opaqueHex(sample.background), sample.area],
            [opaqueHex(sample.color), textArea(sample)],
        ]),
    );
    const accent = top(
        palette.filter(
            ({ value }) =>
                ![primary, ink, headingInk, paper].includes(value) && chroma(value) > CHROMATIC,
        ),
        primary,
    );

    const steps = new Map<string, TypeStep>();
    for (const sample of texts.filter((candidate) => TYPE_TAGS.has(candidate.tag))) {
        const step = {
            tag: sample.tag,
            family: firstFamily(sample.fontFamily),
            size: sample.fontSize,
            lineHeight: sample.lineHeight,
            weight: sample.fontWeight,
        };
        const key = JSON.stringify(step);
        const chars = (steps.get(key)?.chars ?? 0) + sample.textChars;
        steps.set(key, { ...step, chars });
    }

    return {
        paper,
        ink,
        headingInk,
        primary,
        accent,
        bodyFont: firstFamily(
            top(tally(body.map((sample) => [sample.fontFamily, sample.textChars])), ""),
        ),
        headingFont: firstFamily(
            top(tally(headings.map((sample) => [sample.fontFamily, sample.textChars])), ""),
        ),
        typeScale: [...steps.values()].sort(
            (a, b) => px(b.size) - px(a.size) || a.tag.localeCompare(b.tag),
        ),
        radii: tally(
            samples
                .filter((sample) => sample.isLink || CONTROL_TAGS.has(sample.tag))
                .map((sample) => [px(sample.radius) > 0 ? sample.radius : undefined, 1]),
        ),
        palette: palette.slice(0, PALETTE_SIZE),
    };
};

/** The DESIGN.md brand table; Tone stays `—` because it is judged by a person, not measured. */
export const brandTable = (summary: BrandSummary): string =>
    [
        "| Ingredient | Direction |",
        "| --- | --- |",
        `| Paper | \`${summary.paper}\` as the page |`,
        `| Ink | \`${summary.ink}\` for text, \`${summary.headingInk}\` for headings |`,
        `| Primary | \`${summary.primary}\` for links and actions |`,
        `| Accent | \`${summary.accent}\` |`,
        `| Type | ${summary.headingFont} for headings, ${summary.bodyFont} for body text |`,
        "| Tone | — |",
    ].join("\n");

export const typeTable = (steps: TypeStep[]): string =>
    [
        "| Tag | Family | Size | Line height | Weight | Characters |",
        "| --- | --- | --- | --- | --- | --- |",
        ...steps.map(
            (step) =>
                `| ${step.tag} | ${step.family} | ${step.size} | ${step.lineHeight} | ${step.weight} | ${step.chars} |`,
        ),
    ].join("\n");

export const weightedList = (entries: Weighted[]): string =>
    entries.map(({ value, weight }) => `${value}  ${Math.round(weight)}`).join("\n");
