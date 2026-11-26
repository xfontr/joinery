import { describe, expect, it } from "vitest";
import { assertAbsolutePaths, assertComplete, mergeReports } from "./merge.ts";

const fileCoverage = (path: string) => ({
    path,
    statementMap: {},
    fnMap: {},
    branchMap: {},
    s: {},
    f: {},
    b: {},
});

describe("assertComplete", () => {
    it("does not throw when every project has a report", () => {
        expect(() => assertComplete([{ name: "@joinery/ui", data: {} }])).not.toThrow();
    });

    it("names every project missing a report rather than stopping at the first", () => {
        expect(() =>
            assertComplete([
                { name: "@joinery/ui", data: undefined },
                { name: "@joinery/content", data: {} },
                { name: "@joinery/i18n", data: undefined },
            ]),
        ).toThrow(/@joinery\/ui.*@joinery\/i18n/s);
    });
});

describe("assertAbsolutePaths", () => {
    it("does not throw when every key is an absolute path", () => {
        expect(() =>
            assertAbsolutePaths("@joinery/ui", {
                "/repo/packages/ui/lib/index.ts": fileCoverage("/repo/packages/ui/lib/index.ts"),
            }),
        ).not.toThrow();
    });

    it("throws naming the project when a key is a relative path", () => {
        expect(() =>
            assertAbsolutePaths("@joinery/ui", { "src/index.ts": fileCoverage("src/index.ts") }),
        ).toThrow(/@joinery\/ui.*src\/index\.ts/s);
    });
});

describe("mergeReports", () => {
    it("throws instead of merging when any project's report is missing", () => {
        expect(() => mergeReports([{ name: "@joinery/ui", data: undefined }])).toThrow(
            /@joinery\/ui/,
        );
    });

    it("combines file coverage from every project into one map", () => {
        const map = mergeReports([
            {
                name: "@joinery/ui",
                data: {
                    "/repo/packages/ui/lib/index.ts": fileCoverage(
                        "/repo/packages/ui/lib/index.ts",
                    ),
                },
            },
            {
                name: "@joinery/content",
                data: {
                    "/repo/packages/content/lib/index.ts": fileCoverage(
                        "/repo/packages/content/lib/index.ts",
                    ),
                },
            },
        ]);

        expect(map.files()).toEqual([
            "/repo/packages/ui/lib/index.ts",
            "/repo/packages/content/lib/index.ts",
        ]);
    });
});
