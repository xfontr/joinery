import type { Page } from "@playwright/test";
import { expect, test } from "@monorepo/configs/playwright/utils/test";
import { t } from "./copy.ts";

/** Whether the page set `data-page-transition` on `<html>` while `navigate` ran. */
const transitioned = async (page: Page, navigate: () => Promise<void>) => {
    await page.evaluate(() => {
        const seen = { value: false };
        Object.assign(window, { __transitioned: seen });
        new MutationObserver(() => {
            if (document.documentElement.dataset.pageTransition) seen.value = true;
        }).observe(document.documentElement, { attributeFilter: ["data-page-transition"] });
    });
    await navigate();

    return page.evaluate(
        () => (window as unknown as { __transitioned: { value: boolean } }).__transitioned.value,
    );
};

for (const [view, path] of [
    ["visitor", "/"],
    ["developer", "/overview/"],
] as const) {
    test(`the ${view} skip link is the first stop and moves focus into the main landmark`, async ({
        page,
    }) => {
        await page.goto(path);

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
}

/** Each element Tab lands on, in order, until focus leaves the page or `limit` stops. */
const tabStops = async (page: Page, limit = 40) => {
    const stops: { label: string; ringed: boolean }[] = [];

    for (let stop = 0; stop < limit; stop++) {
        await page.keyboard.press("Tab");

        const focused = await page.evaluate(() => {
            const element = document.activeElement;
            if (!element || element === document.body) return null;

            const { outlineStyle, outlineWidth } = getComputedStyle(element);

            return {
                label: element.outerHTML.slice(0, 80),
                ringed: outlineStyle !== "none" && outlineWidth !== "0px",
            };
        });

        if (!focused) break;
        stops.push(focused);
    }

    return stops;
};

test("every stop a keyboard reaches on the front page shows a focus ring", async ({ page }) => {
    await page.goto("/");

    const stops = await tabStops(page);

    expect(stops.length).toBeGreaterThan(5);
    expect(stops.filter(({ ringed }) => !ringed).map(({ label }) => label)).toEqual([]);
});

test("the page states its language, so a screen reader reads it in English", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("the header marks the section being read", async ({ page }) => {
    await page.goto("/method/");

    const nav = page.getByRole("navigation", { name: t("app.visitor.navLabel") });

    await expect(nav.getByRole("link", { name: t("app.visitor.nav.method") })).toHaveAttribute(
        "aria-current",
        "page",
    );
    await expect(nav.locator("[aria-current]")).toHaveCount(1);
});

test("a page change animates for a reader who allows motion", async ({ page }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: t("app.visitor.navLabel") });

    expect(
        await transitioned(page, async () => {
            await nav.getByRole("link", { name: t("app.visitor.nav.about") }).click();
            await expect(page).toHaveURL(/\/about\/?$/);
        }),
    ).toBe(true);
});

test("a page change stays still for a reader who asked for reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: t("app.visitor.navLabel") });

    expect(
        await transitioned(page, async () => {
            await nav.getByRole("link", { name: t("app.visitor.nav.about") }).click();
            await expect(page).toHaveURL(/\/about\/?$/);
        }),
    ).toBe(false);
});
