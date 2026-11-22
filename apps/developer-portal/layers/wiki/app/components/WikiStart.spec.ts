import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import WikiStart from "./WikiStart.vue";

describe("WikiStart", () => {
    it("drops a wiki link whose doc is gone, and keeps the links to app pages", async () => {
        const wrapper = await mountSuspended(WikiStart, { props: { known: new Set(["/readme"]) } });

        const links = wrapper.findAll("a").map((link) => link.attributes("href"));
        expect(links).toContain("/wiki/readme");
        expect(links).toContain("/projects");
        expect(links).not.toContain("/wiki/docs/guides/first-hour");
    });

    it("drops a group left with no link", async () => {
        const wrapper = await mountSuspended(WikiStart, { props: { known: new Set<string>() } });

        expect(wrapper.findAll("h2")).toHaveLength(2);
    });
});
