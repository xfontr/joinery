import type {
    Entry,
    EntryQuery,
    EntryResource,
    Page,
    Query,
    Term,
    TermResource,
} from "#core/domain/content";
import { PageNotFoundError, UpstreamError } from "#core/domain/errors";
import ContentProvider from "#core/ports/ContentProvider";
import { API_PATH } from "./WordpressConfigs";
import { toEntry, toPage, toTerm, toWordpressQuery } from "./WordpressHelpers";
import type { WordpressEntry, WordpressTerm } from "./WordpressTypes";

const isPastLastPage = (cause: unknown): boolean =>
    cause instanceof UpstreamError &&
    (cause.body as { code?: unknown } | undefined)?.code === "rest_post_invalid_page_number";

const rethrowPastLastPage =
    (resource: string, page: number) =>
    (cause: unknown): never => {
        throw isPastLastPage(cause) ? new PageNotFoundError(resource, page) : cause;
    };

class WordpressProvider extends ContentProvider {
    override async listEntries(resource: EntryResource, query?: EntryQuery): Promise<Page<Entry>> {
        const response = await this.http
            .get<WordpressEntry[]>(`${API_PATH}/${resource}`, {
                query: {
                    ...toWordpressQuery(query),
                    ...(query?.term ? { [query.term.resource]: query.term.id } : {}),
                    author: query?.author,
                    _embed: "wp:featuredmedia,wp:term,author",
                },
            })
            .catch(rethrowPastLastPage(resource, query?.page ?? 1));

        return toPage(response, query, toEntry);
    }

    override async listTerms(resource: TermResource, query?: Query): Promise<Page<Term>> {
        const response = await this.http.get<WordpressTerm[]>(`${API_PATH}/${resource}`, {
            query: toWordpressQuery(query),
        });

        return toPage(response, query, (term) => toTerm(term, resource));
    }
}

export default WordpressProvider;
