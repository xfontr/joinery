import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import { describe, expect, it, vi } from "vitest";
import Layout from "./default.vue";

const useHead = vi.hoisted(() => vi.fn());

mockNuxtImport("useI18n", () => () => ({
    t: (key: string) => key,
    localeProperties: ref({ language: "es" }),
}));
mockNuxtImport("useHead", () => useHead);
mockNuxtImport("useSiteNav", () => () => ({
    sections: ref([]),
    columns: ref([]),
    social: ref([]),
}));
mockNuxtImport("useCookiePreferences", () => () => ({ enabled: false, open: vi.fn() }));

const global = {
    mocks: { $t: (key: string) => key },
    stubs: { ShellSiteHeader: true, ShellSiteFooter: true },
};

describe("default layout", () => {
    it("tags the document with the active locale and points feed readers at the RSS feed", () => {
        mount(Layout, { global });

        const [{ htmlAttrs, link }] = useHead.mock.calls[0] as [
            { htmlAttrs: { lang: () => string }; link: object[] },
        ];

        expect(htmlAttrs.lang()).toBe("es");
        expect(link).toContainEqual(
            expect.objectContaining({
                type: "application/rss+xml",
                href: "https://www.huellalegal.com/feed/",
            }),
        );
    });
});
