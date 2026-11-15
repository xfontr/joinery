import type { RouteLocationRaw } from "vue-router";

export default defineAppConfig({
    nav: {
        publish: { name: "publish" },
        publishThesis: { name: "publish", hash: "#tesis" },
        publishGuide: { name: "article", params: { slug: "guia-de-publicaciones" } },
        collaboratorPortal: "/wp-admin/profile.php",
    } as const satisfies Record<string, RouteLocationRaw>,
});
