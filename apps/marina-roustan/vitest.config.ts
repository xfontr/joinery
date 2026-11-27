import { vitest } from "@joinery/configs";

export default vitest.createNuxtConfig({
    root: import.meta.dirname,
    nodeSpecs: ["eslint.config.spec.ts"],
    coverageExclude: ["**/app/pages/**", "**/app/lab/**"],
    thresholds: { lines: 80, statements: 80, functions: 80, branches: 75 },
});
