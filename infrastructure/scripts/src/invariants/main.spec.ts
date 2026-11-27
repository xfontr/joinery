import { beforeEach, describe, expect, it, vi } from "vitest";

const files = vi.hoisted(() => ({
    readManifests: vi.fn(),
    readPackages: vi.fn(),
    readTableSources: vi.fn(),
    readNuxtSources: vi.fn(),
    readWorkflows: vi.fn(),
    projectRoots: vi.fn(),
}));
const git = vi.hoisted(() => ({ assertCommit: vi.fn(), manifestAt: vi.fn() }));

vi.mock("./adapters/files.ts", () => files);
vi.mock("./adapters/git.ts", () => git);
vi.mock("../shared/adapters/io.ts");

import { main } from "./main.ts";
import * as ioModule from "../shared/adapters/io.ts";

const io = vi.mocked(ioModule, true);

const args = (...flags: string[]) => ({ flags: new Set(flags), positionals: [] });

beforeEach(() => {
    vi.clearAllMocks();
    files.readManifests.mockReturnValue([
        { path: "packages/demo/package.json", manifest: { version: "0.0.2" } },
    ]);
    files.readPackages.mockReturnValue([]);
    files.readTableSources.mockReturnValue({ boundaries: "", readme: "" });
    files.readNuxtSources.mockReturnValue([]);
    files.readWorkflows.mockReturnValue([]);
    files.projectRoots.mockReturnValue([]);
    git.assertCommit.mockImplementation((ref: string) => ref);
    git.manifestAt.mockReturnValue({ version: "0.0.1" });
});

describe("invariants main", () => {
    it("passes a clean workspace without reading git when no base is given", () => {
        expect(() => main(args())).not.toThrow();
        expect(git.manifestAt).not.toHaveBeenCalled();
        expect(io.out.success).toHaveBeenCalledWith("Repo invariants hold.");
    });

    it("fails on a version moved since the base, the check only CI and the hook can run", () => {
        expect(() => main(args("base=HEAD"))).toThrow("found 1 violation(s)");
        expect(git.manifestAt).toHaveBeenCalledWith("HEAD", "packages/demo/package.json");
    });

    it("fails on a project missing from the README layout block", () => {
        files.projectRoots.mockReturnValue(["apps/ghost"]);

        expect(() => main(args())).toThrow("found 1 violation(s)");
        expect(io.out.error).toHaveBeenCalledWith(expect.stringContaining("ghost"));
    });
});
