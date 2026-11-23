import { axeViolations } from "@joinery/configs/playwright/utils/a11y";
import { expect, NOT_FOUND_DOCUMENT, test } from "@joinery/configs/playwright/utils/test";

test("serves the home page with its heading and no WCAG 2.1 AA violation", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Marina Roustan");

    expect(await axeViolations(page)).toEqual([]);
});

test.describe("an unknown path", () => {
    test.use({ allowedConsole: [NOT_FOUND_DOCUMENT] });

    test("answers an unknown path with a real 404", async ({ page }) => {
        const response = await page.goto("/no-existe/");

        expect(response?.status()).toBe(404);
    });
});
