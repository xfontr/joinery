import { describe, expect, it } from "vitest";
import { manifestBans } from "./bans.ts";

const ids = (path: string, manifest: unknown, baseVersion?: string): string[] =>
    manifestBans({ path, manifest, baseVersion }).map((finding) => finding.id);

describe("manifestBans", () => {
    it.each(["postinstall", "prepare", "prepublish", "prepublishOnly", "preinstall"])(
        "blocks a %s script anywhere, since CI installs with --ignore-scripts",
        (script) => {
            expect(ids("apps/demo/package.json", { scripts: { [script]: "x" } })).toEqual([
                "lifecycle-script",
            ]);
            expect(ids("package.json", { scripts: { [script]: "x" } })).toEqual([
                "lifecycle-script",
            ]);
        },
    );

    it.each([
        { scripts: { build: "tsup" } },
        { main: "dist/index.js" },
        { types: "dist/index.d.ts" },
    ])("blocks a build step in a package: %j", (manifest) => {
        expect(ids("packages/demo/package.json", manifest)).toEqual(["package-build-step"]);
    });

    it("lets an app keep a build script, since apps are never consumed from source", () => {
        expect(ids("apps/demo/package.json", { scripts: { build: "nuxt build" } })).toEqual([]);
    });

    it("blocks a version that moved from the base, which only nx release may do", () => {
        const [finding] = manifestBans({
            path: "packages/demo/package.json",
            manifest: { version: "0.0.2" },
            baseVersion: "0.0.1",
        });

        expect(finding?.id).toBe("version-hand-edit");
        expect(finding?.detail).toContain("0.0.1 to 0.0.2");
    });

    it("skips the version check without a base, so a push to master after a release passes", () => {
        expect(ids("packages/demo/package.json", { version: "0.0.2" })).toEqual([]);
    });

    it("ignores a manifest that is not an object rather than throwing on it", () => {
        expect(ids("packages/demo/package.json", "not json")).toEqual([]);
    });
});
