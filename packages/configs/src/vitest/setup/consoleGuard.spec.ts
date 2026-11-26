import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { startVitest } from "vitest/node";

const GUARD = fileURLToPath(new URL("./consoleGuard.ts", import.meta.url));

// Under this package's node_modules, so the throwaway spec resolves `vitest` like any other
const CACHE = fileURLToPath(new URL("../../../node_modules/.cache", import.meta.url));

let dir = "";

/** Runs one throwaway spec under the guard alone and reports each test's outcome. */
const runGuarded = async (body: string) => {
    await mkdir(CACHE, { recursive: true });
    dir = await mkdtemp(join(CACHE, "console-guard-"));
    await writeFile(join(dir, "probe.spec.ts"), `import { it, vi } from "vitest";\n${body}\n`);

    const vitest = await startVitest(
        "test",
        [],
        { root: dir, watch: false, setupFiles: [GUARD], reporters: [], silent: true },
        {},
    );
    await vitest.close();

    return vitest.state.getFiles().flatMap((file) =>
        file.tasks.map((task) => ({
            name: task.name,
            state: task.result?.state,
            error: task.result?.errors?.[0]?.message ?? "",
        })),
    );
};

afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
});

describe("console guard", () => {
    it("fails a test that writes to the console, naming the call", async () => {
        const [result] = await runGuarded('it("logs", () => { console.warn("stray warning"); });');

        expect(result?.state).toBe("fail");
        expect(result?.error).toContain("Console output fails the test");
        expect(result?.error).toContain("console.warn: stray warning");
    });

    it("passes a test that stubs the output it expects", async () => {
        const [result] = await runGuarded(
            'it("stubs", () => { vi.spyOn(console, "warn").mockImplementation(() => {}); console.warn("expected"); });',
        );

        expect(result?.state).toBe("pass");
    });

    it("lets Vue's experimental-Suspense notice through", async () => {
        const [result] = await runGuarded(
            'it("suspends", () => { console.info("<Suspense> is an experimental feature and its API will likely change."); });',
        );

        expect(result?.state).toBe("pass");
    });
});
