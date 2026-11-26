import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import AboutQuote from "./Quote.vue";

const global = { mocks: { $t: (key: string) => `t(${key})` } };

describe("about quote", () => {
    it("marks the quote up as a blockquote credited in its caption", async () => {
        const wrapper = await mountSuspended(AboutQuote, { global });

        expect(wrapper.find("figure blockquote").text()).toBe("t(aboutQuote.text)");
        expect(wrapper.find("figure figcaption").text()).toContain("t(aboutQuote.author)");
    });
});
