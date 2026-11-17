import { vitest } from "@monorepo/configs";

export default vitest.createNuxtConfig({
    root: import.meta.dirname,
    nodeSpecs: ["app/utils/**/*.spec.ts"],
    thresholds: { lines: 49, statements: 47, functions: 39, branches: 44 },
});
