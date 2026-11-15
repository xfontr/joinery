import { vitest } from "@monorepo/configs";

export default vitest.createNuxtConfig({
    root: import.meta.dirname,
    coverageExclude: ["**/app/pages/**"],
});
