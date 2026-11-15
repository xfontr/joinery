export interface OutdatedPackage {
    name: string;
    current: string;
    wanted: string;
    latest: string;
    isDeprecated: boolean;
    /** Repo-relative project roots — `pnpm outdated` itself reports an absolute filesystem path. */
    dependents: string[];
}
