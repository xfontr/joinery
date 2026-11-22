import { createServer } from "node:http";
import { recordServerConsole } from "@monorepo/configs/playwright/setup/server";
import handler from "serve-handler";

recordServerConsole();

const options = {
    public: new URL("../.output/public", import.meta.url).pathname,
    cleanUrls: true,
    trailingSlash: true,
    directoryListing: false,
};

// Answers as GitHub Pages does: `/about` redirects to `/about/`, and a miss gets `404.html`
createServer((request, response) => {
    void handler(request, response, options);
}).listen(Number(process.env.PORT));
