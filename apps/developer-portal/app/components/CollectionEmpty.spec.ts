import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import CollectionEmpty from "./CollectionEmpty.vue";

const PROPS = { icon: "i-lucide-bookmark", folder: "docs/x/", skill: "x-skill", each: "one per x" };

const MESSAGES = {
    collectionEmpty: {
        collect: "collect {command}",
        nothing: "nothing {folder}",
        nothingCollected: "nothing collected {folder}",
        writes: "writes {skill} {each}{collect}",
    },
};

describe("CollectionEmpty", () => {
    beforeEach(() => {
        useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
    });

    it("names the folder and the skill that fills it", async () => {
        const text = (await mountSuspended(CollectionEmpty, { props: PROPS })).text();

        expect(text).toContain("docs/x/");
        expect(text).toContain("x-skill");
    });

    it("points at the collect step only for records the collector reads", async () => {
        const collected = await mountSuspended(CollectionEmpty, { props: PROPS });
        const direct = await mountSuspended(CollectionEmpty, {
            props: { ...PROPS, collected: false },
        });

        expect(collected.text()).toContain("nx collect");
        expect(direct.text()).not.toContain("nx collect");
    });
});
