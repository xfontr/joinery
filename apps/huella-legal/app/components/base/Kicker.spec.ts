import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import Kicker from "./Kicker.vue";

describe("kicker", () => {
    it("renders a link only when given somewhere to go", async () => {
        const linked = await mountSuspended(Kicker, {
            props: { to: "/areas/penal" },
            slots: { default: () => "Derecho penal" },
        });
        const plain = await mountSuspended(Kicker, { slots: { default: () => "Derecho penal" } });

        expect(linked.find("a").attributes("href")).toBe("/areas/penal");
        expect(plain.find("a").exists()).toBe(false);
        expect(plain.text()).toBe("Derecho penal");
    });
});
