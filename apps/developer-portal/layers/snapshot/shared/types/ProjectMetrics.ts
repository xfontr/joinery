export interface ProjectMetrics {
    name: string;
    root: string;
    specs: number;
    commits: number | null;
    commitsLastTwoWeeks: number | null;
    coverageLinesPct: number | null;
    unreleasedCommits: number | null;
    currentVersion: string | null;
    hasChangelog: boolean;
}
