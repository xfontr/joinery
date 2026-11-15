import { out } from "../shared/adapters/io.ts";
import type { Args } from "../shared/cli.ts";
import { ExpectedError } from "../shared/errors.ts";
import { sampleStyles } from "./adapters/browser.ts";
import { brandTable, summarise, typeTable, weightedList } from "./domain/brand.ts";
import { ramp, rampTokens } from "./domain/ramp.ts";

const USAGE = "Name the pages to read — pnpm brand:extract <url> [<url>…]";

const isHttp = (value: string): boolean => {
    try {
        return ["http:", "https:"].includes(new URL(value).protocol);
    } catch {
        return false;
    }
};

export const extract = async ({ positionals }: Args): Promise<void> => {
    if (positionals.length === 0) throw new ExpectedError(USAGE);
    const invalid = positionals.filter((url) => !isHttp(url));
    if (invalid.length > 0) throw new ExpectedError(`Not an http(s) URL: ${invalid.join(", ")}`);

    const pages = await sampleStyles(positionals);
    for (const page of pages.filter(({ samples }) => samples.length === 0)) {
        out.warn(`${page.url} answered ${page.status}; skipped.`);
    }

    const samples = pages.flatMap((page) => page.samples);
    if (samples.length === 0) throw new ExpectedError("No page could be read.");

    const summary = summarise(samples);
    const read = pages.filter((page) => page.samples.length > 0).map((page) => page.url);

    out.info(`Read ${samples.length} elements from ${read.join(", ")} at 1280 px.`);
    out.note(brandTable(summary), "Brand");
    for (const role of ["paper", "ink", "primary", "accent"] as const) {
        out.note(rampTokens(role, ramp(summary[role])), `Ramp from ${role} ${summary[role]}`);
    }
    out.note(typeTable(summary.typeScale), "Type scale");
    out.note(weightedList(summary.radii), "Control radii (count)");
    out.note(weightedList(summary.palette), "Palette (painted px²)");
};
