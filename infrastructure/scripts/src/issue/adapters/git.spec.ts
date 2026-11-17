import { beforeEach, describe, expect, it, vi } from "vitest";

const gitApi = vi.hoisted(() => ({ git: vi.fn() }));
vi.mock("../../shared/adapters/git.ts", () => gitApi);

import { branchForIssue } from "./git.ts";

beforeEach(() => vi.clearAllMocks());

describe("issue git adapter", () => {
    it("finds the first branch whose final path segment starts with the issue number", () => {
        gitApi.git.mockReturnValue("main\nfeature/roadmap/42-fix\nother/42-not-at-root\n");

        expect(branchForIssue(42)).toBe("feature/roadmap/42-fix");
    });

    it("finds no branch when none is for the issue", () => {
        gitApi.git.mockReturnValue("main\nfeature/roadmap/41-fix\n");

        expect(branchForIssue(42)).toBeUndefined();
    });

    it("never takes another issue's branch whose number only starts the same way", () => {
        gitApi.git.mockReturnValue("main\nfeature/roadmap/41-fix\n");

        expect(branchForIssue(4)).toBeUndefined();
    });
});
