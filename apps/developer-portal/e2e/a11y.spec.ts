import { axeViolations } from "@joinery/configs/playwright/utils/a11y";
import { expect, test } from "@joinery/configs/playwright/utils/test";
import { NOT_FOUND } from "./copy.ts";

for (const colorScheme of ["light", "dark"] as const) {
    test.describe(() => {
        test.use({ allowedConsole: [NOT_FOUND] });

        test(`the 404 page in ${colorScheme} has no WCAG AA violations`, async ({ page }) => {
            await page.emulateMedia({ colorScheme });
            await page.goto("/no-such-page/");

            expect(await axeViolations(page)).toEqual([]);
        });
    });
}
