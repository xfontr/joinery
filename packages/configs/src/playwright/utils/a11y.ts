import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect } from "./test.ts";

const WCAG_AA = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

/** Fails on any WCAG 2.1 AA violation axe finds on the page as it stands, or inside `include`. */
export const expectNoAxeViolations = async (
    page: Page,
    { include }: { include?: string } = {},
): Promise<void> => {
    const scan = new AxeBuilder({ page }).withTags(WCAG_AA);
    const { violations } = await (include ? scan.include(include) : scan).analyze();

    expect(violations).toEqual([]);
};
