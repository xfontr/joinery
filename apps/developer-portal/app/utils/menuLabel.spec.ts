import { describe, expect, it } from "vitest";
import { menuLabel } from "./menuLabel.ts";

const t = (key: string) => `translated:${key}`;

describe("menuLabel", () => {
    it("resolves a key the route worded itself against the locale", () => {
        expect(menuLabel({ labelKey: "app.menu.newProject", to: "/x" }, t)).toBe(
            "translated:app.menu.newProject",
        );
    });

    it("leaves record data such as a project's name as it is", () => {
        expect(menuLabel({ label: "ui", to: "/projects/ui" }, t)).toBe("ui");
    });
});
