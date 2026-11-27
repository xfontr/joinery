import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TASK_COLUMNS, toLine, type TaskRow, type UsageRow } from "../domain/usage.ts";

const repo = vi.hoisted(() => ({ root: "", fail: false, branch: "" }));

vi.mock("./git.ts", async () => {
    const { join: joinPath } = await import("node:path");
    const git = (...args: string[]): string => {
        if (repo.fail) throw new Error("not a git repository");
        return args[0] === "branch" ? repo.branch : joinPath(repo.root, ".git");
    };
    return { git, at: (...parts: string[]) => joinPath(repo.root, ...parts) };
});

import { appendTasks, appendUsage, currentBranch, projectNames, usageBufferPath } from "./usage.ts";

const ROW = {
    at: "2026-11-19T10:00:00.000Z",
    script: "workflow",
    command: "sync",
    target: "",
    flags: "",
    area: "repo",
    caller: "human",
    exit: "0",
    outcome: "ok",
    error: "",
    ms: "120",
} satisfies UsageRow;

beforeEach(() => {
    repo.root = mkdtempSync(join(tmpdir(), "usage-"));
    repo.fail = false;
    repo.branch = "";
});

afterEach(() => rmSync(repo.root, { recursive: true, force: true }));

describe("appendUsage", () => {
    it("appends each run to one buffer inside the common git dir, creating it on first use", () => {
        appendUsage(ROW);
        appendUsage({ ...ROW, exit: "1" });

        expect(usageBufferPath()).toBe(join(repo.root, ".git", "telemetry", "scripts.csv"));
        expect(readFileSync(usageBufferPath(), "utf8")).toBe(
            `${toLine(ROW)}\n${toLine({ ...ROW, exit: "1" })}\n`,
        );
    });

    it("never breaks the script it records when there is no checkout to write into", () => {
        repo.fail = true;

        expect(() => appendUsage(ROW)).not.toThrow();
    });
});

describe("appendTasks", () => {
    const TASK = {
        at: "2026-11-27",
        run: "a1b2c3d4",
        trigger: "check",
        hook: "",
        caller: "human",
        area: "repo",
        project: "scripts",
        target: "test",
        cache: "miss",
        exit: "0",
        ms: "8205",
        load: "0.42",
    } satisfies TaskRow;

    it("buffers task rows apart from script runs, in the task columns' order", () => {
        appendTasks([TASK, { ...TASK, target: "typecheck" }]);

        expect(readFileSync(usageBufferPath("tasks"), "utf8").split("\n")).toEqual([
            TASK_COLUMNS.map((column) => TASK[column]).join(","),
            TASK_COLUMNS.map((column) => ({ ...TASK, target: "typecheck" })[column]).join(","),
            "",
        ]);
    });
});

describe("currentBranch", () => {
    it("reads the checked-out branch", () => {
        repo.branch = "feature/repo/12-thing";

        expect(currentBranch()).toBe("feature/repo/12-thing");
    });

    it("reads as no branch outside a checkout instead of throwing", () => {
        repo.fail = true;

        expect(currentBranch()).toBe("");
    });
});

describe("projectNames", () => {
    it("names every project folder under the workspace roots and skips loose files", () => {
        for (const root of ["packages", "apps", "infrastructure"]) {
            mkdirSync(join(repo.root, root));
        }
        mkdirSync(join(repo.root, "packages", "configs"));
        mkdirSync(join(repo.root, "apps", "developer-portal"));
        writeFileSync(join(repo.root, "apps", "README.md"), "");

        expect(projectNames()).toEqual(new Set(["configs", "developer-portal"]));
    });

    it("is empty when the workspace roots are missing rather than throwing", () => {
        expect(projectNames()).toEqual(new Set());
    });
});
