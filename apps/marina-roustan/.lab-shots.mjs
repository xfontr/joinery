import { chromium } from "@playwright/test";
const [out, ...paths] = process.argv.slice(2);
const browser = await chromium.launch();
for (const width of [390, 768, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    for (const path of paths) {
        await page.goto(`http://localhost:3471${path}`, { waitUntil: "networkidle" });
        const name = `${path.replace(/^\/lab\//, "").replaceAll("/", "_") || "index"}-${width}.png`;
        await page.screenshot({ path: `${out}/${name}`, fullPage: true });
        console.log(name);
    }
    await page.close();
}
await browser.close();
