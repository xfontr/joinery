import { playwright } from "@monorepo/configs";

export default playwright.createConfig({
    port: 4320,
    command: "node --import ./e2e/server.ts .output/server/index.mjs",
    env: {
        NUXT_PUBLIC_SITE_URL: "http://localhost:4320",
        NUXT_SITE_ENV: "production",
    },
});
