import { withSetup } from "@joinery/configs/vitest/utils/nuxt";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useRouter, type RouteLocationRaw } from "vue-router";
import { useSiteNav } from "./useSiteNav";

const MESSAGES = {
    app: {
        footer: {
            links: { cookieSettings: "cookie settings" },
            social: { external: "{network} (new tab)", instagram: "Instagram", x: "X" },
        },
    },
};

const cookies = vi.hoisted(() => ({ enabled: false, open: vi.fn() }));

const navAt = async (route: string) => {
    const { value } = await withSetup(
        () => {
            const nav = useSiteNav(cookies);
            const router = useRouter();

            return {
                nav,
                href: (to: RouteLocationRaw) =>
                    typeof to === "string" ? to : router.resolve(to).href,
            };
        },
        { route },
    );

    return Object.assign(value.nav, { href: value.href });
};

const currentOf = (nav: ReturnType<typeof useSiteNav>) =>
    nav.sections.value.map((item) => item["aria-current"]);

type Profiles = ReturnType<typeof useRuntimeConfig>["public"]["social"];

let configured: Profiles;

const setProfiles = (profiles: Profiles) => {
    useRuntimeConfig().public.social = profiles;
};

beforeEach(() => {
    configured = useRuntimeConfig().public.social;
    useNuxtApp().$i18n.mergeLocaleMessage("es-ES", MESSAGES);
    setProfiles({ instagram: "", linkedin: "", x: "" });
    cookies.enabled = false;
});

afterEach(() => {
    setProfiles(configured);
});

describe("useSiteNav", () => {
    it("marks the section being read as the current page, and nothing else", async () => {
        const nav = await navAt("/areas/");

        expect(currentOf(nav)).toEqual([undefined, "page", undefined, undefined]);
    });

    it("keeps a section current on its detail pages, without claiming to be that page", async () => {
        const nav = await navAt("/areas/derecho-civil/");

        expect(currentOf(nav)).toEqual([undefined, "true", undefined, undefined]);
    });

    it("still finds the section when the URL arrives without its trailing slash", async () => {
        const nav = await navAt("/areas");

        expect(currentOf(nav)).toEqual([undefined, "page", undefined, undefined]);
    });

    it("marks nothing current on a page outside the four sections", async () => {
        const nav = await navAt("/");

        expect(currentOf(nav)).toEqual([undefined, undefined, undefined, undefined]);
    });

    it("marks the journal current on the about page itself", async () => {
        const nav = await navAt("/sobre/");

        expect(currentOf(nav)).toEqual([undefined, undefined, "page", undefined]);
    });

    it("keeps the journal current on a collaborator's page, since the header reaches it through there", async () => {
        const nav = await navAt("/colaboradores/ana-perez/");

        expect(currentOf(nav)).toEqual([undefined, undefined, "true", undefined]);
        expect(nav.sections.value[2]?.children?.map((link) => link["aria-current"])).toEqual([
            undefined,
            "true",
            undefined,
        ]);
    });

    it("offers no cookie settings when no tracker is configured, since there is nothing to consent to", async () => {
        const nav = await navAt("/");

        expect(nav.columns.value.at(-1)?.children?.map(({ label }) => label)).not.toContain(
            "cookie settings",
        );
    });

    it("reopens the cookie preferences from the legal column once a tracker needs consent", async () => {
        cookies.enabled = true;

        const nav = await navAt("/");
        const settings = nav.columns.value
            .at(-1)
            ?.children?.find(({ label }) => label === "cookie settings");

        expect(settings).toMatchObject({ onClick: cookies.open });
    });

    it("links only the profiles that are set, each warning that it opens a new tab", async () => {
        setProfiles({
            instagram: "https://instagram.test/huella",
            linkedin: "",
            x: "https://x.test/huella",
        });

        const nav = await navAt("/");

        expect(nav.social.value.map(({ to, label }) => [to, label])).toEqual([
            ["https://instagram.test/huella", "Instagram (new tab)"],
            ["https://x.test/huella", "X (new tab)"],
        ]);
    });
});
