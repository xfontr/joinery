import { playwright } from "@joinery/configs";

export default playwright.createConfig({
    port: 4340,
    command: "node --import ./e2e/server.ts .output/server/index.mjs",
    env: {
        NUXT_SITE_ENV: "production",
    },
});
