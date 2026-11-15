import { formatHex, oklch, toGamut } from "culori";

export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

/** OKLCH lightness of Tailwind v4's `--color-neutral-*`, so a generated ramp steps like its own. */
const LIGHTNESS = [0.985, 0.97, 0.922, 0.87, 0.708, 0.556, 0.439, 0.371, 0.269, 0.205, 0.145];

/** How much of the anchor's chroma survives at the far end of each side. */
const END_CHROMA = 0.25;

const toSrgb = toGamut("rgb", "oklch");

export type Ramp = { step: (typeof STEPS)[number]; hex: string }[];

/** Eleven steps on the anchor's hue; the anchor sits unchanged at the step nearest its lightness. */
export const ramp = (anchorHex: string): Ramp => {
    const anchor = oklch(anchorHex);
    if (anchor === undefined) throw new Error(`"${anchorHex}" is not a colour.`);

    const lightness = anchor.l;
    const at = LIGHTNESS.reduce(
        (best, value, index) =>
            Math.abs(value - lightness) < Math.abs((LIGHTNESS[best] ?? 0) - lightness)
                ? index
                : best,
        0,
    );

    return STEPS.map((step, index) => {
        if (index === at) return { step, hex: formatHex(anchorHex) ?? anchorHex };

        const side = index < at ? at : LIGHTNESS.length - 1 - at;
        const distance = Math.abs(index - at) / side;
        const colour = toSrgb({
            mode: "oklch",
            l: LIGHTNESS[index] ?? lightness,
            c: anchor.c * (1 - (1 - END_CHROMA) * distance),
            h: anchor.h,
        });

        return { step, hex: formatHex(colour) };
    });
};

export const rampTokens = (name: string, steps: Ramp): string =>
    steps.map(({ step, hex }) => `--color-${name}-${step}: ${hex};`).join("\n");
