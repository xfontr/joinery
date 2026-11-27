import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { parse } from "../shared/domain/cli.ts";
import { CancelledError } from "../shared/errors.ts";

const prompts = vi.hoisted(() => ({
    autocomplete: vi.fn(),
    confirm: vi.fn(),
    select: vi.fn(),
    text: vi.fn(),
}));
const state = vi.hoisted(() => ({ cancel: Symbol("cancel") }));
const gh = vi.hoisted(() => ({
    assignToMe: vi.fn(),
    blockedBy: vi.fn(),
    developBranch: vi.fn(),
    isOnline: vi.fn(),
    listIssues: vi.fn(),
    listProjects: vi.fn(),
    moveToInProgress: vi.fn(),
    viewThread: vi.fn(),
}));
const git = vi.hoisted(() => ({ branchForIssue: vi.fn(), checkout: vi.fn() }));
vi.mock("@clack/prompts", () => prompts);
vi.mock("./adapters/gh.ts", () => gh);
vi.mock("./adapters/git.ts", () => git);
vi.mock("../shared/adapters/io.ts");
vi.mock("../shared/adapters/prompts.ts", () => ({
    orExit: (value: unknown, message: string) => {
        if (value === state.cancel) throw new CancelledError(message);
        return value;
    },
}));

import { pick } from "./pick.ts";
import * as ioModule from "../shared/adapters/io.ts";

const io = vi.mocked(ioModule, true);

const PROJECT = { title: "Roadmap", number: 7, url: "project" };
const OTHER = { title: "Archive", number: 8, url: "archive" };
const ISSUE = {
    number: 42,
    title: "Fix picker",
    url: "issue",
    labels: ["bug", "app:huella-legal"],
};
const originalExitCode = process.exitCode;

beforeEach(() => {
    vi.resetAllMocks();
    process.exitCode = undefined;
    gh.listProjects.mockReturnValue([PROJECT, OTHER]);
    gh.isOnline.mockReturnValue(true);
    gh.listIssues.mockReturnValue([ISSUE]);
    prompts.select.mockResolvedValueOnce("Roadmap").mockResolvedValueOnce("feature");
    prompts.autocomplete.mockResolvedValue(ISSUE);
    prompts.text.mockResolvedValue("Fix picker");
    prompts.confirm.mockResolvedValue(true);
    git.branchForIssue.mockReturnValue(undefined);
    gh.blockedBy.mockReturnValue([]);
});

afterEach(() => {
    process.exitCode = originalExitCode;
});

describe("issue pick", () => {
    it("selects a live issue, creates its linked branch, assigns it and moves it on the board", async () => {
        await pick();

        expect(gh.developBranch).toHaveBeenCalledWith(42, "feature/huella-legal/42-fix-picker");
        expect(gh.assignToMe).toHaveBeenCalledWith(42);
        expect(gh.moveToInProgress).toHaveBeenCalledWith(PROJECT, ISSUE);
        expect(io.out.end).toHaveBeenCalledWith("feature/huella-legal/42-fix-picker");
    });

    it("uses cached projects and issues when gh is offline", async () => {
        gh.listProjects.mockReturnValueOnce([]).mockReturnValueOnce([PROJECT, OTHER]);
        gh.isOnline.mockReturnValue(false);

        await pick();

        expect(gh.listProjects).toHaveBeenCalledWith(true);
        expect(gh.listIssues).toHaveBeenCalledWith("Roadmap", true);
        expect(io.out.warn).toHaveBeenCalledWith(expect.stringContaining("cached"));
    });

    it("turns an online issue lookup failure into the scope guidance", async () => {
        gh.listIssues.mockImplementation(() => {
            throw new Error("unauthorized");
        });

        await expect(pick()).rejects.toThrow("`project` scope");
    });

    it("returns without prompts when neither live nor cached projects exist", async () => {
        gh.listProjects.mockReturnValue([]);
        gh.isOnline.mockReturnValue(false);

        await pick();

        expect(prompts.select).not.toHaveBeenCalled();
    });

    it("checks out and resumes an existing branch, with assignment and board failures only warning", async () => {
        git.branchForIssue.mockReturnValue("feature/roadmap/42-existing");
        gh.assignToMe.mockImplementation(() => {
            throw new Error("assignment");
        });
        gh.moveToInProgress.mockImplementation(() => {
            throw new Error("board");
        });

        await pick();

        expect(git.checkout).toHaveBeenCalledWith("feature/roadmap/42-existing");
        expect(gh.developBranch).not.toHaveBeenCalled();
        expect(io.out.warn).toHaveBeenCalledTimes(2);
    });
});

