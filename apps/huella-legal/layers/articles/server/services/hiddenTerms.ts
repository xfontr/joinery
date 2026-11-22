import type { ArticleSummary } from "../../shared/types/ArticleSummary";
import type { Category } from "../../shared/types/Category";

export const isHiddenTerm = ({ slug }: Pick<Category, "slug">): boolean =>
    useRuntimeConfig().articles.hiddenTerms.includes(slug);

/** Whether an article may appear in a listing, a search or a feed. */
export const isListed = ({ category, tags }: Pick<ArticleSummary, "category" | "tags">): boolean =>
    !(category && isHiddenTerm(category)) && !tags.some(isHiddenTerm);
