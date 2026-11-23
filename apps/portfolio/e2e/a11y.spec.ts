import { axeViolations } from "@monorepo/configs/playwright/utils/a11y";
import { expect, test } from "@monorepo/configs/playwright/utils/test";
import { NOT_FOUND, PAGES } from "./copy.ts";

for (const colorScheme of ["light", "dark"] as const) {
    for (const path of PAGES) {
        test(`${path} in ${colorScheme} has no WCAG AA violations`, async ({ page }) => {
            await page.emulateMedia({ colorScheme });
            await page.goto(path);

            expect(await axeViolations(page)).toEqual([]);
        });
    }

    test.describe(() => {
        test.use({ allowedConsole: [NOT_FOUND] });

        test(`the 404 page in ${colorScheme} has no WCAG AA violations`, async ({ page }) => {
            await page.emulateMedia({ colorScheme });
            await page.goto("/no-such-page/");

            expect(await axeViolations(page)).toEqual([]);
        });
    });
}
