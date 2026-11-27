import { mkdtempSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { errorKindOf } from "../domain/cli.ts";
import { assertNotFlagLike, capture, inherit, run } from "./exec.ts";

describe("run", () => {
    it("uses the executable selected by PATH so machine-specific installations work", () => {
        const bin = mkdtempSync(join(tmpdir(), "scripts-exec-"));

        try {
            symlinkSync(process.execPath, join(bin, "git"));
            vi.stubEnv("PATH", bin);

            expect(run("git", ["-e", "process.stdout.write('PATH git')"])).toBe("PATH git");
        } finally {
            vi.unstubAllEnvs();
            rmSync(bin, { recursive: true, force: true });
        }
    });

    it("returns stdout past Node's 1 MiB default buffer instead of throwing ENOBUFS", () => {
        expect(
            run(process.execPath, ["-e", "process.stdout.write('x'.repeat(2 * 1024 * 1024))"]),
        ).toHaveLength(2 * 1024 * 1024);
    });

    it("propagates a subprocess failure instead of hiding its stderr", () => {
        expect(() =>
            run(process.execPath, ["-e", "process.stderr.write('failure'); process.exit(2)"]),
        ).toThrow();
    });
});

describe("run's failure kind", () => {
    it("names the tool that failed without the path it was found at", () => {
        let thrown: unknown;
        try {
            run(process.execPath, ["-e", "process.exit(2)"]);
        } catch (error) {
            thrown = error;
        }

        expect(errorKindOf(thrown)).toBe(`${basename(process.execPath)}:exit`);
    });
});

describe("capture", () => {
    it("returns a failing child's status and both streams instead of throwing", () => {
        expect(
            capture(process.execPath, [
                "-e",
                "process.stdout.write('out'); process.stderr.write('err'); process.exit(4)",
            ]),
        ).toEqual({ status: 4, stdout: "out", stderr: "err" });
    });
});

describe("inherit", () => {
    it("returns the child exit status and preserves a null signal status", () => {
        expect(inherit(process.execPath, ["-e", "process.exit(3)"])).toBe(3);
        expect(
            inherit(process.execPath, ["-e", "process.kill(process.pid, 'SIGTERM')"]),
        ).toBeNull();
    });
});

describe("assertNotFlagLike", () => {
    it("returns the value unchanged when it doesn't start with a dash", () => {
        expect(assertNotFlagLike("Fix the login bug", "title")).toBe("Fix the login bug");
    });

    it("throws when the value starts with a dash", () => {
        expect(() => assertNotFlagLike("--body-file=/etc/passwd", "title")).toThrow(/title/);
    });
});
