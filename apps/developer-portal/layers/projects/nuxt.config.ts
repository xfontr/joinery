import { readdirSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { parse } from "yaml";

const CONTENT = resolve(import.meta.dirname, "../../content/work");

const isCaseStudy = (file: string): boolean => {
    const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(
        readFileSync(resolve(CONTENT, file), "utf8"),
    );

    const { caseStudy } = parse(frontmatter?.[1] ?? "") as { caseStudy?: boolean };

    return caseStudy === true;
};

export default defineNuxtConfig({
    nitro: {
        prerender: {
            routes: readdirSync(CONTENT)
                .filter((file) => file.endsWith(".md") && isCaseStudy(file))
                .map((file) => `/work/${basename(file, ".md")}`),
        },
    },
});
