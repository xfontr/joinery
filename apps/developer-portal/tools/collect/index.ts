import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { ArtifactStatus } from "#layers/snapshot/shared/types/ArtifactStatus.ts";
import type { Manifest } from "#layers/snapshot/shared/types/Manifest.ts";
import { toBadges } from "./badges.ts";
import { collectCoverage } from "./coverage.ts";
import { collectDeps } from "./deps.ts";
import { collectDocs } from "./docs.ts";
import { collectGraph } from "./graph.ts";
import { collectMetrics } from "./metrics.ts";
import { collectRetired } from "./retired.ts";
import { collectUsage } from "./usage.ts";
import { SCHEMA_VERSION, SNAPSHOT_DIR } from "../lib/paths.ts";
import { git, tryRun } from "../lib/run.ts";

// eslint-disable-next-line no-console -- each collector's result line is this CLI's output
const print = (line: string) => console.log(line);
// eslint-disable-next-line no-console -- a failed collector is reported on stderr
const printError = (line: string) => console.error(line);

const write = async (name: string, value: unknown): Promise<void> => {
    await writeFile(
        resolve(SNAPSHOT_DIR, `${name}.json`),
        `${JSON.stringify(value, null, 4)}\n`,
        "utf8",
    );
};

interface Run {
    generatedAt: string;
    artifacts: Record<string, ArtifactStatus>;
}

/** Runs one collector, writes its artifact and records the outcome; null when it failed. */
const step = async <T>(
    run: Run,
    name: string,
    collect: () => Promise<T>,
    summary: (value: T) => string,
): Promise<T | null> => {
    const result = await tryRun(collect);

    if (!result.ok) {
        run.artifacts[name] = { generatedAt: run.generatedAt, ok: false, error: result.error };
        printError(`✗ ${name} — ${result.error}`);
        return null;
    }

    await write(name, result.value);
    run.artifacts[name] = { generatedAt: run.generatedAt, ok: true };
    print(`✓ ${name} — ${summary(result.value)}`);
    return result.value;
};

const collectProjects = async (generatedAt: string) => {
    const graph = await collectGraph(generatedAt);

    const retired = await tryRun(() => collectRetired(graph.projects));
    if (!retired.ok) printError(`✗ retired projects — ${retired.error}`);

    return { ...graph, retired: retired.ok ? retired.value : [] };
};

const main = async (): Promise<void> => {
    const run: Run = { generatedAt: new Date().toISOString(), artifacts: {} };
    const { generatedAt } = run;

    await mkdir(SNAPSHOT_DIR, { recursive: true });

    const [commit, branch] = await Promise.all([
        git(["rev-parse", "--short", "HEAD"]).then((out) => out.trim()),
        git(["rev-parse", "--abbrev-ref", "HEAD"]).then((out) => out.trim()),
    ]);

    const writeManifest = () =>
        write("manifest", {
            schemaVersion: SCHEMA_VERSION,
            generatedAt,
            commit,
            branch,
            artifacts: run.artifacts,
        } satisfies Manifest);

    const graph = await step(
        run,
        "projects",
        () => collectProjects(generatedAt),
        (value) => `${value.projects.length} projects`,
    );

    if (!graph) {
        await writeManifest();
        process.exitCode = 1;
        return;
    }

    const coverage = await step(
        run,
        "coverage",
        () => collectCoverage(graph.projects, generatedAt),
        (value) =>
            `${value.projects.filter((project) => project.collected).length}/${value.projects.length} projects collected`,
    );

    const metrics = await step(
        run,
        "metrics",
        () =>
            collectMetrics(
                graph.projects,
                coverage ?? { generatedAt, totals: null, report: false, projects: [] },
                generatedAt,
            ),
        (value) => `${value.projects.length} projects measured`,
    );

    const deps = await step(
        run,
        "deps",
        () => collectDeps(generatedAt),
        (value) => `${value.advisories.length} advisories, ${value.outdated?.length ?? 0} outdated`,
    );

    await step(
        run,
        "docs",
        () => collectDocs(generatedAt),
        (value) => `${value.pages.length} pages`,
    );

    await step(
        run,
        "usage",
        () => collectUsage(generatedAt),
        (value) =>
            `${Object.values(value.scripts).reduce((sum, item) => sum + item.runs, 0)} runs across ${Object.keys(value.scripts).length} scripts`,
    );

    await write("badges", toBadges({ deps, coverage, metrics }));
    await writeManifest();

    print(`\nSnapshot written to ${SNAPSHOT_DIR}`);
};

await main();
