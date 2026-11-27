import { vitest } from "@joinery/configs";

export default vitest.createNuxtConfig({
    root: import.meta.dirname,
    nodeSpecs: ["app/utils/**/*.spec.ts"],
    setupFiles: ["./vitest.setup.ts"],
    thresholds: { lines: 88, statements: 87, functions: 88, branches: 80 },
});
