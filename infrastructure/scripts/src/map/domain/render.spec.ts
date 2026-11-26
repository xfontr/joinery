import { describe, expect, it } from "vitest";
import type { Capability, Doc } from "./capabilities.ts";
import { render } from "./render.ts";

const command = (invocation: string, source: string, token: string): Capability => ({
    kind: "command",
    invocation,
    source,
    token,
});

describe("render", () => {
    it("omits a section entirely when it has no capabilities, rather than an empty table", () => {
        const markdown = render([command("pnpm docs:map", "package.json", "docs:map")], []);

        expect(markdown).toContain("## Commands");
        expect(markdown).not.toContain("## Git hooks");
        expect(markdown).not.toContain("## Workflows");
        expect(markdown).not.toContain("## Agent skills");
    });

    it("marks an undocumented capability with a dash instead of leaving the cell blank", () => {
        const markdown = render([command("pnpm release", "package.json", "release")], []);

        expect(markdown).toContain("| `pnpm release` | [`package.json`](../package.json) | — |");
    });

    it("links a documented capability to the doc that explains it, not just names it", () => {
        const capability = command("pnpm docs:map", "package.json", "docs:map");
        const docs: Doc[] = [{ path: "README.md", text: "| `pnpm docs:map` | Render the map |" }];

        const markdown = render([capability], docs);

        expect(markdown).toContain(
            "| `pnpm docs:map` | [`package.json`](../package.json) | [`README.md`](../README.md) |",
        );
    });

    it("keeps sections in a fixed order regardless of the order capabilities were passed in", () => {
        const capabilities: Capability[] = [
            {
                kind: "skill",
                invocation: "/new-package",
                source: ".claude/skills/new-package/SKILL.md",
                token: "new-package",
            },
            command("pnpm lint", "package.json", "lint"),
        ];

        const markdown = render(capabilities, []);

        expect(markdown.indexOf("## Commands")).toBeLessThan(markdown.indexOf("## Agent skills"));
    });
});
