import { describe, expect, it } from "vitest";
import { COLUMNS, LOGS } from "../../shared/domain/usage.ts";
import { currentLine, upgradedLog } from "./rows.ts";

const scripts = LOGS.find((log) => log.name === "scripts")!;
const lint = LOGS.find((log) => log.name === "lint")!;

const OLD_HEADER = "at,script,command,target,flags,area,caller,tty,exit,ms";
const OLD_OK = "2026-11-22,map,,,check,repo,claude-code,0,0,165";
const OLD_FAILED = "2026-11-22,workflow,file,,,repo,claude-code,0,1,3940";

describe("currentLine", () => {
    it("keeps a row under the current header as written", () => {
        const line = "2026-11-27,map,,,check,repo,human,1,finding,,170";

        expect(currentLine(scripts, line)).toBe(line);
    });

    // Worktrees on older code keep writing the old width into the shared buffer until rebased.
    it("carries an old-width row over, calling only a clean exit ok", () => {
        expect(currentLine(scripts, OLD_OK)).toBe(
            "2026-11-22,map,,,check,repo,claude-code,0,ok,,165",
        );
        expect(currentLine(scripts, OLD_FAILED)).toBe(
            "2026-11-22,workflow,file,,,repo,claude-code,1,,,3940",
        );
    });

    it("leaves an old dev run that exited 0 unclassified and untimed: it was a Ctrl+C", () => {
        expect(currentLine(scripts, "2026-11-22,dev,,portfolio,,repo,human,1,0,3600000")).toBe(
            "2026-11-22,dev,,portfolio,,repo,human,0,,,",
        );
        expect(currentLine(scripts, "2026-11-22,dev,,portfolio,,repo,human,1,1,900")).toBe(
            "2026-11-22,dev,,portfolio,,repo,human,1,,,900",
        );
    });

    it("drops a cut-short line and either header", () => {
        expect(currentLine(scripts, "2026-11-22,map,,")).toBeUndefined();
        expect(currentLine(scripts, OLD_HEADER)).toBeUndefined();
        expect(currentLine(scripts, COLUMNS.join(","))).toBeUndefined();
    });

    it("never reads a row of a log that had no earlier header as an old one", () => {
        expect(currentLine(lint, OLD_OK)).toBeUndefined();
    });
});

describe("upgradedLog", () => {
    it("rewrites a file under the old header so rows appended after it aren't hidden", () => {
        expect(upgradedLog(scripts, `${OLD_HEADER}\n${OLD_OK}\n${OLD_FAILED}\n`)).toBe(
            `${COLUMNS.join(",")}\n` +
                "2026-11-22,map,,,check,repo,claude-code,0,ok,,165\n" +
                "2026-11-22,workflow,file,,,repo,claude-code,1,,,3940\n",
        );
    });

    it("leaves a file already under the current header alone", () => {
        expect(upgradedLog(scripts, `${COLUMNS.join(",")}\n`)).toBeUndefined();
    });
});
