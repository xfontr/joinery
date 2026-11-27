import { out } from "../shared/adapters/io.ts";
import type { Args } from "../shared/cli.ts";
import { ExpectedError } from "../shared/errors.ts";
import { areaIssuesWithoutMilestone, milestoneIssues } from "./adapters/gh.ts";
import { commitLog } from "./adapters/git.ts";
import {
    projectIds,
    projectMap,
    readProject,
    readSnapshot,
    snapshotPath,
    writeSnapshot,
} from "./adapters/files.ts";
import {
    activityByIssue,
    describeSnapshot,
    sameIssues,
    settleCloses,
    syncTargetOf,
    toSnapshot,
} from "./domain/snapshot.ts";
import { unplaced } from "./domain/placement.ts";
import { issueFromBranch } from "../issue/domain/branch.ts";
import { currentBranch } from "../shared/adapters/usage.ts";

/**
 * The tickets the map can't place, or null when the milestone isn't there yet, so one missing
 * milestone doesn't stop the others.
 */
const syncOne = (
    id: string,
    activity: ReturnType<typeof activityByIssue>,
    closing: number | null,
): string[] | null => {
    const read = syncTargetOf(readProject(id));

    if ("problem" in read) throw new ExpectedError(`${id}.yaml can't be synced: ${read.problem}.`);

    let issues: ReturnType<typeof milestoneIssues>;
    try {
        issues = milestoneIssues(read.milestone);
    } catch (error) {
        if (!(error instanceof ExpectedError)) throw error;
        out.warn(`${id}: ${error.message}`);
        return null;
    }

    const previous = readSnapshot(id);
    const snapshot = settleCloses(
        toSnapshot(
            read.milestone,
            issues,
            read.area ? areaIssuesWithoutMilestone(read.area) : [],
            activity,
            new Date().toISOString(),
        ),
        previous,
        closing,
    );

    if (sameIssues(previous, snapshot)) {
        out.success(`${id}: unchanged — ${describeSnapshot(snapshot)}.`);
    } else {
        writeSnapshot(id, snapshot);
        out.success(`${id}: wrote ${snapshotPath(id)} — ${describeSnapshot(snapshot)}.`);
    }

    return unplaced(projectMap(id), snapshot).map((ticket) => `${id} ${ticket}`);
};

/**
 * Snapshots each project's milestone and commit activity beside its project file. `--close`
 * records the current branch's ticket as closed, for the PR that closes it.
 */
export const sync = ({ positionals, flags }: Args): void => {
    const known = projectIds();
    const ids = positionals.length > 0 ? positionals : known;

    if (ids.length === 0) throw new ExpectedError("No project under data/workflows/projects/ yet.");

    const unknown = ids.filter((id) => !known.includes(id));
    if (unknown.length > 0) {
        throw new ExpectedError(
            `No project file for ${unknown.join(", ")}. Known: ${known.join(", ")}.`,
        );
    }

    const closing = flags.has("close") ? (issueFromBranch(currentBranch())?.number ?? null) : null;
    if (flags.has("close") && closing === null) {
        throw new ExpectedError("--close needs a ticket branch such as feature/<area>/<n>-<slug>.");
    }

    const activity = activityByIssue(commitLog());
    const results = ids.map((id) => ({ id, unplaced: syncOne(id, activity, closing) }));
    const failed = results.filter((result) => result.unplaced === null).map(({ id }) => id);
    const strays = results.flatMap((result) => result.unplaced ?? []);

    if (failed.length > 0) throw new ExpectedError(`Not synced: ${failed.join(", ")}.`);

    if (strays.length > 0) {
        for (const stray of strays) out.error(stray);
        throw new ExpectedError(
            `${strays.length} ticket(s) the map can't place. Give each the milestone and one ` +
                "`cap:` label of a capability that's on, on GitHub, then sync again.",
        );
    }
};
