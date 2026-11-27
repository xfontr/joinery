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
    it.each([
        "bg-tide-600",
        "bg-red-500/50",
        "bg-red-500!",
        "!text-neutral-700",
        "inset-ring-sky-300",
    ])(
        "rejects a palette step in any variant or opacity form, so colour can only arrive through a role (%s)",
        async (classes) => {
            expect(await restrictedClasses(classes)).toEqual([
                expect.stringContaining("names a palette step"),
            ]);
        },
    );

    it.each(["text-[#333]", "tracking-[0.02em]"])(
        "rejects an arbitrary type value, so sizes and spacing only come from main.css tokens (%s)",
        async (classes) => {
            expect(await restrictedClasses(classes)).toEqual([
                expect.stringContaining("hard-codes a type value"),
            ]);
        },
    );

    it.each([
        "bg-[#333]",
        "fill-[var(--color-marina-sage-600)]",
        "bg-(--color-red-500)",
        "ring-(color:--color-tide-400)",
        "bg-[red]",
        "border-s-[#333]",
    ])(
        "rejects an arbitrary colour in bracket, variable or named form, so no hex or palette step slips past the roles (%s)",
        async (classes) => {
            expect(await restrictedClasses(classes)).toEqual([
                expect.stringContaining("hard-codes a colour"),
            ]);
        },
    );

    it.each(["border-[2px]", "border-(length:--border-w)"])(
        "lets a non-colour arbitrary value through, so the colour ban never blocks a size (%s)",
        async (classes) => {
            expect(await restrictedClasses(classes)).toEqual([]);
        },
    );

    it.each(["bg-default", "text-primary"])(
        "lets a Nuxt UI role through, so the ban never blocks the way colour is meant to arrive (%s)",
        async (classes) => {
            expect(await restrictedClasses(classes)).toEqual([]);
        },
    );
});
