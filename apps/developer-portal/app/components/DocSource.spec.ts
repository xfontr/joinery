import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import DocSource from "./DocSource.vue";

describe("DocSource", () => {
    beforeEach(() => {
        useNuxtApp().$i18n.mergeLocaleMessage("en", {
            docSource: { meta: "{words} words, updated {updated}" },
        });
    });

    it("counts the doc's words beside its path", async () => {
        const wrapper = await mountSuspended(DocSource, {
            props: { source: "docs/a.md", words: 120, updatedAt: new Date().toISOString() },
        });

        expect(wrapper.text()).toContain("120 words");
        expect(wrapper.find("code").text()).toBe("docs/a.md");
    });

    it("shows only the path for a doc the snapshot doesn't know", async () => {
        const wrapper = await mountSuspended(DocSource, { props: { source: "docs/a.md" } });

        expect(wrapper.text()).toBe("docs/a.md");
    });
});
