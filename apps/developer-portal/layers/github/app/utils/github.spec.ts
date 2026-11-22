import { describe, expect, it } from "vitest";
import { messageOf, repoApiUrl } from "./github.ts";

describe("repoApiUrl", () => {
    it("turns a repository URL into the requested REST resource", () => {
        expect(repoApiUrl("https://github.example/xfontr/monorepo", "issues")).toBe(
            "https://api.github.example/repos/xfontr/monorepo/issues",
        );
    });

    it("removes a clone URL's .git suffix", () => {
        expect(repoApiUrl("https://github.example/xfontr/monorepo.git", "deployments")).toBe(
            "https://api.github.example/repos/xfontr/monorepo/deployments",
        );
    });

    it("returns null for malformed URLs and paths without an owner and repo", () => {
        expect(repoApiUrl("not a url", "issues")).toBeNull();
        expect(repoApiUrl("https://github.example/xfontr", "issues")).toBeNull();
        expect(repoApiUrl("https://github.example/", "issues")).toBeNull();
    });

    it("uses the supplied resource instead of hard-coding an endpoint", () => {
        expect(repoApiUrl("https://github.example/xfontr/monorepo", "deployments")).toContain(
            "/deployments",
        );
    });
});

describe("messageOf", () => {
    it("prefers GitHub's own API message and caps it at three hundred characters", () => {
        expect(messageOf({ data: { message: "x".repeat(400) } }, "fallback")).toHaveLength(300);
    });

    it("falls back to the error's message when GitHub sent none", () => {
        expect(messageOf(new Error("ordinary failure"), "fallback")).toBe("ordinary failure");
    });

    it("uses the fallback for a rejection that carries no message at all", () => {
        expect(messageOf("unknown failure", "fallback")).toBe("fallback");
    });
});
