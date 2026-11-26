import { fileURLToPath } from "node:url";
import { configDefaults, coverageConfigDefaults, defineConfig } from "vitest/config";
import type { CoverageOptions } from "vitest/node";

// A `globalSetup` path resolves against the consuming project's root, never against this file.
const prepareNuxt = fileURLToPath(new URL("./setup/prepareNuxt.mjs", import.meta.url));
const consoleGuard = fileURLToPath(new URL("./setup/consoleGuard.ts", import.meta.url));

interface NodeConfigOptions {
    thresholds?: CoverageOptions["thresholds"];
}

/** A project's thresholds, unless the run only collects coverage for the developer portal's page. */
export const gated = (thresholds: CoverageOptions["thresholds"]) =>
    process.env.COVERAGE_THRESHOLDS === "off" ? undefined : thresholds;

const createNodeConfig = ({ thresholds }: NodeConfigOptions = {}) =>
    defineConfig({
        test: {
            globals: false,
            exclude: [...configDefaults.exclude, "dist/**/*"],
            globalSetup: [prepareNuxt],
            setupFiles: [consoleGuard],
            coverage: {
                provider: "v8",
                include: [
                    "src/**/*.ts",
                    "lib/**/*.ts",
                    "app/**/*.ts",
                    "app/**/*.vue",
                    "server/**/*.ts",
                    "shared/**/*.ts",
                    "modules/**/*.ts",
                    "tools/**/*.ts",
                ],
                exclude: [
                    ...coverageConfigDefaults.exclude,
                    "dist/**/*",
                    ".nuxt/**/*",
                    ".report/**/*",
                    "coverage/**/*",
                    "**/*.config.ts",
                    "**/*.stories.ts",
                ],
                reporter: ["text", "html", "clover", "json", "json-summary", "lcov"],
                thresholds: gated(thresholds),
            },
        },
        plugins: [],
    });

export default createNodeConfig;
