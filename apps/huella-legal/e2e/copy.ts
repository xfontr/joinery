import { readFileSync } from "node:fs";
import { createT } from "@joinery/configs/playwright/utils/i18n";

/** Every message the app renders, read from the same file the build bundles. */
export const MESSAGES = JSON.parse(
    readFileSync(new URL("../i18n/locales/es-ES.json", import.meta.url), "utf8"),
) as Record<string, unknown>;

/** The app's copy by key, so a spec names a control by what it is rather than how it is worded. */
export const t = createT(MESSAGES);
