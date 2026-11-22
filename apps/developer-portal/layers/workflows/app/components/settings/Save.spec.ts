import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import Save from "./Save.vue";

describe("SettingsSave", () => {
    it("offers neither save nor discard with nothing changed", async () => {
        const wrapper = await mountSuspended(Save, { props: { changed: false } });

        expect(
            wrapper
                .findAll("button")
                .every((button) => button.attributes("disabled") !== undefined),
        ).toBe(true);
    });

    it("saves or discards a change on request", async () => {
        const wrapper = await mountSuspended(Save, { props: { changed: true } });
        const [discard, save] = wrapper.findAll("button");

        await save?.trigger("click");
        await discard?.trigger("click");

        expect(wrapper.emitted("save")).toHaveLength(1);
        expect(wrapper.emitted("discard")).toHaveLength(1);
    });
});
