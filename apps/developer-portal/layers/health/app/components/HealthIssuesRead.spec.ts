import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import HealthIssuesRead from "./HealthIssuesRead.vue";

describe("HealthIssuesRead", () => {
    it("says GitHub hasn't been read before the first answer", async () => {
        const wrapper = await mountSuspended(HealthIssuesRead, {
            props: { fetchedAt: "", reloading: false },
        });

        expect(wrapper.text()).toContain("not read yet");
    });

    it("asks for a re-read on the refresh button", async () => {
        const wrapper = await mountSuspended(HealthIssuesRead, {
            props: { fetchedAt: new Date().toISOString(), reloading: false },
        });

        await wrapper.find("button").trigger("click");

        expect(wrapper.emitted("refresh")).toHaveLength(1);
    });
});
