import type { H3Event } from "h3";
import { createError } from "h3";
import { defineCachedFunction, useRuntimeConfig } from "nitropack/runtime";
import { ofetch } from "ofetch";
import { OfetchHttpClient } from "#core/adapters/clients/OfetchHttpClient";
import { contentKey } from "#core/contentKey";
import type {
    Entry,
    EntryQuery,
    EntryResource,
    Page,
    Query,
    Resource,
    Term,
    TermResource,
} from "#core/domain/content";
import { ContentError, ContentUnavailableError } from "#core/domain/errors";
import type ContentProvider from "#core/ports/ContentProvider";
import type { VendorConfig } from "#core/registry";
import createProvider from "#core/registry";
import type { ContentConfig } from "#nuxt/config";
import { toEntryQuery, toQuery, toSlug } from "./query";

const readVendor = (event: H3Event): VendorConfig => {
    const { vendor } = useRuntimeConfig(event).content as ContentConfig;

    return vendor;
};

const { cache } = useRuntimeConfig().content as ContentConfig;

const rethrowAsHttpError = (cause: unknown): never => {
    if (cause instanceof ContentError) throw createError(cause);

    throw cause;
};

const resolveProvider = async (vendor: VendorConfig): Promise<ContentProvider> => {
    try {
        return await createProvider(
            vendor,
            new OfetchHttpClient(ofetch.create({ baseURL: vendor.baseURL })),
        );
    } catch (cause) {
        return rethrowAsHttpError(cause);
    }
};

const throwUnavailableError = (cause: unknown, resource: string): never => {
    if (cause instanceof ContentError) throw createError(cause);

    throw createError(new ContentUnavailableError(resource, cause));
};

type Window = keyof ContentConfig["cache"];

/** One cached reader per kind and shape, so each returns its own type rather than a union to cast. */
const cachedRead = <R extends Resource, A, T>(
    name: string,
    window: Window,
    read: (provider: ContentProvider, resource: R, arg: A) => Promise<T>,
    keyQuery: (arg: A) => EntryQuery,
) =>
    defineCachedFunction(
        async (event: H3Event, resource: R, arg: A): Promise<T> => {
            const provider = await resolveProvider(readVendor(event));

            return read(provider, resource, arg).catch((cause) =>
                throwUnavailableError(cause, resource),
            );
        },
        {
            name,
            group: "content",
            ...cache[window],
            getKey: (event, resource, arg) =>
                contentKey(readVendor(event), resource, keyQuery(arg)),
        },
    );

const readEntries = cachedRead(
    "content-entry-list",
    "list",
    (provider, resource: EntryResource, query: EntryQuery): Promise<Page<Entry>> =>
        provider.listEntries(resource, query),
    (query) => query,
);

const readTerms = cachedRead(
    "content-term-list",
    "list",
    (provider, resource: TermResource, query: Query): Promise<Page<Term>> =>
        provider.listTerms(resource, query),
    (query) => query,
);

const readEntry = cachedRead(
    "content-entry",
    "item",
    (provider, resource: EntryResource, slug: string): Promise<Entry> =>
        provider.getEntry(resource, slug),
    (slug) => ({ slug }),
);

const readTerm = cachedRead(
    "content-term",
    "item",
    (provider, resource: TermResource, slug: string): Promise<Term> =>
        provider.getTerm(resource, slug),
    (slug) => ({ slug }),
);

// Each read awaits, so a malformed argument rejects like a failed read instead of throwing
export const useContent = (event: H3Event) => ({
    listEntries: async (resource: EntryResource, query?: EntryQuery): Promise<Page<Entry>> =>
        await readEntries(event, resource, toEntryQuery(query)),

    listTerms: async (resource: TermResource, query?: Query): Promise<Page<Term>> =>
        await readTerms(event, resource, toQuery(query)),

    getEntry: async (resource: EntryResource, slug: string): Promise<Entry> =>
        await readEntry(event, resource, toSlug(slug)),

    getTerm: async (resource: TermResource, slug: string): Promise<Term> =>
        await readTerm(event, resource, toSlug(slug)),
});
