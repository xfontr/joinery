import { vitest } from "@monorepo/configs";

// A tracker ID in a local .env boots the cookie banner in every spec, and dotenv never overrides
// a var that is already set
process.env.NUXT_PUBLIC_TRACKERS_GOOGLE_ANALYTICS_ID = "";

export default vitest.createNuxtConfig({
    root: import.meta.dirname,
    nodeSpecs: [
        "app/utils/coverHeight.spec.ts",
        "app/utils/initials.spec.ts",
        "layers/articles/app/utils/bylineAuthors.spec.ts",
        "layers/interest/app/{schemas,utils}/**/*.spec.ts",
        "layers/tracking/app/utils/consentTranslation.spec.ts",
    ],
    setupFiles: ["./vitest.setup.ts"],
    // None of these ship: Storybook mocks; Playwright covers pages
    coverageExclude: ["**/app/pages/**", "**/__mocks__/**"],
    thresholds: { lines: 90, statements: 90, functions: 85, branches: 80 },
});
