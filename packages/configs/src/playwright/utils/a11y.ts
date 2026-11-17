import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";

const WCAG_AA = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

/** Every WCAG 2.1 AA violation axe finds on the page as it stands, or inside `include`. */
export const axeViolations = async (page: Page, { include }: { include?: string } = {}) => {
    const scan = new AxeBuilder({ page }).withTags(WCAG_AA);
    const { violations } = await (include ? scan.include(include) : scan).analyze();

    return violations;
};
