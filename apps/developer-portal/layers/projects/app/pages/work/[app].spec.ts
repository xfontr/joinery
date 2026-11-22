import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { WORK } from "#layers/projects/shared/work.ts";
import Page from "./[app].vue";

const setStatus = vi.hoisted(() => vi.fn());
mockNuxtImport("setResponseStatus", () => setStatus);

beforeEach(() => {
    setStatus.mockClear();
});

describe("/work/<app>", () => {
    it.each(WORK.map((item) => [item.slug, item] as const))(
        "renders %s's screenshot, live link and decisions from its data",
        async (slug, item) => {
            const wrapper = await mountSuspended(Page, { route: `/work/${slug}` });

            const image = wrapper.get("img");
            expect(image.attributes("src")).toContain(item.screenshot.file.replace(".jpg", ""));
            expect(image.attributes("alt")).toBe(item.screenshot.alt);
            expect(wrapper.find(`a[href="${item.live.href}"]`).exists()).toBe(true);
            expect(
                item.decisions.map((decision) =>
                    wrapper.find(`a[href="/decisions/${decision.id}"]`).exists(),
                ),
            ).toEqual(item.decisions.map(() => true));
            expect(setStatus).not.toHaveBeenCalled();
        },
    );

    it("answers an unknown app with a 404 instead of an empty case page", async () => {
        const wrapper = await mountSuspended(Page, { route: "/work/not-an-app" });

        expect(setStatus).toHaveBeenCalledWith(404);
        expect(wrapper.find("img").exists()).toBe(false);
    });
});
