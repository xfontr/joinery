import { axeViolations } from "@joinery/configs/playwright/utils/a11y";
import { expect, NOT_FOUND_DOCUMENT, test } from "@joinery/configs/playwright/utils/test";

test("serves the prerendered home page with no WCAG 2.1 AA violation", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Alba Tomico");

    expect(await axeViolations(page)).toEqual([]);
});

test.describe("an unknown path", () => {
    test.use({ allowedConsole: [NOT_FOUND_DOCUMENT] });

    for (const path of ["/no-such-page/", "/no-such-page/deeper"]) {
        test(`answers ${path} with a 404 and the not-found page, linked home`, async ({ page }) => {
            const response = await page.goto(path);

            expect(response?.status()).toBe(404);
            await expect(page.getByRole("heading", { level: 1 })).toHaveText("404");
            await expect(page.getByText("The frame is empty")).toBeVisible();
            await expect(page.getByRole("link", { name: "[ Go back home ]" })).toHaveAttribute(
                "href",
                "/",
            );

            expect(await axeViolations(page)).toEqual([]);
        });
    }
});
