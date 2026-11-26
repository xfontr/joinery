import { ESLint, type Linter } from "eslint";
import { resolve } from "node:path";
import tseslint from "typescript-eslint";
import { describe, expect, it } from "vitest";
import boundaries from "./boundaries.ts";

// The rule reads Nx's cached project graph, so these lint virtual files placed inside real projects.
const WORKSPACE = resolve(import.meta.dirname, "../../../../..");

const violations = async (importer: string, specifier: string): Promise<string[]> => {
    const eslint = new ESLint({
        cwd: WORKSPACE,
        overrideConfigFile: true,
        overrideConfig: [
            boundaries,
            { languageOptions: { parser: tseslint.parser } },
        ] as Linter.Config[],
    });
    const [result] = await eslint.lintText(
        `import { value } from "${specifier}";\nexport const used = value;\n`,
        { filePath: resolve(WORKSPACE, importer) },
    );

    return (result?.messages ?? []).map(({ message }) => message);
};

describe("boundaries", () => {
    it("rejects an integration package importing another, the edge the tag table forbids", async () => {
        expect(await violations("packages/content/src/edge.ts", "@joinery/i18n")).toEqual([
            'A project tagged with "type:integration" can only depend on libs tagged with "type:config"',
        ]);
    });

    it("lets an app import an integration package, so the rejection above isn't the rule failing everything", async () => {
        expect(await violations("apps/huella-legal/server/edge.ts", "@joinery/content")).toEqual(
            [],
        );
    });
});
