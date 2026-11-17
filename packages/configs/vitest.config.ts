import { configDefaults, mergeConfig } from "vitest/config";
import createNodeConfig from "./src/vitest/node.ts";

// Each case launches Playwright in a browser, so it runs in CI's e2e job, which ships one
const BROWSER_SPECS = ["src/playwright/utils/test.spec.ts"];

export default mergeConfig(
    createNodeConfig({
        thresholds: { lines: 74, statements: 74, functions: 74, branches: 74 },
    }),
    {
        test: {
            // It needs a Nuxt app's test environment, so only the apps' specs ever run it
            coverage: { exclude: ["src/vitest/utils/nuxt.ts"] },
            projects: [
                {
                    extends: true,
                    test: { name: "unit", exclude: [...configDefaults.exclude, ...BROWSER_SPECS] },
                },
                {
                    extends: true,
                    test: { name: "browser", include: BROWSER_SPECS, testTimeout: 60_000 },
                },
            ],
        },
    },
);
