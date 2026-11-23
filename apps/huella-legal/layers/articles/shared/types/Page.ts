import type { SEO } from "@joinery/content";
import type { ArticleBody } from "./ArticleBody";

export interface Page {
    id: string;
    slug: string;
    title: string;
    body: ArticleBody;
    seo?: SEO;
    permalink: string;
}
