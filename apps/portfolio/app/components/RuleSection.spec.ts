import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import RuleSection from "./RuleSection.vue";

beforeEach(() => {
    const { $i18n } = useNuxtApp();
    $i18n.mergeLocaleMessage($i18n.locale.value, {
        rules: { look: { count: "{count} studied", body: "Body with {steps}" } },
    });
});

describe("RuleSection", () => {
    it("states what the rule produced only once there is something to count", async () => {
        const none = await mountSuspended(RuleSection, {
            props: { id: "look", number: 1, count: 0 },
        });
        const some = await mountSuspended(RuleSection, {
            props: { id: "look", number: 1, skill: "benchmark", count: 3 },
        });

        expect(none.text()).not.toContain("studied");
        expect(some.text()).toContain("3 studied");
        expect(some.find("code").text()).toBe("benchmark");
    });

    it("fills the body's values and links the rule's page only when it has one", async () => {
        const wrapper = await mountSuspended(RuleSection, {
            props: { id: "look", number: 1, bodyParams: { steps: 6 }, to: "/agentic-workflows" },
        });
        const bare = await mountSuspended(RuleSection, { props: { id: "look", number: 1 } });

        expect(wrapper.text()).toContain("Body with 6");
        expect(wrapper.find('a[href="/agentic-workflows"]').exists()).toBe(true);
        expect(bare.find("a").exists()).toBe(false);
    });
});
