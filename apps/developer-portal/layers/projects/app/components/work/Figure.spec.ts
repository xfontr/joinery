import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import { workFor } from "#layers/projects/shared/work.ts";
import Figure from "./Figure.vue";

// A real entry, so its screenshot file exists in the layer's assets.
const WORK_ITEM = workFor("huella-legal");

describe("WorkFigure", () => {
    it("shows the work's screenshot with its alt text and links to the live site", async () => {
        if (!WORK_ITEM) throw new Error("huella-legal is no longer in WORK");
        const wrapper = await mountSuspended(Figure, { props: { work: WORK_ITEM } });

        const image = wrapper.find("img");
        expect(image.attributes("src")).toBeTruthy();
        expect(image.attributes("alt")).toBe(WORK_ITEM.screenshot.alt);
        expect(wrapper.find("a").attributes("href")).toBe(WORK_ITEM.live.href);
    });
});
