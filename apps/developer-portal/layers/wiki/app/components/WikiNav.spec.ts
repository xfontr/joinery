import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import WikiNav from "./WikiNav.vue";
import type { WikiSection } from "#layers/wiki/app/utils/wiki.ts";

const sections: WikiSection[] = [
    {
        id: "docs",
        label: "Docs",
        icon: "i-lucide-library",
        blurb: "Docs",
        groups: [
            {
                key: "guides",
                label: "Guides",
                entries: [
                    { path: "/docs/guides/readme", label: "Overview", kind: "doc" },
                    { path: "/docs/guides/first-hour", label: "First hour", kind: "doc" },
                ],
            },
            {
                key: "concepts",
                label: "Concepts",
                entries: [
                    { path: "/docs/concepts/readme", label: "Concepts", kind: "doc" },
                    { path: "/docs/concepts/boundaries", label: "Boundaries", kind: "doc" },
                ],
            },
            {
                key: "workflows",
                label: "Workflows",
                entries: [{ path: "/docs/workflows/readme", label: "Overview", kind: "doc" }],
            },
        ],
    },
];

describe("WikiNav", () => {
    it("opens only the group containing the current page and marks that entry selected", async () => {
        const wrapper = await mountSuspended(WikiNav, {
            props: { sections, current: "/docs/guides/first-hour" },
        });

        expect(wrapper.text()).toContain("First hour");
        expect(wrapper.find("a[href='/wiki/docs/concepts/readme']").exists()).toBe(false);
        expect(wrapper.find("a[href='/wiki/docs/guides/first-hour']").classes()).toContain(
            "bg-elevated",
        );
    });

    it("opens and closes a folded group while overview labels remain links", async () => {
        const wrapper = await mountSuspended(WikiNav, { props: { sections } });
        expect(wrapper.find("a[href='/wiki/docs/guides/first-hour']").exists()).toBe(false);
        expect(wrapper.find("a[href='/wiki/docs/guides/readme']").text()).toBe("Guides");

        const label = wrapper.findAll("button").find((button) => button.text() === "Concepts");
        await label!.trigger("click");
        expect(wrapper.find("a[href='/wiki/docs/concepts/readme']").exists()).toBe(true);
        await label!.trigger("click");
        expect(wrapper.find("a[href='/wiki/docs/concepts/readme']").exists()).toBe(false);
    });

    it("uses a non-overview group label as its toggle and follows current changes until toggled", async () => {
        const wrapper = await mountSuspended(WikiNav, {
            props: { sections, current: "/docs/concepts/readme" },
        });

        expect(wrapper.find("a[href='/wiki/docs/concepts/readme']").exists()).toBe(true);
        const label = wrapper.findAll("button").find((button) => button.text() === "Concepts");
        expect(label).toBeDefined();

        await wrapper.setProps({ current: "/docs/guides/first-hour" });
        expect(wrapper.text()).toContain("First hour");
        await label!.trigger("click");
        await wrapper.setProps({ current: "/docs/guides/readme" });
        expect(wrapper.text()).toContain("First hour");
    });

    it("links a group holding only its README straight to it, with nothing to unfold", async () => {
        const wrapper = await mountSuspended(WikiNav, { props: { sections } });

        expect(wrapper.find("a[href='/wiki/docs/workflows/readme']").text()).toBe("Workflows");
        expect(wrapper.findAll("button").map((button) => button.text())).not.toContain("Workflows");
        expect(wrapper.text()).not.toContain("Overview");
    });
});
