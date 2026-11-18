import { resolve } from "node:path";
import { DOC_ASSETS } from "./shared/docLinks.ts";

const WORKSPACE_ROOT = resolve(import.meta.dirname, "../../../..");

/** The docs folders whose images the wiki shows; anything else in the repo stays unpublished. */
const IMAGE_FOLDERS = ["docs/benchmarks/images"];

export default defineNuxtConfig({
    nitro: {
        publicAssets: IMAGE_FOLDERS.map((folder) => ({
            dir: resolve(WORKSPACE_ROOT, folder),
            baseURL: `${DOC_ASSETS}/${folder}`,
        })),
    },

    content: {
        build: {
            markdown: {
                // Keyed by an absolute path because `@nuxt/content` `import()`s the key verbatim,
                // resolving neither a Nuxt alias nor a path relative to itself.
                remarkPlugins: {
                    [resolve(import.meta.dirname, "../../tools/lib/remarkDocLinks.ts")]: {},
                },
            },
        },
    },
});
