import { expect, test } from "@monorepo/configs/playwright/utils/test";
import { t } from "./copy.ts";

test("the skip link is the first stop and moves focus into the main landmark", async ({ page }) => {
    await page.goto("/");

    await page.keyboard.press("Tab");

    const skip = page.getByRole("link", { name: t("app.skipLink") });

    await expect(skip).toBeFocused();
    // toBeVisible passes for a link the header paints over, so check it is the topmost element too
    expect(
        await skip.evaluate((link) => {
            const { x, y, width, height } = link.getBoundingClientRect();

            return link.ownerDocument.elementFromPoint(x + width / 2, y + height / 2) === link;
        }),
    ).toBe(true);

    await skip.press("Enter");

    await expect(page.getByRole("main")).toBeFocused();
});

test("the page states its language, so a screen reader reads it in English", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
