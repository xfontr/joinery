import { beforeEach, describe, expect, it, vi } from "vitest";
import { resolve } from "node:path";
import { brokenLinks, hrefsIn } from "./brokenLinks.ts";
import { WORKSPACE_ROOT } from "./paths.ts";

const state = vi.hoisted(() => ({ paths: [] as string[], sources: new Map<string, string>() }));
const fs = vi.hoisted(() => ({ access: vi.fn(), readFile: vi.fn() }));
const run = vi.hoisted(() => ({ git: vi.fn() }));

vi.mock("node:fs/promises", () => fs);
vi.mock("./run.ts", () => run);

const addFile = (path: string, source = ""): void => {
    state.sources.set(resolve(WORKSPACE_ROOT, path), source);
};

beforeEach(() => {
    vi.clearAllMocks();
    state.paths = [];
    state.sources.clear();
    fs.access.mockImplementation(async (path: string) => {
        if (!state.sources.has(path)) throw new Error("missing");
    });
    fs.readFile.mockImplementation(async (path: string) => state.sources.get(path) ?? "");
    run.git.mockImplementation(async () => state.paths.join("\n"));
});

describe("hrefsIn", () => {
    it("skips link syntax shown in a code span or a fenced sample, so documenting a link never reports it broken", () => {
        const source = [
            "Write `[x](y)` to link.",
            "```md",
            "[template](./<previous>.md)",
            "```",
            "- A list item:",
            "  ```sh",
            "  echo [a](b)",
            "  ```",
            "[real](./real.md)",
        ].join("\n");

        expect(hrefsIn(source)).toEqual(["./real.md"]);
    });

    it("keeps a link whose text is code, including brackets inside that code", () => {
        expect(
            hrefsIn("See [`add.ts`](./add.ts) and [`pages/[slug].vue`](./pages/%5Bslug%5D.vue)."),
        ).toEqual(["./add.ts", "./pages/%5Bslug%5D.vue"]);
        expect(hrefsIn('[`[artifact].get.ts`](./[artifact].get.ts "Route [artifact]")')).toEqual([
            "./[artifact].get.ts",
        ]);
    });

    it("pairs a code span that wraps a line, but never lets one run past a blank line", () => {
        expect(
            hrefsIn("the `pnpm install\n--prod` in the [`Dockerfile`](./docker/Dockerfile)"),
        ).toEqual(["./docker/Dockerfile"]);
        expect(hrefsIn("a stray ` tick\n\n[after](./after.md)")).toEqual(["./after.md"]);
    });

    it("reads titled links after malformed brackets without rescanning a long prefix", () => {
        const source = `${"[".repeat(20_000)}\n[good](./good.md "A title")`;

        expect(hrefsIn(source)).toEqual(["./good.md"]);
        expect(hrefsIn(`${"[bad](unterminated ".repeat(20_000)}[good](./good.md)`)).toEqual([
            "./good.md",
        ]);
    });

    it("skips multiline code spans and leaves links after unmatched backtick runs", () => {
        expect(hrefsIn("``[hidden](./hidden.md)\nstill hidden`` [shown](./shown.md)")).toEqual([
            "./shown.md",
        ]);
        expect(hrefsIn(`stray ${"`".repeat(20_000)}\n\n[after](./after.md)`)).toEqual([
            "./after.md",
        ]);
        expect(hrefsIn("`` [visible](./visible.md) ```")).toEqual(["./visible.md"]);
    });
});

describe("brokenLinks", () => {
    it("reports a missing relative target, but not external, anchor, mailto, placeholder or existing-directory links", async () => {
        addFile(
            "docs/source.md",
            [
                "# Source",
                "[valid](./target.md)",
                "[extensionless](./target)",
                "[lines](./target.md:3-5)",
                "[missing](./gone.md)",
                "[external](https://example.test)",
                "[anchor](#section)",
                "[mail](mailto:docs@example.test)",
                "[placeholder](<file>.md)",
                "[directory](../packages/ui)",
            ].join("\n"),
        );
        addFile("docs/target.md", "# Target\n");
        addFile("packages/ui");
        state.paths = ["docs/source.md"];

        expect(await brokenLinks()).toEqual([
            { file: "docs/source.md", message: "links to `./gone.md`, which doesn't exist" },
        ]);
    });

    it("skips a listed file that is gone from disk, as an unstaged delete leaves it", async () => {
        state.paths = ["docs/deleted.md"];

        expect(await brokenLinks()).toEqual([]);
    });
});
