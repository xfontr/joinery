import { out } from "../shared/adapters/io.ts";
import type { Args } from "../shared/cli.ts";
import { ExpectedError } from "../shared/errors.ts";
import { areaIssuesWithoutMilestone, milestoneIssues } from "./adapters/gh.ts";
import { commitLog } from "./adapters/git.ts";
import {
    projectIds,
    readProject,
    readSnapshot,
    snapshotPath,
    writeSnapshot,
} from "./adapters/files.ts";
import {
    activityByIssue,
    describeSnapshot,
    sameIssues,
    syncTargetOf,
    toSnapshot,
} from "./domain/snapshot.ts";

/** Writes one project's snapshot, or returns false when its milestone can't be read. */
const syncOne = (id: string, activity: ReturnType<typeof activityByIssue>): boolean => {
    const read = syncTargetOf(readProject(id));

    if ("problem" in read) throw new ExpectedError(`${id}.yaml can't be synced: ${read.problem}.`);

    let issues: ReturnType<typeof milestoneIssues>;
    try {
        issues = milestoneIssues(read.milestone);
    } catch (error) {
        // A project created before its milestone mustn't stop the others from syncing.
        if (!(error instanceof ExpectedError)) throw error;
        out.warn(`${id}: ${error.message}`);
        return false;
    }

    const snapshot = toSnapshot(
        read.milestone,
        issues,
        read.area ? areaIssuesWithoutMilestone(read.area) : [],
        activity,
        new Date().toISOString(),
    );

    if (sameIssues(readSnapshot(id), snapshot)) {
        out.success(`${id}: unchanged — ${describeSnapshot(snapshot)}.`);
        return true;
    }

    writeSnapshot(id, snapshot);
    out.success(`${id}: wrote ${snapshotPath(id)} — ${describeSnapshot(snapshot)}.`);
    return true;
};

/** Snapshots each project's milestone and commit activity beside its project file. */
export const sync = ({ positionals }: Args): void => {
    const known = projectIds();
    const ids = positionals.length > 0 ? positionals : known;

    if (ids.length === 0) throw new ExpectedError("No project under data/workflows/projects/ yet.");

    const unknown = ids.filter((id) => !known.includes(id));
    if (unknown.length > 0) {
        throw new ExpectedError(
            `No project file for ${unknown.join(", ")}. Known: ${known.join(", ")}.`,
        );
    }

    const activity = activityByIssue(commitLog());
    const failed = ids.filter((id) => !syncOne(id, activity));

    if (failed.length > 0) throw new ExpectedError(`Not synced: ${failed.join(", ")}.`);
};
