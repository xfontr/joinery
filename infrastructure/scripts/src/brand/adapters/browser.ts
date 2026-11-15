/// <reference lib="dom" />
import { chromium } from "@playwright/test";
import type { Sample } from "../domain/brand.ts";

export interface PageSamples {
    url: string;
    status: number;
    samples: Sample[];
}

const VIEWPORT = { width: 1280, height: 800 };

/** Runs in the page, so it can reference nothing from this module. */
const readPage = (): Sample[] => {
    const LINKS = "a, button, [role=button], input[type=submit]";

    return [...document.querySelectorAll<HTMLElement>("html, body, body *")].flatMap((element) => {
        const style = getComputedStyle(element);
        const box = element.getBoundingClientRect();
        const hidden =
            style.display === "none" ||
            style.visibility === "hidden" ||
            Number(style.opacity) === 0 ||
            box.width === 0 ||
            box.height === 0;
        if (hidden) return [];

        const textChars = [...element.childNodes]
            .filter((child) => child.nodeType === Node.TEXT_NODE)
            .reduce((sum, child) => sum + (child.textContent ?? "").trim().length, 0);

        return [
            {
                tag: element.tagName.toLowerCase(),
                isLink: element.matches(LINKS),
                isHeading: /^h[1-6]$/i.test(element.tagName),
                color: style.color,
                background: style.backgroundColor,
                fontFamily: style.fontFamily,
                fontSize: style.fontSize,
                lineHeight: style.lineHeight,
                fontWeight: style.fontWeight,
                radius: style.borderTopLeftRadius,
                area: box.width * box.height,
                textChars,
            },
        ];
    });
};

/** Every visible element's computed style on each page, read in a headless Chromium at 1280 px. */
export const sampleStyles = async (urls: string[]): Promise<PageSamples[]> => {
    const browser = await chromium.launch();

    try {
        return await Promise.all(
            urls.map(async (url) => {
                const page = await browser.newPage({ viewport: VIEWPORT });
                const response = await page.goto(url, { waitUntil: "networkidle" });
                const status = response?.status() ?? 0;
                const ok = status >= 200 && status < 300;
                return { url, status, samples: ok ? await page.evaluate(readPage) : [] };
            }),
        );
    } finally {
        await browser.close();
    }
};
