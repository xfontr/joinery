import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import HealthCoverageReport from "./HealthCoverageReport.vue";

describe("HealthCoverageReport", () => {
    it("embeds the copied report and links to it full size", async () => {
        const wrapper = await mountSuspended(HealthCoverageReport, { props: { copied: true } });

        const src = wrapper.find("iframe").attributes("src");
        expect(src).toMatch(/\/embed\/coverage\/index\.html$/);
        expect(wrapper.find("a").attributes("href")).toBe(src);
    });

    it("shows no frame until the collector has copied a report in", async () => {
        const wrapper = await mountSuspended(HealthCoverageReport, { props: { copied: false } });

        expect(wrapper.find("iframe").exists()).toBe(false);
    });
});
