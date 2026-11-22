import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import type { Issue } from "#layers/github/app/utils/issues.ts";
import HealthIssuesToolbar from "./HealthIssuesToolbar.vue";

const issue = (number: number, labels: string[]): Issue => ({
    number,
    title: "",
    body: "",
    url: "",
    labels,
    assignees: [],
    createdAt: "",
    updatedAt: "",
});

describe("HealthIssuesToolbar", () => {
    it("offers each label the live issues carry, once", async () => {
        const wrapper = await mountSuspended(HealthIssuesToolbar, {
            props: {
                search: "",
                label: "all",
                issues: [issue(1, ["bug", "ui"]), issue(2, ["bug"])],
            },
        });

        const items: { value: string }[] = wrapper
            .findComponent({ name: "USelect" })
            .props("items");
        expect(items.map((item) => item.value).toSorted()).toEqual(["all", "bug", "ui"]);
    });
});
