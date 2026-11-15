import AxeBuilder from "@axe-core/playwright";
import { expect, NOT_FOUND_DOCUMENT, test } from "@monorepo/configs/playwright/test";

const WCAG_AA = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

test("serves the home page with its heading and no WCAG 2.1 AA violation", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Marina Roustan");

    const { violations } = await new AxeBuilder({ page }).withTags(WCAG_AA).analyze();

    expect(violations).toEqual([]);
});

test.describe("an unknown path", () => {
    test.use({ allowedConsole: [NOT_FOUND_DOCUMENT] });

    test("answers an unknown path with a real 404", async ({ page }) => {
        const response = await page.goto("/no-existe/");

        expect(response?.status()).toBe(404);
    });
});
