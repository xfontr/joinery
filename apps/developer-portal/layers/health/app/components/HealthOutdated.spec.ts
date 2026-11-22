import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { OutdatedPackage } from "#layers/snapshot/shared/types/OutdatedPackage.ts";
import HealthOutdated from "./HealthOutdated.vue";

const OLD = {
    name: "left-pad",
    current: "1.0.0",
    wanted: "1.0.1",
    latest: "2.0.0",
    isDeprecated: false,
    dependents: ["packages/ui", "apps/blog"],
} satisfies OutdatedPackage;

describe("HealthOutdated", () => {
    it("lists every project that uses an outdated package", async () => {
        const wrapper = await mountSuspended(HealthOutdated, { props: { outdated: [OLD] } });

        expect(wrapper.find("tbody").text()).toContain("packages/ui, apps/blog");
    });

    it("tells an outdated check that never ran from one that found nothing", async () => {
        const never = await mountSuspended(HealthOutdated, { props: { outdated: null } });
        const clean = await mountSuspended(HealthOutdated, { props: { outdated: [] } });

        expect(never.text()).toContain("Not collected.");
        expect(clean.text()).not.toContain("Not collected.");
    });
});
