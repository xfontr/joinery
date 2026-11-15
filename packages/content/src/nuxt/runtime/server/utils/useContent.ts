import type { H3Event } from "h3";
import { createError } from "h3";
import { defineCachedFunction, useRuntimeConfig } from "nitropack/runtime";
import { ofetch } from "ofetch";
import { OfetchHttpClient } from "#core/adapters/clients/OfetchHttpClient";
import { contentKey } from "#core/contentKey";
import type {
    EntryQuery,
    EntryResource,
    Query,
    Resource,
    TermResource,
} from "#core/domain/content";
import { ContentError, ContentUnavailableError } from "#core/domain/errors";
import type ContentProvider from "#core/ports/ContentProvider";
import type { VendorConfig } from "#core/registry";
import createProvider from "#core/registry";
import type { CacheWindow, ContentConfig } from "#nuxt/config";
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

const defineRead = <R extends Resource, A, T>(
    name: string,
    window: CacheWindow,
    read: (provider: ContentProvider, resource: R, argument: A) => Promise<T>,
    toKeyQuery: (argument: A) => EntryQuery,
) =>
    defineCachedFunction(
        async (event: H3Event, resource: R, argument: A): Promise<T> => {
            const provider = await resolveProvider(readVendor(event));

            return read(provider, resource, argument).catch((cause) =>
                throwUnavailableError(cause, resource),
            );
        },
        {
            name,
            group: "content",
            ...window,
            getKey: (event, resource, argument) =>
                contentKey(readVendor(event), resource, toKeyQuery(argument)),
        },
    );

const readEntries = defineRead(
    "content-entries",
    cache.list,
    (provider, resource: EntryResource, query: EntryQuery) => provider.listEntries(resource, query),
    (query) => query,
);

const readTerms = defineRead(
    "content-terms",
    cache.list,
    (provider, resource: TermResource, query: Query) => provider.listTerms(resource, query),
    (query) => query,
);

const readEntry = defineRead(
    "content-entry",
    cache.item,
    (provider, resource: EntryResource, slug: string) => provider.getEntry(resource, slug),
    (slug) => ({ slug }),
);

const readTerm = defineRead(
    "content-term",
    cache.item,
    (provider, resource: TermResource, slug: string) => provider.getTerm(resource, slug),
    (slug) => ({ slug }),
);

export const useContent = (event: H3Event) => ({
    listEntries: async (resource: EntryResource, query?: EntryQuery) =>
        await readEntries(event, resource, toEntryQuery(query)),

    listTerms: async (resource: TermResource, query?: Query) =>
        await readTerms(event, resource, toQuery(query)),

    getEntry: async (resource: EntryResource, slug: string) =>
        await readEntry(event, resource, toSlug(slug)),

    getTerm: async (resource: TermResource, slug: string) =>
        await readTerm(event, resource, toSlug(slug)),
});
