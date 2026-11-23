import type { Author as ContentAuthor, Entry, RichText, Term } from "@joinery/content";
import type { ArticleSummary } from "../../shared/types/ArticleSummary";
import type { Author } from "../../shared/types/Author";
import type { Category } from "../../shared/types/Category";
import { parseFragment, textContent } from "../utils/hast";

const WORDS_PER_MINUTE = 230;

const FORMAT_SLUGS = {
    thesisTag: "trabajos-de-fin-de-grado",
    caseCommentTagPrefix: "jurisprudencia-",
} as const;

export const isTopic = ({ slug }: Category): boolean => slug !== FORMAT_SLUGS.thesisTag;

const toFormat = (tagSlugs: string[]): ArticleSummary["format"] => {
    if (tagSlugs.includes(FORMAT_SLUGS.thesisTag)) return "tfg-tfm";
    if (tagSlugs.some((slug) => slug.startsWith(FORMAT_SLUGS.caseCommentTagPrefix)))
        return "comentario";

    return "articulo";
};

// An excerpt is the one field still HTML; this is display text, not sanitising
const toText = (html: string): string => textContent(parseFragment(html));

export const toCategory = (term: Term): Category => ({
    id: term.id,
    slug: term.slug,
    name: term.name,
    description: term.description,
});

const toAuthor = (author: ContentAuthor): Author => ({
    id: author.id,
    slug: author.slug,
    name: author.name,
    bio: author.bio,
    avatar: author.avatar,
});

const toReadingMinutes = (wordCount = 0): number =>
    Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));

const toExcerpt = (excerpt?: RichText): string | undefined => {
    if (!excerpt) return undefined;

    const text = toText(excerpt.value);

    return (text.endsWith("[…]") ? text.slice(0, -"[…]".length).trimEnd() : text) || undefined;
};

// ACF's `num`, entered by hand as NN/YY on the posts numbered before the year was written in full
const toNumber = (value: unknown): string | undefined => {
    const match =
        typeof value === "string" ? /^(\d{1,3})\/(\d{2}|\d{4})$/.exec(value.trim()) : null;
    if (!match) return undefined;

    const [, index = "", year = ""] = match;
    const fullYear = year.length === 2 ? `20${year}` : year;

    return `${index.padStart(2, "0")}/${fullYear}`;
};

export const toArticleSummary = (entry: Entry): ArticleSummary => {
    const categories = entry.terms.filter((term) => term.resource === "categories").map(toCategory);
    const tags = entry.terms.filter((term) => term.resource === "tags").map(toCategory);

    return {
        id: entry.id,
        slug: entry.slug,
        title: entry.title,
        excerpt: toExcerpt(entry.excerpt),
        publishedAt: entry.publishedAt,
        updatedAt: entry.updatedAt,
        image: entry.image,
        authors: entry.authors.map(toAuthor),
        category: categories[0],
        tags,
        format: toFormat(tags.map(({ slug }) => slug)),
        readingMinutes: toReadingMinutes(entry.wordCount),
        number: toNumber(entry.fields?.num),
        noindex: entry.seo?.noindex || undefined,
    };
};
