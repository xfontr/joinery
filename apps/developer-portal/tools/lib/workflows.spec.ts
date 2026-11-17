import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { missingDiaries } from "./workflows.ts";

let dir = "";

beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "workflow-diaries-"));
    await mkdir(join(dir, "projects"));
});

afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
});

describe("missingDiaries", () => {
    it("names each project with no diary, so its run can't go unrecorded", async () => {
        await writeFile(join(dir, "projects", "kept.diary.md"), "# 📓 Kept diary\n");

        expect(missingDiaries(["kept.yaml", "forgotten.yaml"], dir)).toEqual([
            { file: "projects/forgotten.yaml", message: expect.stringContaining("forgotten") },
        ]);
    });
});
