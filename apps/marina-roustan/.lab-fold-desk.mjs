import { chromium } from "@playwright/test";
const [out, ...paths] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
for (const path of paths) {
    await page.goto(`http://localhost:3471${path}`, { waitUntil: "networkidle" });
    await page.screenshot({ path: `${out}/${path.replace(/^\/lab\//, "").replaceAll("/", "_")}-1280-fold.png` });
}
await browser.close();
