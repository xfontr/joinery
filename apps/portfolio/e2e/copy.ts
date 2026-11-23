import { readFileSync } from "node:fs";
import { createT } from "@monorepo/configs/playwright/utils/i18n";
import { NOT_FOUND_DOCUMENT } from "@monorepo/configs/playwright/utils/test";

const MESSAGES = JSON.parse(
    readFileSync(new URL("../i18n/locales/en.json", import.meta.url), "utf8"),
) as Record<string, unknown>;

/** The app's copy by key, read from the same file the build bundles. */
export const t = createT(MESSAGES);

/** Every page the site serves, and so every page search engines may list. */
export const PAGES = [
    "/",
    "/about/",
    "/method/",
    "/agentic-workflows/",
    "/work/",
    "/work/huella-legal/",
    "/work/marina-roustan/",
];

/**
 * What a missing page logs: the 404 document, then the router's miss, reported as a boot error
 * because a static 404 boots the app from `404.html`. One pattern, since Playwright reads a second
 * `allowedConsole` entry as the fixture's options.
 */
export const NOT_FOUND = new RegExp(`${NOT_FOUND_DOCUMENT.source}|^\\[NUXT_E1005\\]`);
