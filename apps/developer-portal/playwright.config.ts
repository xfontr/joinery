import { playwright } from "@monorepo/configs";

export default playwright.createConfig({
    port: 4320,
    command: "node e2e/server.ts",
});
