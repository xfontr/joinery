import { vitest } from "@joinery/configs";

export default vitest.createNuxtConfig({
    root: import.meta.dirname,
    nodeSpecs: ["app/utils/**/*.spec.ts", "layers/*/app/utils/**/*.spec.ts"],
    setupFiles: ["./vitest.setup.ts"],
    thresholds: { lines: 89, statements: 88, functions: 85, branches: 80 },
});
