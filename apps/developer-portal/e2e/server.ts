import { createServer } from "node:http";
import { recordServerConsole } from "@joinery/configs/playwright/setup/server";
import handler from "serve-handler";

recordServerConsole();

const BASE = "/portal/";

const options = {
    public: new URL("../.output/public", import.meta.url).pathname,
    cleanUrls: true,
    trailingSlash: false,
    directoryListing: false,
};

// Answers as Cloudflare Pages does once the personal site's deploy carries this build at `/portal/`
createServer((request, response) => {
    const url = request.url ?? "/";

    if (!url.startsWith(BASE)) {
        response.writeHead(302, { location: BASE }).end();
        return;
    }

    request.url = url.slice(BASE.length - 1);
    void handler(request, response, options);
}).listen(Number(process.env.PORT));
