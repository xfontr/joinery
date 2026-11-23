import type { Page } from "@joinery/content";
import type { ArticleSummary } from "./ArticleSummary";
import type { Category } from "./Category";

export interface ArticleSearch extends Page<ArticleSummary> {
    query: string;
    subjects: Category[];
}
