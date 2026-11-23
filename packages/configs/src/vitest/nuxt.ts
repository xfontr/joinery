import { globSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { defineConfig } from "vitest/config";
import type { CoverageOptions } from "vitest/node";
import createNodeConfig, { gated } from "./node.ts";

const stubs = fileURLToPath(new URL("./setup/stubs.ts", import.meta.url));
const autoUnmount = fileURLToPath(new URL("./setup/autoUnmount.ts", import.meta.url));

export interface NuxtConfigOptions {
    /** The app root, usually `import.meta.dirname`. */
    root: string;
    /** Specs under `app/` or the app root that need no Nuxt runtime, moved to the node project. */
    nodeSpecs?: string[];
    /** Setup files for the `nuxt` project, run after the Nuxt entry registers its boot but before it runs. */
    setupFiles?: string[];
    /** Extra paths kept out of the coverage denominator. */
    coverageExclude?: string[];
    thresholds?: CoverageOptions["thresholds"];
}

// Nuxt auto-registers `<rootDir>/layers/*`, and each layer repeats the app's own directory layout
const inAppAndLayers = (...globs: string[]) => globs.flatMap((glob) => [glob, `layers/*/${glob}`]);

const NODE_SPECS = inAppAndLayers(
    ...["shared", "server", "modules", "tools"].map((dir) => `${dir}/**/*.spec.ts`),
);
const NUXT_SPECS = inAppAndLayers("app/**/*.spec.ts");
const LAYER_SOURCES = ["layers/*/{app,server,shared,modules}/**/*.ts", "layers/*/app/**/*.vue"];

const MOCKS_A_MODULE = /\b(?:vi\.mock|mockNuxtImport|mockComponent)\(/;

const findMockingSpecs = (root: string) =>
    globSync(NUXT_SPECS, { cwd: root }).filter((path) =>
        MOCKS_A_MODULE.test(readFileSync(join(root, path), "utf8")),
    );

const withEnv = async <T>(vars: Record<string, string>, run: () => Promise<T>): Promise<T> => {
    const previous = Object.fromEntries(Object.keys(vars).map((key) => [key, process.env[key]]));
    Object.assign(process.env, vars);

    try {
        return await run();
    } finally {
        for (const [key, value] of Object.entries(previous)) {
            if (value === undefined) delete process.env[key];
            else process.env[key] = value;
        }
    }
};

// Resolved from the app, so this runs the same copy its specs import `@nuxt/test-utils/runtime` from
const defineNuxtProject = async (root: string, test: object) => {
    const entry = createRequire(join(root, "package.json")).resolve("@nuxt/test-utils/config");
    const { defineVitestProject } = (await import(
        pathToFileURL(entry).href
    )) as typeof import("@nuxt/test-utils/config");

    // With jiti's module cache on, a TypeScript Nuxt module that installs @nuxtjs/i18n throws Node's
    // ERR_INTERNAL_ASSERTION as an unhandled rejection, which kills Vitest and Nx's plugin worker
    return withEnv({ JITI_MODULE_CACHE: "0" }, () => defineVitestProject({ root, test }));
};

/**
 * A `node` project for `server/`, `shared/`, `modules/` and `tools/`, and `nuxt` and
 * `nuxt-isolated` projects for `app/`, in the root and every layer.
 */
const createNuxtConfig = async ({
    root,
    nodeSpecs = [],
    setupFiles = [],
    coverageExclude = [],
    thresholds,
}: NuxtConfigOptions) => {
    const nodeConfig = createNodeConfig();
    const { globalSetup, coverage, ...nodeTest } = nodeConfig.test ?? {};
    const mockingSpecs = findMockingSpecs(root);

    const nuxtBase = await defineNuxtProject(root, {
        fileParallelism: false,
        sequence: { groupOrder: 1 },
        setupFiles: [nodeTest.setupFiles ?? [], autoUnmount, setupFiles].flat(),
        environmentOptions: {
            nuxt: {
                rootDir: root,
                domEnvironment: "happy-dom",
                overrides: {
                    // Nx loads this config to build its graph, and a boot into `.nuxt` leaves it
                    // without the tsconfigs `nuxt build`'s typecheck reads through tsconfig.json
                    buildDir: join(root, "node_modules/.cache/nuxt-vitest"),
                    // nuxt-seo-utils warns on that boot about test-utils' `ssr: false` otherwise
                    site: { indexable: false },
                    // Specs pin routes, not the path a deploy mounts the app under
                    app: { baseURL: "/" },
                },
            },
        },
    });
    const nuxtProject = (test: object) => ({ ...nuxtBase, test: { ...nuxtBase.test, ...test } });

    const projects = [
        {
            ...nodeConfig,
            test: {
                ...nodeTest,
                name: "node",
                setupFiles: [nodeTest.setupFiles ?? [], stubs].flat(),
                include: [...NODE_SPECS, ...nodeSpecs],
            },
        },
        nuxtProject({
            name: "nuxt",
            isolate: false,
            include: NUXT_SPECS,
            exclude: [...nodeSpecs, ...mockingSpecs],
        }),
        mockingSpecs.length > 0 &&
            nuxtProject({
                name: "nuxt-isolated",
                isolate: true,
                fileParallelism: true,
                // Vitest rejects two projects with different worker counts in one group
                sequence: { groupOrder: 2 },
                include: mockingSpecs,
                exclude: nodeSpecs,
            }),
    ];

    return defineConfig({
        test: {
            globalSetup,
            // Vitest reads coverage only from the root, so a block on either project is ignored
            coverage: {
                ...coverage,
                include: [...(coverage?.include ?? []), ...LAYER_SOURCES],
                exclude: [...(coverage?.exclude ?? []), ...coverageExclude],
                thresholds: gated(thresholds),
            },
            projects: projects.filter((project) => project !== false),
        },
    });
};

export default createNuxtConfig;
