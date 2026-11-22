import { WORK } from "./shared/work.ts";

export default defineNuxtConfig({
    nitro: { prerender: { routes: WORK.map((item) => `/work/${item.slug}`) } },
});
