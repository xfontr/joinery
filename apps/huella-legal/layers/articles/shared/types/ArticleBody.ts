import type { Note } from "./Note";
import type { TocItem } from "./TocItem";

export interface ArticleBody {
    lead: string;
    html: string;
    toc: TocItem[];
    notes: Note[];
    bibliography: string[];
}
