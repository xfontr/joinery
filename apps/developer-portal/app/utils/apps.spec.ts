import { describe, expect, it } from "vitest";
import type { NavLink } from "../types/NavLink.ts";
import { appEntries, locate } from "./apps.ts";

const link = (to: string): NavLink => ({ icon: "i-lucide-circle", to });
const t = (key: string): string => key;

const NAV = {
    overview: link("/overview"),
    projects: link("/projects"),
    coverage: link("/coverage"),
    deps: link("/deps"),
};

describe("appEntries", () => {
    it("drops an entry no layer declares, and an app left with none", () => {
        const apps = appEntries(NAV, t);

        expect(apps.map((app) => [app.id, app.entries.map((entry) => entry.key)])).toEqual([
            ["home", ["overview"]],
            ["catalog", ["projects"]],
            ["health", ["coverage", "deps"]],
        ]);
    });
});

describe("locate", () => {
    const apps = appEntries(NAV, t);

    it("places a page under the entry whose route contains it", () => {
        expect(locate(apps, "/projects/scripts")?.entry.key).toBe("projects");
        expect(locate(apps, "/deps")?.app.id).toBe("health");
    });

    it("does not take a route that only shares a prefix, such as /projectsx", () => {
        expect(locate(apps, "/projectsx")).toBeNull();
    });
});
