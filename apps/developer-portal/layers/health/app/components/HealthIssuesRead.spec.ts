import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import HealthIssuesRead from "./HealthIssuesRead.vue";

const MESSAGES = {
    healthIssuesRead: {
        notRead: "not read yet",
        read: "read {age}",
        refresh: "Re-read the issues from GitHub",
    },
};

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

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
