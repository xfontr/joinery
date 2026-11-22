import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import DecisionsToolbar from "./DecisionsToolbar.vue";

describe("DecisionsToolbar", () => {
    it("reports a search typed in", async () => {
        const wrapper = await mountSuspended(DecisionsToolbar, {
            props: { search: "", status: "all", decision: "all", sort: "newest" },
        });

        await wrapper.find("input").setValue("0009");

        expect(wrapper.emitted("update:search")).toEqual([["0009"]]);
    });
});
