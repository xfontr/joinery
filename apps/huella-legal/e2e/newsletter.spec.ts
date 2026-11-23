import { axeViolations } from "@joinery/configs/playwright/utils/a11y";
import { expect, test } from "@joinery/configs/playwright/utils/test";
import { t } from "./copy.ts";
import { ARTICLE, SUBJECT } from "./fakes.ts";
import { TURNSTILE_SCRIPT, TURNSTILE_SCRIPT_PATTERN } from "./vendors.ts";

test.beforeEach(async ({ page }) => {
    await page.route(TURNSTILE_SCRIPT_PATTERN, (route) =>
        route.fulfill({ contentType: "text/javascript", body: TURNSTILE_SCRIPT }),
    );
});

test("subscribes from the band under an article and asks the reader to confirm", async ({
    page,
}) => {
    await page.goto(`/${ARTICLE.slug}/`);

    const band = page.getByRole("region", { name: "Un correo al mes" });
    const confirmation = band.getByRole("heading", { name: t("newsletterForm.success.title") });

    // CI's runner can type before hydration, which a server-rendered form then drops on submit
    await expect(async () => {
        await band
            .getByRole("textbox", { name: t("newsletterForm.email.label") })
            .fill("lucia@ejemplo.test");
        await band.getByRole("button", { name: t("newsletterForm.submit") }).click();

        await expect(confirmation).toBeVisible({ timeout: 2000 });
    }).toPass();

    await expect(confirmation).toBeFocused();

    expect(await axeViolations(page)).toEqual([]);
});

test("tells a reader back from Kit's confirmation link that they are on the list", async ({
    page,
}) => {
    await page.goto("/suscripcion-confirmada/");

    await expect(
        page.getByRole("heading", { level: 1, name: t("newsletterConfirmed.title") }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: t("newsletterConfirmed.latest") })).toHaveAttribute(
        "href",
        "/publicaciones/",
    );

    expect(await axeViolations(page)).toEqual([]);
});

test("refuses an address with no domain without sending it", async ({ page }) => {
    let sent = false;

    page.on("request", (request) => {
        if (request.url().endsWith("/api/newsletter")) sent = true;
    });

    await page.goto(`/areas/${SUBJECT.slug}/`);

    const email = page.getByRole("textbox", { name: t("newsletterForm.email.label") });

    await expect(async () => {
        await email.fill("lucia@");
        await page.getByRole("button", { name: t("newsletterForm.submit") }).click();

        await expect(email).toHaveAttribute("aria-invalid", "true", { timeout: 500 });
    }).toPass();

    expect(sent).toBe(false);
});
