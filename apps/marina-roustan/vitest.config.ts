import { vitest } from "@monorepo/configs";

export default vitest.createNuxtConfig({
    root: import.meta.dirname,
    nodeSpecs: ["eslint.config.spec.ts"],
    coverageExclude: ["**/app/pages/**"],
});
