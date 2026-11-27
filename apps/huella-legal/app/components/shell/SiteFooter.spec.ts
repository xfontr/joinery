import type { FooterColumn } from "@nuxt/ui";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import SiteFooter from "./SiteFooter.vue";

const translate = (key: string, params?: Record<string, unknown>) =>
    params ? `t(${key}, ${JSON.stringify(params)})` : `t(${key})`;

const COLUMNS: FooterColumn[] = [
    {
        label: "Legal",
        children: [
            { label: "Aviso legal", to: { name: "article", params: { slug: "aviso-legal" } } },
        ],
    },
];

const SOCIAL = [
    {
        key: "x",
        icon: "i-lucide-twitter",
        to: "https://x.test/huella",
        label: "X (se abre en una pestaña nueva)",
    },
];

const mountFooter = (social = SOCIAL) =>
    mountSuspended(SiteFooter, {
        props: { columns: COLUMNS, social, issn: "2696-7618" },
        global: { mocks: { $t: translate } },
    });

describe("site footer", () => {
    it("prints the ISSN and the current year beside the copyright", async () => {
        const wrapper = await mountFooter();

        expect(wrapper.text()).toContain(
            `t(app.footer.copyright, {"year":${new Date().getFullYear()},"issn":"2696-7618"})`,
        );
    });

    it("names each profile link with its new-tab warning, since the icon is all a sighted reader gets", async () => {
        const wrapper = await mountFooter();

        const links = wrapper
            .findAll("[aria-label='t(app.footer.social.label)'] a")
            .map((link) => [link.attributes("href"), link.attributes("aria-label")]);

        expect(links).toEqual([["https://x.test/huella", "X (se abre en una pestaña nueva)"]]);
    });

    it("links the source repository in a new tab even while no profile is configured", async () => {
        const wrapper = await mountFooter([]);

        const link = wrapper.find("a[aria-label='t(app.footer.repository)']");

        expect([link.attributes("href"), link.attributes("target")]).toEqual([
            "https://github.com/xfontr/joinery/tree/master/apps/huella-legal",
            "_blank",
        ]);
    });
});
