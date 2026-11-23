import { beforeEach, describe, expect, it, vi } from "vitest";

const exec = vi.hoisted(() => ({ run: vi.fn() }));
const gitApi = vi.hoisted(() => ({
    at: vi.fn((...parts: string[]) => `/repo/${parts.join("/")}`),
}));
vi.mock("../../shared/adapters/exec.ts", () => exec);
vi.mock("../../shared/adapters/git.ts", () => gitApi);

import { projectsWithDev } from "./nx.ts";

beforeEach(() => vi.clearAllMocks());

describe("projectsWithDev", () => {
    it("queries Nx once per supported project root and preserves the root that matched", () => {
        exec.run
            .mockReturnValueOnce(JSON.stringify(["@joinery/a"]))
            .mockReturnValueOnce(JSON.stringify(["@joinery/b"]))
            .mockReturnValueOnce("[]");

        expect(projectsWithDev()).toEqual([
            { root: "packages", name: "@joinery/a" },
            { root: "apps", name: "@joinery/b" },
        ]);
        expect(exec.run).toHaveBeenCalledWith("/repo/node_modules/.bin/nx", [
            "show",
            "projects",
            "--with-target",
            "dev",
            "--json",
            "--projects",
            "packages/*",
        ]);
    });
});
