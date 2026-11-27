import type { Page } from "@playwright/test";
import { axeViolations } from "@joinery/configs/playwright/utils/a11y";
import { expect, test } from "@joinery/configs/playwright/utils/test";
import { t } from "./copy.ts";
import { FORMULA, GUIDE_HEADING } from "./fakes.ts";

const PATH = "/calculo-intereses/";

const TITLE = "Cálculo de intereses legales o judiciales devengados";

// A click before hydration submits the form natively and reloads the page, losing the result
const open = async (page: Page) => {
    const response = await page.goto(PATH);

    await expect
        .poll(() => page.locator("#__nuxt").evaluate((root) => "__vue_app__" in root))
        .toBe(true);

    return response;
};

// The hidden tab stays mounted to keep its fields, so every lookup is scoped to the visible one
const panel = (page: Page) => page.getByRole("tabpanel");

const fillYear = async (page: Page) => {
    await panel(page).getByLabel("Fecha inicial").fill("2026-01-01");
    await panel(page).getByLabel("Fecha final").fill("2027-01-01");
    await panel(page).getByLabel("Importe").fill("1000");
};

const fillAdvanced = async (page: Page, month: string) => {
    const from = panel(page).getByRole("group", { name: t("interestCalculator.from.label") });
    const to = panel(page).getByRole("group", { name: t("interestCalculator.to.label") });

    await from.getByLabel("Día").fill("7");
    await from.getByLabel("Mes").fill(month);
    await from.getByLabel("Año").fill("2017");
    await to.getByLabel("Día").fill("7");
    await to.getByLabel("Mes").fill(month);
    await to.getByLabel("Año").fill("2018");
    await panel(page).getByLabel("Importe").fill("300");
};

const calculate = (page: Page) =>
    panel(page)
        .getByRole("button", { name: t("interestCalculator.submit") })
        .click();

const advanced = (page: Page) =>
    page.getByRole("tab", { name: t("interestCalculator.tabs.advanced") }).click();

test("the calculator page answers 200 with its heading inside the shell", async ({ page }) => {
    const response = await open(page);

    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(TITLE);
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
    await expect(page).toHaveTitle(`${TITLE} - Huella Legal`);
});

test("renders the WordPress page's copy as the guide below the calculator", async ({ page }) => {
    await open(page);

    await expect(page.getByRole("heading", { level: 2, name: GUIDE_HEADING })).toBeVisible();
    await expect(
        page.getByRole("heading", { level: 3, name: "Cálculo de intereses avanzado" }),
    ).toBeVisible();
    await expect(page.getByText(FORMULA)).toBeVisible();
});

test("calculates the legal and judicial rates and announces each result", async ({ page }) => {
    await open(page);

    const result = panel(page).getByRole("status");

    await fillYear(page);
    await calculate(page);

    await expect(result).toContainText("365");
    await expect(result).toContainText(/32,50\s€/);
    await expect(result).toContainText(/1\.?032,50\s€/);

    await panel(page)
        .getByRole("radio", { name: /judicial/ })
        .check();

    await expect(result).not.toContainText(/32,50\s€/);

    await calculate(page);

    await expect(result).toContainText(/52,50\s€/);
});

test("adds calculations to a table that totals them and survives a reload", async ({ page }) => {
    await open(page);
    await advanced(page);

    const add = async () => {
        await calculate(page);
        await panel(page)
            .getByRole("button", { name: t("interestCalculator.result.add") })
            .click();
        await expect(page.getByText("Añadido a la tabla de cálculos.")).toBeFocused();
    };

    await fillAdvanced(page, "3");
    await add();

    for (const group of ["Fecha inicial", "Fecha final"]) {
        await panel(page).getByRole("group", { name: group }).getByLabel("Mes").fill("4");
    }
    await add();

    const table = page.getByRole("table", { name: t("interestCalculator.history.title") });

    await expect(table.locator("tbody tr")).toHaveCount(2);
    await expect(table.locator("tfoot")).toContainText(/19,50\s€/);

    await table.getByLabel("Concepto de la fila 1").fill("Pensión de marzo");
    await table.getByLabel("Concepto de la fila 1").press("Tab");

    await open(page);

    await expect(table.locator("tbody tr")).toHaveCount(2);
    await expect(table.getByLabel("Concepto de la fila 1")).toHaveValue("Pensión de marzo");

    await table.getByRole("button", { name: "Quitar la fila 2" }).click();

    await expect(table.locator("tbody tr")).toHaveCount(1);
});

test("the page fits the viewport without scrolling sideways, table included", async ({ page }) => {
    await open(page);
    await fillYear(page);
    await calculate(page);
    await panel(page)
        .getByRole("button", { name: t("interestCalculator.result.add") })
        .click();

    const overflow = await page
        .locator("html")
        .evaluate((html) => html.scrollWidth - html.clientWidth);

    expect(overflow).toBeLessThanOrEqual(0);
});

test("the calculator has no WCAG AA violations empty, with errors and with a table", async ({
    page,
}) => {
    await open(page);

    expect(await axeViolations(page)).toEqual([]);

    await calculate(page);
    await expect(panel(page).getByRole("alert")).toBeVisible();

    expect(await axeViolations(page)).toEqual([]);

    await advanced(page);
    await fillAdvanced(page, "3");
    await panel(page)
        .getByRole("radio", { name: t("interestCalculator.rate.options.custom") })
        .check();
    await panel(page).getByLabel("Tipo personalizado").fill("4");
    await calculate(page);
    await panel(page)
        .getByRole("button", { name: t("interestCalculator.result.add") })
        .click();
    await expect(page.getByRole("table")).toBeVisible();

    expect(await axeViolations(page)).toEqual([]);
});

test("records the page with a result at this width for review", async ({ page }, testInfo) => {
    await open(page);
    await fillYear(page);
    await calculate(page);
    await expect(panel(page).getByRole("status")).toContainText(/32,50\s€/);
    await panel(page)
        .getByRole("button", { name: t("interestCalculator.result.add") })
        .click();

    await testInfo.attach(`calculo-intereses-${testInfo.project.name}`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: "image/png",
    });
});

// The footer hydrates as it scrolls into view, so a pointer crossing it on the way down hovers links
test("hovering the footer's calculator link fetches nothing, unlike its neighbours", async ({
    page,
}) => {
    await page.goto("/");

    const footer = page.getByRole("contentinfo");
    const link = (name: string) => footer.getByRole("link", { name, exact: true });
    const requested: string[] = [];

    page.on("request", (request) => requested.push(new URL(request.url()).pathname));
    await footer.scrollIntoViewIfNeeded();

    // A neighbour's prefetch proves the footer has hydrated and is listening
    await expect(async () => {
        await page.mouse.move(0, 0);
        await link("Contacto").hover();
        expect(requested).toContain("/contacto/_payload.json");
    }).toPass();

    await link("Calculadora de intereses").hover();

    // Prefetches start in hover order, so once this one lands the calculator's would have too
    await link("Colaboradores").hover();
    await expect.poll(() => requested).toContain("/colaboradores/_payload.json");

    expect(requested.filter((path) => path.startsWith(PATH))).toEqual([]);
});
