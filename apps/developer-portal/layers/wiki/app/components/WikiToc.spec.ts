import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import WikiToc from "./WikiToc.vue";

describe("WikiToc", () => {
    it("lists the page's headings", async () => {
        const wrapper = await mountSuspended(WikiToc, {
            props: { links: [{ id: "setup", text: "Setup", depth: 2 }] },
        });

        expect(wrapper.find("a[href='#setup']").exists()).toBe(true);
    });
});
