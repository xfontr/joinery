import { beforeEach, describe, expect, it, vi } from "vitest";
import WordpressProvider from "./WordpressProvider";
import { PageNotFoundError, UpstreamError } from "#core/domain/errors";
import type { HttpClient } from "#core/ports/HttpClient";

const get = vi.fn();
const http: HttpClient = { get };

const POSTS_URL = "/wp-json/wp/v2/posts";

const entry = {
    id: 7,
    slug: "hello-world",
    title: { rendered: "Hello World" },
    content: { rendered: "<p>Body</p>" },
};

const respond = (data: unknown, headers: Record<string, string> = {}) => {
    get.mockResolvedValue({ data, headers: new Headers(headers) });
};

const build = () => new WordpressProvider({ baseURL: "https://wp.test" }, http);

beforeEach(() => {
    vi.clearAllMocks();
    respond([entry]);
});

describe("WordpressProvider", () => {
    describe("addressing the vendor", () => {
        it("asks the WordPress REST API for the resource, embedding media, terms and authors in one round trip", async () => {
            await build().listEntries("posts");

            expect(get).toHaveBeenCalledWith(POSTS_URL, {
                query: {
                    page: undefined,
                    per_page: 10,
                    slug: undefined,
                    search: undefined,
                    author: undefined,
                    _embed: "wp:featuredmedia,wp:term,author",
                },
            });
        });

        it("sends no _embed for terms, which have nothing to embed", async () => {
            respond([{ id: 3, name: "News", slug: "news", taxonomy: "category" }]);
            await build().listTerms("categories");

            expect(get).toHaveBeenCalledWith("/wp-json/wp/v2/categories", {
                query: { page: undefined, per_page: 10, slug: undefined, search: undefined },
            });
        });

        it.each([
            ["author id", { author: "12" }, { author: "12" }],
            [
                "the taxonomy the term names",
                { term: { resource: "categories", id: "12" } },
                { categories: "12" },
            ],
        ])("filters by %s", async (_, query, expected) => {
            await build().listEntries("posts", query as never);

            expect(get).toHaveBeenCalledWith(POSTS_URL, {
                query: expect.objectContaining(expected) as unknown,
            });
        });
    });

    it("returns a page built from the mapped response", async () => {
        respond([entry], { "x-wp-total": "12", "x-wp-totalpages": "2" });

        const result = await build().listEntries("posts", { page: 2, perPage: 6 });

        expect(result).toMatchObject({
            items: [expect.objectContaining({ id: "7", slug: "hello-world" })],
            page: 2,
            perPage: 6,
            total: 12,
            totalPages: 2,
        });
    });

    describe("a page past the end", () => {
        it("becomes a 404 rather than the 400 WordPress answers, so no app has to learn the quirk", async () => {
            get.mockRejectedValue(
                new UpstreamError(400, undefined, { code: "rest_post_invalid_page_number" }),
            );

            await expect(build().listEntries("posts", { page: 9 })).rejects.toBeInstanceOf(
                PageNotFoundError,
            );
        });

        it("leaves any other 400 as the upstream error it was", async () => {
            const refused = new UpstreamError(400, undefined, { code: "rest_invalid_param" });
            get.mockRejectedValue(refused);

            await expect(build().listEntries("posts")).rejects.toBe(refused);
        });
    });
});
