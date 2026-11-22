import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import DirectoryIntro from "./Intro.vue";

const global = { mocks: { $t: (key: string) => `t(${key})` } };

describe("directory intro", () => {
    it("leads to publishing and to contact", async () => {
        const wrapper = await mountSuspended(DirectoryIntro, { props: { count: 3 }, global });

        expect(wrapper.findAll("a").map((link) => link.attributes("href"))).toEqual([
            "/publicar/",
            "/contacto/",
        ]);
    });
});
