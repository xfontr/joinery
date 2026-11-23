import { playwright } from "@monorepo/configs";

export default playwright.createConfig({
    port: 4330,
    command: "node e2e/server.ts",
});
