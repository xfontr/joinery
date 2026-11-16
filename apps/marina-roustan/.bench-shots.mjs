import { chromium } from "@playwright/test";
const [out, ...urls] = process.argv.slice(2);
const browser = await chromium.launch();
await Promise.all(urls.map(async (url) => {
    const name = new URL(url).hostname.replace(/^www\./, "").split(".")[0];
    for (const width of [1280, 390]) {
        const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 800 } });
        try {
            await page.goto(url, { waitUntil: "load", timeout: 30000 });
            await page.waitForTimeout(2500);
            await page.screenshot({ path: `${out}/${name}-${width}-fold.png` });
            if (width === 1280) await page.screenshot({ path: `${out}/${name}-${width}-full.png`, fullPage: true });
            console.log("ok", name, width);
        } catch (e) { console.log("fail", name, width, e.message.split("\n")[0]); }
        await page.close();
    }
}));
await browser.close();
