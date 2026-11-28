import { ESLint, type Linter } from "eslint";
import { beforeAll, describe, expect, it } from "vitest";
import config from "./eslint.config.ts";

const RULE = "better-tailwindcss/no-restricted-classes";

const eslint = new ESLint({
    cwd: import.meta.dirname,
    overrideConfigFile: true,
    overrideConfig: config as Linter.Config[],
});

const restrictedClasses = async (classes: string): Promise<string[]> => {
    const [result] = await eslint.lintText(
        `<template>\n    <div class="${classes}" />\n</template>\n`,
        { filePath: `${import.meta.dirname}/app/components/Probe.vue` },
    );

    return (result?.messages ?? [])
        .filter(({ ruleId }) => ruleId === RULE)
        .map(({ message }) => message);
};

// The first lint loads the Tailwind entry CSS, which took 6.6 s in CI against a 5 s test timeout.
beforeAll(() => restrictedClasses("bg-default"), 30_000);

describe("eslint config", () => {
    it.each(["bg-neutral-900", "bg-red-500/50", "bg-red-500!", "!text-neutral-700"])(
        "rejects a palette step in any variant or opacity form, so colour can only arrive through a role (%s)",
        async (classes) => {
            expect(await restrictedClasses(classes)).toEqual([
                expect.stringContaining("names a palette step"),
            ]);
        },
    );

    it.each(["bg-paper", "text-ink", "text-white", "md:bg-black/50"])(
        "rejects a named colour, which would stay put when the invert toggle swaps the roles (%s)",
        async (classes) => {
            expect(await restrictedClasses(classes)).toEqual([
                expect.stringContaining("names a colour"),
            ]);
        },
    );

    it.each(["bg-[#333]", "fill-[var(--color-paper)]", "bg-(--color-ink)", "bg-[red]"])(
        "rejects an arbitrary colour in bracket, variable or named form (%s)",
        async (classes) => {
            expect(await restrictedClasses(classes)).toEqual([
                expect.stringContaining("hard-codes a colour"),
            ]);
        },
    );

    it.each(["text-[2.1rem]", "tracking-[0.02em]"])(
        "rejects an arbitrary type value, so sizes only come from main.css tokens (%s)",
        async (classes) => {
            expect(await restrictedClasses(classes)).toEqual([
                expect.stringContaining("hard-codes a type value"),
            ]);
        },
    );

    it.each(["text-sm", "text-base", "md:text-2xl"])(
        "rejects Tailwind's own type scale, so no size outside the old site's steps slips in (%s)",
        async (classes) => {
            expect(await restrictedClasses(classes)).toEqual([
                expect.stringContaining("Tailwind's type scale"),
            ]);
        },
    );

    it.each(["p-4", "mt-[13px]", "-mx-2", "gap-(--gutter)", "top-1/2", "px-px"])(
        "rejects a spacing value outside the token layer (%s)",
        async (classes) => {
            expect(await restrictedClasses(classes)).toEqual([
                expect.stringContaining("hard-codes a spacing value"),
            ]);
        },
    );

    it.each(["z-10", "z-[999]", "-z-1", "z-(--layer)"])(
        "rejects a raw z-index, so stacking only comes from the token layer (%s)",
        async (classes) => {
            expect(await restrictedClasses(classes)).toEqual([
                expect.stringContaining("hard-codes a z-index"),
            ]);
        },
    );

    it.each([
        "bg-default",
        "text-inverted",
        "text-xl",
        "text-status",
        "p-m",
        "gap-s",
        "md:mb-l",
        "inset-0",
        "z-m",
        "border-[2px]",
    ])(
        "lets a token or a role through, so the bans never block the way values are meant to arrive (%s)",
        async (classes) => {
            expect(await restrictedClasses(classes)).toEqual([]);
        },
    );
});
