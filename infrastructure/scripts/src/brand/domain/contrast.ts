import { parse, wcagContrast } from "culori";
import { ExpectedError } from "../../shared/errors.ts";

/** WCAG 2.1 AA for body-size text. */
export const MINIMUM = 4.5;

const ACTION_ROLES = ["--ui-primary", "--ui-secondary", "--ui-error"];

const VAR = /^var\(\s*(--[\w-]+)\s*(?:,[^)]*)?\)$/;

interface Pair {
    text: string;
    surface: string;
}

export type Row = Pair & { token: string; surfaceToken: string; ratio: number };

/** Follows nested `var()` references down to a literal value. */
export const resolve = (map: Map<string, string>, name: string, seen: string[] = []): string => {
    if (seen.includes(name)) throw new ExpectedError(`${[...seen, name].join(" → ")} is a cycle.`);

    const value = map.get(name);
    if (value === undefined) {
        const from = seen.at(-1);
        throw new ExpectedError(
            from === undefined
                ? `${name} is not defined.`
                : `${from} points at ${name}, which is not defined.`,
        );
    }

    const reference = VAR.exec(value.trim())?.[1];
    return reference === undefined ? value.trim() : resolve(map, reference, [...seen, name]);
};

const isTextRole = (name: string): boolean =>
    (name === "--ui-text" || name.startsWith("--ui-text-")) && name !== "--ui-text-inverted";

const isSurfaceRole = (name: string): boolean =>
    (name === "--ui-bg" || name.startsWith("--ui-bg-")) && name !== "--ui-bg-inverted";

/** Every text role on every surface role, plus inverted text on the inverted surface. */
export const pairs = (map: Map<string, string>): Pair[] => {
    const names = [...map.keys()];
    const texts = [...names.filter(isTextRole), ...ACTION_ROLES.filter((role) => map.has(role))];
    const surfaces = names.filter(isSurfaceRole);

    const inverted =
        map.has("--ui-text-inverted") && map.has("--ui-bg-inverted")
            ? [{ text: "--ui-text-inverted", surface: "--ui-bg-inverted" }]
            : [];

    return [
        ...texts.flatMap((text) => surfaces.map((surface) => ({ text, surface }))),
        ...inverted,
    ];
};

/** The palette token a role names, without its `--color-` prefix, or the literal it holds. */
const tokenOf = (map: Map<string, string>, name: string): string => {
    const value = (map.get(name) ?? "").trim();
    const reference = VAR.exec(value)?.[1];
    return reference === undefined ? value : reference.replace(/^--color-/, "");
};

const colourOf = (map: Map<string, string>, name: string): string => {
    const value = resolve(map, name);
    if (parse(value) === undefined)
        throw new ExpectedError(`${name} resolves to "${value}", not a colour.`);
    return value;
};

export const measure = (map: Map<string, string>): Row[] =>
    pairs(map).map((pair) => ({
        ...pair,
        token: tokenOf(map, pair.text),
        surfaceToken: tokenOf(map, pair.surface),
        ratio: wcagContrast(colourOf(map, pair.text), colourOf(map, pair.surface)),
    }));

export const failing = (rows: Row[]): Row[] => rows.filter((row) => row.ratio < MINIMUM);

const BELOW = ` — below ${MINIMUM}:1`;

const ratioText = (ratio: number): string => `${ratio.toFixed(2)}:1${ratio < MINIMUM ? BELOW : ""}`;

export const contrastTable = (rows: Row[]): string =>
    [
        "| Role | Token | Surface | Ratio |",
        "| --- | --- | --- | --- |",
        ...rows.map(
            (row) =>
                `| \`${row.text}\` | \`${row.token}\` | \`${row.surface}\` → \`${row.surfaceToken}\` | ${ratioText(row.ratio)} |`,
        ),
    ].join("\n");
