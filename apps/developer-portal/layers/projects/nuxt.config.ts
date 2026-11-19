import { WORK } from "./shared/work.ts";

export default defineNuxtConfig({
    // Listed rather than crawled, so each work page prerenders whether or not a page links to it.
    nitro: { prerender: { routes: WORK.map((item) => `/work/${item.slug}`) } },
});