describe("issue pick <number>", () => {
    const THREAD = {
        ...ISSUE,
        state: "OPEN",
        body: "",
        assignees: [],
        comments: [],
        boards: [{ title: "Roadmap", status: "Todo" }],
    };
    const args = (...argv: string[]) => parse(argv);

    beforeEach(() => {
        gh.viewThread.mockReturnValue(THREAD);
    });

    it("branches, assigns and moves the issue without a single prompt", async () => {
        await pick(args("42"));

        expect(gh.developBranch).toHaveBeenCalledWith(42, "fix/huella-legal/42-fix-picker");
        expect(gh.assignToMe).toHaveBeenCalledWith(42);
        expect(gh.moveToInProgress).toHaveBeenCalledWith(PROJECT, ISSUE);
        expect(io.requireTerminal).not.toHaveBeenCalled();
        expect(prompts.select).not.toHaveBeenCalled();
    });

    it("refuses to branch off an issue whose blocker is still open, naming the blocker", async () => {
        gh.blockedBy.mockReturnValue([
            { number: 40, title: "Approve design", state: "OPEN" },
            { number: 41, title: "Old spike", state: "CLOSED" },
        ]);

        await expect(pick(args("42"))).rejects.toThrow(
            "#42 is blocked by #40 Approve design. Take one of those first, or pass --force.",
        );
        expect(gh.developBranch).not.toHaveBeenCalled();
    });

    it("branches off a blocked issue when --force says so, without asking GitHub", async () => {
        gh.blockedBy.mockReturnValue([{ number: 40, title: "Approve design", state: "OPEN" }]);

        await pick(args("42", "--force"));

        expect(gh.blockedBy).not.toHaveBeenCalled();
        expect(gh.developBranch).toHaveBeenCalledWith(42, "fix/huella-legal/42-fix-picker");
    });

    it("resumes an existing branch on a blocked issue, since the work already started", async () => {
        git.branchForIssue.mockReturnValue("fix/huella-legal/42-fix-picker");
        gh.blockedBy.mockReturnValue([{ number: 40, title: "Approve design", state: "OPEN" }]);

        await pick(args("42"));

        expect(git.checkout).toHaveBeenCalledWith("fix/huella-legal/42-fix-picker");
        expect(gh.blockedBy).not.toHaveBeenCalled();
    });

    it("lets the flags override the label, the board and the branch title", async () => {
        const dx = { ...PROJECT, title: "DX" };
        gh.listProjects.mockReturnValue([dx]);

        await pick(args("#42", "--type=hotfix", "--project=DX", "--title=Short"));

        expect(gh.developBranch).toHaveBeenCalledWith(42, "hotfix/huella-legal/42-short");
        expect(gh.moveToInProgress).toHaveBeenCalledWith(dx, ISSUE);
    });

    it("branches an issue with no area label under repo, so cross-cutting work stays pickable", async () => {
        gh.viewThread.mockReturnValue({ ...THREAD, labels: ["bug"] });

        await pick(args("42"));

        expect(gh.developBranch).toHaveBeenCalledWith(42, "fix/repo/42-fix-picker");
    });

    it("refuses to guess a branch type for a spike, and names the flag that settles it", async () => {
        gh.viewThread.mockReturnValue({ ...THREAD, labels: ["spike"] });

        await expect(pick(args("42"))).rejects.toThrow("--type=<feature|fix|hotfix|release>");
        expect(gh.developBranch).not.toHaveBeenCalled();
    });

    it("names the valid types when --type is misspelt, rather than blaming the label", async () => {
        await expect(pick(args("42", "--type=feat"))).rejects.toThrow(
            '"feat" isn\'t a branch type',
        );
        expect(gh.developBranch).not.toHaveBeenCalled();
    });

    it("refuses a title that slugs to nothing, which would leave the branch name without one", async () => {
        await expect(pick(args("42", "--title=???"))).rejects.toThrow("--title=<branch title>");
        expect(gh.developBranch).not.toHaveBeenCalled();
    });

    it("rejects an argument that isn't an issue before calling gh", async () => {
        await expect(pick(args("feature"))).rejects.toThrow("isn't an issue number or URL");
        expect(gh.viewThread).not.toHaveBeenCalled();
    });

    it("still branches when --project names no open board, leaving the board column alone", async () => {
        await pick(args("42", "--project=Archived"));

        expect(gh.developBranch).toHaveBeenCalledWith(42, "fix/huella-legal/42-fix-picker");
        expect(gh.moveToInProgress).not.toHaveBeenCalled();
        expect(io.out.warn).toHaveBeenCalledWith(expect.stringContaining('"Archived"'));
    });

    it("checks out an existing branch for the issue instead of creating a second one", async () => {
        git.branchForIssue.mockReturnValue("feature/roadmap/42-old-name");

        await pick(args("42"));

        expect(git.checkout).toHaveBeenCalledWith("feature/roadmap/42-old-name");
        expect(gh.developBranch).not.toHaveBeenCalled();
    });
});

beforeEach(() => {
    io.out.spinner.mockReturnValue({ start: vi.fn(), stop: vi.fn(), message: vi.fn() });
});
