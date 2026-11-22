import { describe, expect, it } from "vitest";
import { changelogRoot, projectDisplayName } from "./changelogs.ts";

describe("changelogRoot", () => {
    it("keys a changelog by its project's root, whatever case the collection gave it", () => {
        expect(changelogRoot("/packages/ui/CHANGELOG")).toBe("packages/ui");
        expect(changelogRoot("/apps/huella-legal/changelog")).toBe("apps/huella-legal");
    });
});

describe("projectDisplayName", () => {
    it("names a project by its folder, not the area it lives under", () => {
        expect(projectDisplayName("packages/content")).toBe("Content");
    });
});
