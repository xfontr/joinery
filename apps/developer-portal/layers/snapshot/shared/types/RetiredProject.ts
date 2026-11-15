/** A project whose `package.json` was deleted, read back from git history. */
export interface RetiredProject {
    name: string;
    root: string;
    tags: string[];
    deletedAt: string;
    commit: string;
    subject: string;
    /** Commits that touched its root, the deleting one included. */
    commits: number;
}
