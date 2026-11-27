import type { Args } from "../shared/cli.ts";
import { optionValue } from "../shared/domain/cli.ts";
import { ExpectedError } from "../shared/errors.ts";
import { out } from "../shared/adapters/io.ts";
import {
    projectRoots,
    readManifests,
    readNuxtSources,
    readPackages,
    readTableSources,
    readWorkflows,
} from "./adapters/files.ts";
import { assertCommit, manifestAt } from "./adapters/git.ts";
import { manifestBans } from "./domain/bans.ts";
import { contractFindings, validatePackage } from "./domain/contracts.ts";
import type { Finding } from "./domain/findings.ts";
import { oneSidedShared } from "./domain/sides.ts";
import { compareLayoutBlock, compareTagTables } from "./domain/tables.ts";
import { misnamedWorkflow } from "./domain/workflows.ts";

const versionOf = (manifest: unknown): string | undefined => {
    const version = (manifest as { version?: unknown } | undefined)?.version;
    return typeof version === "string" ? version : undefined;
};

const collect = (base: string | undefined): Finding[] => {
    const { boundaries, readme } = readTableSources();

    return [
        ...readManifests().flatMap(({ path, manifest }) =>
            manifestBans({
                path,
                manifest,
                baseVersion: base === undefined ? undefined : versionOf(manifestAt(base, path)),
            }),
        ),
        ...readPackages().map(validatePackage).flatMap(contractFindings),
        ...readNuxtSources().flatMap(oneSidedShared),
        ...compareTagTables(boundaries, readme),
        ...compareLayoutBlock(readme, projectRoots()),
        ...readWorkflows().flatMap(misnamedWorkflow),
    ];
};

export const main = ({ flags }: Args): void => {
    const baseFlag = optionValue(flags, "base");
    const findings = collect(baseFlag === undefined ? undefined : assertCommit(baseFlag));

    for (const finding of findings) out.error(`${finding.title}: ${finding.detail}`);

    if (findings.length > 0) {
        throw new ExpectedError(`invariants:check found ${findings.length} violation(s).`);
    }

    out.success("Repo invariants hold.");
};
