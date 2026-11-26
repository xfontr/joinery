import { out } from "../shared/adapters/io.ts";
import { flag, type Args } from "../shared/cli.ts";
import { ExpectedError } from "../shared/errors.ts";
import { createTicket, milestoneIssues } from "./adapters/gh.ts";
import { oneProject, projectMap } from "./adapters/files.ts";
import { bundleFor, fileableNow, planFiling, type WorkflowMap } from "./domain/filing.ts";
import { toSnapshot, type SnapshotIssue } from "./domain/snapshot.ts";
import { sync } from "./sync.ts";

const liveIssues = (map: WorkflowMap): SnapshotIssue[] =>
    toSnapshot(map.milestone, milestoneIssues(map.milestone), [], new Map(), "").issues;

const fileGroup = (map: WorkflowMap, issues: SnapshotIssue[], ids: string[], write: boolean) => {
    const filing = planFiling(map, issues, ids);

    if (!filing.ok) throw new ExpectedError(`Not filed: ${filing.reason}.`);

    for (const ticket of filing.tickets) {
        const links = ticket.blockedBy.map((number) => `#${number}`).join(" ") || "nothing";
        const points =
            ticket.complexity === null ? "unestimated" : `complexity ${ticket.complexity}`;
        const summary = `${ticket.title}\n  labels ${ticket.labels.join(", ")} · milestone ${map.milestone} · blocked by ${links} · ${points}`;

        if (!write) {
            out.info(summary);
            continue;
        }

        out.success(`${createTicket({ ...ticket, milestone: map.milestone })}\n  ${ticket.title}`);
    }
};

/** False when nothing could be filed; a dry run stops after the first round. */
const fileEverything = (map: WorkflowMap, write: boolean): boolean => {
    let issues = liveIssues(map);
    let groups = fileableNow(map, issues);
    if (groups.length === 0) return false;

    const filed = new Set<string>();

    while (groups.length > 0) {
        const again = groups.flat().filter((id) => filed.has(id));
        // A ticket GitHub hasn't returned yet would otherwise be filed a second time.
        if (again.length > 0) {
            throw new ExpectedError(
                `Stopped: ${again.join(", ")} still read as unfiled after filing; check the milestone on GitHub before running again.`,
            );
        }

        for (const ids of groups) fileGroup(map, issues, ids, write);
        if (!write) break;
        for (const id of groups.flat()) filed.add(id);
        issues = liveIssues(map);
        groups = fileableNow(map, issues);
    }

    return true;
};

/**
 * Turns a block of the map into GitHub tickets, together with the blocks the project's ticket size
 * bundles it with, or exactly the blocks named; with no block, every block that can be filed now,
 * round after round as each round's tickets open the next. A dry run unless `--yes`.
 */
export const file = ({ positionals }: Args): void => {
    const [projectId, capability, ...rest] = positionals;

    const id = oneProject([projectId ?? ""]);
    const map = projectMap(id);
    const write = flag("yes");

    if (capability) {
        const issues = liveIssues(map);
        const ids = rest.length > 0 ? [capability, ...rest] : bundleFor(map, issues, capability);
        fileGroup(map, issues, ids, write);
    } else if (!fileEverything(map, write)) {
        out.success(`${id}: nothing can be filed yet.`);
        return;
    }

    if (!write) {
        out.note("Nothing was filed. Run it again with --yes to create these tickets.");
        return;
    }

    // The portal locks the ticket size from the snapshot, so it has to see these tickets now.
    sync({ positionals: [id], flags: new Set() });
};
