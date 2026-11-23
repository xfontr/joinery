import { vitest } from "@joinery/configs";

// A tracker ID in a local .env boots the cookie banner in every spec, and dotenv never overrides
// a var that is already set
process.env.NUXT_PUBLIC_TRACKERS_GOOGLE_ANALYTICS_ID = "";
// The same goes for the Faro collector, which a keypress in any spec would otherwise send to
process.env.NUXT_PUBLIC_OBSERVABILITY_URL = "";

export default vitest.createNuxtConfig({
    root: import.meta.dirname,
    nodeSpecs: [
        "app/utils/coverHeight.spec.ts",
        "app/utils/initials.spec.ts",
        "layers/articles/app/utils/bylineAuthors.spec.ts",
        "layers/articles/app/utils/citationMeta.spec.ts",
        "layers/articles/app/utils/formatKeys.spec.ts",
        "layers/interest/app/{schemas,utils}/**/*.spec.ts",
        "layers/tracking/app/utils/consentTranslation.spec.ts",
    ],
    setupFiles: ["./vitest.setup.ts"],
    coverageExclude: ["**/app/pages/**", "**/__mocks__/**"],
    thresholds: { lines: 97, statements: 97, functions: 95, branches: 93 },
});
