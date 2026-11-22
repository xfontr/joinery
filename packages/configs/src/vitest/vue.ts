import { mergeConfig } from "vitest/config";
import createNodeVitestConfig from "./node.ts";

const createVueConfig = (viteConfig: object) =>
    mergeConfig(
        viteConfig,
        mergeConfig(createNodeVitestConfig(), {
            test: {
                environment: "happy-dom",
                coverage: { include: ["src/**/*.vue", "lib/**/*.vue", "app/**/*.vue"] },
            },
        }),
    );

export default createVueConfig;
