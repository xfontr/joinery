import { mergeConfig } from "vitest/config";
import createNodeConfig from "./src/vitest/node.ts";

export default mergeConfig(
    createNodeConfig({
        thresholds: { lines: 74, statements: 74, functions: 74, branches: 74 },
    }),
    // It needs a Nuxt app's test environment, so only the apps' specs ever run it
    { test: { coverage: { exclude: ["src/vitest/utils/nuxt.ts"] } } },
);
