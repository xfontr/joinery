import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import RuleSection from "./RuleSection.vue";

beforeEach(() => {
    const { $i18n } = useNuxtApp();
    $i18n.mergeLocaleMessage($i18n.locale.value, {
        rules: { look: { body: "Body with {steps}" } },
    });
});

describe("RuleSection", () => {
    it("fills the body's values and links the rule's page only when it has one", async () => {
        const wrapper = await mountSuspended(RuleSection, {
            props: { id: "look", bodyParams: { steps: 6 }, to: "/agentic-workflows" },
        });
        const bare = await mountSuspended(RuleSection, { props: { id: "look" } });

        expect(wrapper.text()).toContain("Body with 6");
        expect(wrapper.find('a[href="/agentic-workflows"]').exists()).toBe(true);
        expect(bare.find("a").exists()).toBe(false);
    });
});
