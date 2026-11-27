import { serveEndpoint } from "@joinery/configs/vitest/utils/nuxt";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FormReplyNotice from "./FormReplyNotice.vue";

const MESSAGES = { formReplyNotice: { description: "slower than usual", title: "slow" } };

beforeEach(() => {
    clearNuxtData();
    useNuxtApp().$i18n.mergeLocaleMessage("es-ES", MESSAGES);
});

describe("reply notice", () => {
    it("warns until the last slow day has passed", async () => {
        serveEndpoint("/api/replies", () => ({ slowUntil: "2026-08-31" }));

        const wrapper = await mountSuspended(FormReplyNotice);

        await vi.waitFor(() => expect(wrapper.text()).toContain("slower than usual"));
    });

    it("renders nothing at the usual pace, so the forms look as they always have", async () => {
        let asked = false;

        serveEndpoint("/api/replies", () => {
            asked = true;

            return {};
        });

        const wrapper = await mountSuspended(FormReplyNotice);

        await vi.waitFor(() => expect(asked).toBe(true));
        await flushPromises();
        expect(wrapper.text()).toBe("");
    });
});
