import { ESLint, type Linter } from "eslint";
import tseslint from "typescript-eslint";
import { describe, expect, it } from "vitest";
import {
    createNodeConfig,
    createNuxtConfig,
    createVueConfig,
    layerBoundaries,
    pureDomain,
    routeMeta,
    tailwind,
} from "./index.ts";

const resolve = async (config: object[], filePath: string) => {
    const eslint = new ESLint({
        overrideConfigFile: true,
        overrideConfig: config as Linter.Config[],
    });
    if (await eslint.isPathIgnored(filePath)) return undefined;
    const resolved = (await eslint.calculateConfigForFile(filePath)) as Linter.Config | undefined;
    return resolved?.rules ?? {};
};

const severity = (entry: Linter.RuleEntry | undefined): number | undefined => {
    const level = Array.isArray(entry) ? entry[0] : entry;
    return level === "error" ? 2 : level === "warn" ? 1 : level === "off" ? 0 : level;
};

const importBans = async (config: object[], filePath: string): Promise<string> =>
    JSON.stringify((await resolve(config, filePath))?.["no-restricted-imports"]);

describe("eslint factories", () => {
    it("loads the in-house plugin when several configs and an appended one all register it", async () => {
        // The linted file isn't on disk, so no tsconfig can type it
        const config = [...createNuxtConfig(), routeMeta, tseslint.configs.disableTypeChecked];
        const eslint = new ESLint({
            overrideConfigFile: true,
            overrideConfig: config as Linter.Config[],
        });

        const [result] = await eslint.lintText("export default defineEventHandler(() => 1);\n", {
            filePath: `${process.cwd()}/server/api/items.get.ts`,
        });

        expect(result?.messages.map(({ ruleId }) => ruleId)).toContain(
            "joinery/require-route-meta",
        );
    });

    it("keeps each import ban on its own paths instead of one replacing another", async () => {
        const config = createNuxtConfig();

        expect(await importBans(config, "src/core/ports/Client.ts")).toContain("nitropack");
        expect(await importBans(config, "app/composables/useItems.ts")).toContain("tools");
        expect(await importBans(config, "server/api/items.get.ts")).toContain("tools");
        expect(await importBans(config, "e2e/home.spec.ts")).toContain("@playwright/test");
    });

    it("lints a project's root config file, with only the rules that need its types turned off", async () => {
        for (const rules of [
            await resolve(createNodeConfig(), "vitest.config.ts"),
            await resolve(createNuxtConfig(), "nuxt.config.ts"),
        ]) {
            expect(severity(rules?.["format/prettier"])).toBe(2);
            expect(severity(rules?.["@typescript-eslint/no-floating-promises"])).toBe(0);
        }
    });

    it("bans I/O in domain/ only, leaving adapters and specs free to use it", async () => {
        const config = [...createNodeConfig(), pureDomain];

        expect(await importBans(config, "src/map/domain/render.ts")).toContain("node:fs");
        expect(await importBans(config, "src/map/adapters/files.ts")).toBeUndefined();
        expect(await importBans(config, "src/map/domain/render.spec.ts")).toBeUndefined();
    });

    it("applies the Vue rules only to the Vue flavours, and route meta only when appended", async () => {
        const node = await resolve(createNodeConfig(), "server/api/items.get.ts");
        const vue = await resolve(createVueConfig(), "lib/Button.vue");
        const nuxt = await resolve(createNuxtConfig(), "server/api/items.get.ts");

        expect(node?.["joinery/require-route-meta"]).toBeUndefined();
        expect(nuxt?.["joinery/require-route-meta"]).toBeUndefined();
        expect(severity(vue?.["joinery/no-template-call"])).toBe(2);
        expect(severity(vue?.["joinery/props-shape"])).toBe(2);
        expect(severity(vue?.["vue/no-v-html"])).toBe(2);
    });

    it("type-checks a Nuxt app's scripts but not the specs and stories that import components", async () => {
        const config = createNuxtConfig();
        const script = await resolve(config, "app/composables/useItems.ts");
        const spec = await resolve(config, "app/composables/useItems.spec.ts");
        const story = await resolve(config, "app/components/Card.stories.ts");
        const component = await resolve(config, "app/App.vue");

        expect(severity(script?.["@typescript-eslint/no-misused-promises"])).toBe(2);
        expect(severity(script?.["@typescript-eslint/require-array-sort-compare"])).toBe(2);
        expect(spec?.["@typescript-eslint/no-misused-promises"]).toBeUndefined();
        expect(story?.["@typescript-eslint/no-misused-promises"]).toBeUndefined();
        expect(component?.["@typescript-eslint/no-misused-promises"]).toBeUndefined();
    });

    it("holds every spec to observable behaviour: no call order, snapshots or instance reads", async () => {
        const rules = await resolve(createNuxtConfig(), "app/components/Thing.spec.ts");
        const source = await resolve(createNuxtConfig(), "app/components/Thing.ts");

        expect(severity(rules?.["joinery/no-implementation-details"])).toBe(2);
        expect(JSON.stringify(rules?.["vitest/no-restricted-matchers"])).toContain(
            "toHaveBeenNthCalledWith",
        );
        expect(source?.["joinery/no-implementation-details"]).toBeUndefined();
    });

    it("scopes layer boundaries to layers/ and leaves the tools/ ban in place there", async () => {
        const config = [
            ...createNuxtConfig(),
            layerBoundaries({ cores: ["design"], kit: ["app/utils/"] }),
        ];
        const layer = await resolve(config, "layers/audits/app/utils/format.ts");
        const shell = await resolve(config, "app/pages/index.vue");

        expect(severity(layer?.["joinery/layer-boundaries"])).toBe(2);
        expect(await importBans(config, "layers/audits/app/utils/format.ts")).toContain("tools");
        expect(shell?.["joinery/layer-boundaries"]).toBeUndefined();
    });

    it("lints the kit paths an app names and still leaves the rest of the shell alone", async () => {
        const config = [
            ...createNuxtConfig(),
            layerBoundaries({ cores: ["design"], kit: ["app/composables/"] }),
        ];
        const kit = await resolve(config, "app/composables/useTrack.ts");
        const shell = await resolve(config, "app/layouts/default.vue");

        expect(severity(kit?.["joinery/layer-boundaries"])).toBe(2);
        expect(shell?.["joinery/layer-boundaries"]).toBeUndefined();
    });

    it("scopes Tailwind to the entry point the app passes", async () => {
        const config = [...createNuxtConfig(), tailwind("app/main.css")];
        const rules = await resolve(config, "app/App.vue");

        expect(severity(rules?.["better-tailwindcss/no-unknown-classes"])).toBe(2);
    });
});
