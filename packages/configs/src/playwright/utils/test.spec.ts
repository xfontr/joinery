import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

const FIXTURE = fileURLToPath(new URL("./test.ts", import.meta.url));
const PLAYWRIGHT = fileURLToPath(new URL("../../../node_modules/.bin/playwright", import.meta.url));

const PAGE = (script: string) =>
    `data:text/html,${encodeURIComponent(`<body><script>${script}</script></body>`)}`;

interface Report {
    suites: {
        specs: {
            title: string;
            ok: boolean;
            tests: { results: { error?: { message?: string } }[] }[];
        }[];
    }[];
}

/** Runs one throwaway Playwright spec through the fixture and reports whether it passed and why not. */
const runFixture = async (body: string) => {
    // Outside node_modules, which Playwright never collects specs from; the fixture resolves its own copy
    const dir = await mkdtemp(join(tmpdir(), "playwright-fixture-"));
    await writeFile(
        join(dir, "probe.spec.ts"),
        `import { test } from ${JSON.stringify(FIXTURE)};\n${body}\n`,
    );

    const { stdout } = await promisify(execFile)(PLAYWRIGHT, ["test", "--reporter=json"], {
        cwd: dir,
        env: { ...process.env, CI: "1" },
    })
        .catch((failed: { stdout: string }) => failed)
        .finally(() => rm(dir, { recursive: true, force: true }));
    const [spec] = (JSON.parse(stdout) as Report).suites[0]!.specs;

    return { ok: spec!.ok, error: spec!.tests[0]!.results[0]!.error?.message ?? "" };
};

describe.concurrent("axeViolations", () => {
    const A11Y = fileURLToPath(new URL("./a11y.ts", import.meta.url));
    const scan = (html: string) =>
        runFixture(
            `import { expect } from ${JSON.stringify(FIXTURE)};\nimport { axeViolations } from ${JSON.stringify(A11Y)};\ntest("scans", async ({ page }) => { await page.setContent(${JSON.stringify(html)}); expect(await axeViolations(page)).toEqual([]); });`,
        );

    it("fails a page with a WCAG AA violation", async () => {
        const result = await scan(
            '<html lang="es"><title>t</title><main><img src="x.png"></main></html>',
        );

        expect(result.ok).toBe(false);
        expect(result.error).toContain("image-alt");
    });
});

describe.concurrent("playwright test fixture", () => {
    it("fails a test whose page logs to its console", async () => {
        const result = await runFixture(
            `test("logs", async ({ page }) => { await page.goto(${JSON.stringify(PAGE("console.warn('stray')"))}); });`,
        );

        expect(result.ok).toBe(false);
        expect(result.error).toContain("the page logged to its console");
        expect(result.error).toContain("stray");
    });

    it("lets through the output a test declares with allowedConsole", async () => {
        const result = await runFixture(
            `test.use({ allowedConsole: [/^expected/] });\ntest("allows", async ({ page }) => { await page.goto(${JSON.stringify(PAGE("console.warn('expected noise')"))}); });`,
        );

        expect(result).toEqual({ ok: true, error: "" });
    });
});
