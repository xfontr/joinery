import { vitest } from "@monorepo/configs";

export default vitest.createNuxtConfig({
    root: import.meta.dirname,
    nodeSpecs: ["eslint.config.spec.ts"],
    coverageExclude: ["**/app/pages/**", "**/app/lab/**"],
    thresholds: { lines: 90, statements: 90, functions: 85, branches: 80 },
});
