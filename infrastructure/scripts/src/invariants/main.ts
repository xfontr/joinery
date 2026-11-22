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
} from "./adapters/files.ts";
import { assertCommit, manifestAt } from "./adapters/git.ts";
import { manifestBans } from "./domain/bans.ts";
import { contractFindings, validatePackage } from "./domain/contracts.ts";
import { blocking, type Finding } from "./domain/findings.ts";
import { oneSidedShared } from "./domain/sides.ts";
import { compareLayoutBlock, compareTagTables } from "./domain/tables.ts";

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
    ];
};

export const main = ({ flags }: Args): void => {
    const baseFlag = optionValue(flags, "base");
    const findings = collect(baseFlag === undefined ? undefined : assertCommit(baseFlag));

    if (flags.has("json")) {
        out.json(findings);
        return;
    }

    for (const finding of findings) {
        (finding.blocks ? out.error : out.warn)(`${finding.title}: ${finding.detail}`);
    }

    const failures = blocking(findings).length;
    if (failures > 0) throw new ExpectedError(`invariants:check found ${failures} violation(s).`);

    out.success(
        findings.length === 0
            ? "Repo invariants hold."
            : `Repo invariants hold; ${findings.length} docs warning(s) above.`,
    );
};
