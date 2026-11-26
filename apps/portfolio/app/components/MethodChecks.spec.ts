import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import MethodChecks from "./MethodChecks.vue";

beforeEach(() => {
    const { $i18n } = useNuxtApp();
    $i18n.mergeLocaleMessage($i18n.locale.value, {
        method: {
            prove: {
                checks: {
                    lint: { claimCount: "{count} rules" },
                    tests: { claimCount: "{count} specs" },
                },
            },
        },
    });
});

describe("MethodChecks", () => {
    it("rounds a collected count down to fifty, so the claim doesn't date by the week", async () => {
        const wrapper = await mountSuspended(MethodChecks, {
            props: { specs: 563, rules: { enabled: 589, inHouse: 8 } },
        });

        expect(wrapper.text()).toContain("550 specs");
        expect(wrapper.text()).toContain("550 rules");
    });

    it("states a count under fifty as it is, rather than rounding it to zero", async () => {
        const wrapper = await mountSuspended(MethodChecks, {
            props: { specs: 42, rules: { enabled: 2, inHouse: 1 } },
        });

        expect(wrapper.text()).toContain("42 specs");
        expect(wrapper.text()).toContain("2 rules");
    });

    it("falls back to the uncounted claims rather than stating zero", async () => {
        const wrapper = await mountSuspended(MethodChecks, { props: { specs: null, rules: null } });

        expect(wrapper.text()).toContain("method.prove.checks.tests.claim");
        expect(wrapper.text()).toContain("method.prove.checks.lint.claim");
        expect(wrapper.text()).not.toContain("specs");
    });

    it("links every check to where it can be seen", async () => {
        const wrapper = await mountSuspended(MethodChecks, { props: { specs: null, rules: null } });

        expect(wrapper.findAll("a").map((link) => link.attributes("href"))).toEqual(
            [
                "/coverage",
                "/wiki/packages/configs/readme",
                "/telemetry",
                "/wiki/infrastructure/scripts/src/invariants/readme",
                "/graph",
                "/wiki/packages/observability/readme",
            ].map(portalUrl),
        );
    });
});
