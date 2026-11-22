import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import AuditsToolbar from "./AuditsToolbar.vue";

const MODELS = { search: "", state: "all", scope: "all", sort: "newest" } as const;

describe("AuditsToolbar", () => {
    it("reports a search typed in", async () => {
        const wrapper = await mountSuspended(AuditsToolbar, {
            props: { ...MODELS, scopes: ["packages/ui"] },
        });

        await wrapper.find("input").setValue("rail");

        expect(wrapper.emitted("update:search")).toEqual([["rail"]]);
    });

    it("offers every scope an audit covers, after one for all of them", async () => {
        const wrapper = await mountSuspended(AuditsToolbar, {
            props: { ...MODELS, scopes: ["packages/ui", "apps/blog"] },
        });

        const scope = wrapper.findAllComponents({ name: "USelect" })[1];
        expect(scope?.props("items")).toEqual([
            { label: "auditsToolbar.everyScope", value: "all" },
            { label: "packages/ui", value: "packages/ui" },
            { label: "apps/blog", value: "apps/blog" },
        ]);
    });
});
