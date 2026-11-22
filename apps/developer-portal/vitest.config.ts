import { vitest } from "@monorepo/configs";

export default vitest.createNuxtConfig({
    root: import.meta.dirname,
    nodeSpecs: ["app/utils/**/*.spec.ts", "layers/*/app/utils/**/*.spec.ts"],
    setupFiles: ["./vitest.setup.ts"],
    coverageExclude: ["**/app/lab/**", "**/app/pages/lab/**"],
    thresholds: { lines: 90, statements: 88, functions: 85, branches: 78 },
});
