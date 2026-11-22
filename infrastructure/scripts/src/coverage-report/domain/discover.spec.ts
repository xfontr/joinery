import { describe, expect, it } from "vitest";
import { toReports } from "./discover.ts";

describe("toReports", () => {
    it("resolves {projectRoot} against each project's own root, not a shared guess", () => {
        expect(
            toReports([
                { name: "@monorepo/ui", root: "packages/ui", outputs: ["{projectRoot}/coverage"] },
                {
                    name: "@monorepo/huella-legal",
                    root: "apps/huella-legal",
                    outputs: ["{projectRoot}/coverage"],
                },
            ]),
        ).toEqual([
            { name: "@monorepo/ui", coverageFinal: "packages/ui/coverage/coverage-final.json" },
            {
                name: "@monorepo/huella-legal",
                coverageFinal: "apps/huella-legal/coverage/coverage-final.json",
            },
        ]);
    });

    it("throws naming the project when test:coverage declares no output", () => {
        expect(() =>
            toReports([{ name: "@monorepo/ui", root: "packages/ui", outputs: [] }]),
        ).toThrow(/@monorepo\/ui/);
    });
});
