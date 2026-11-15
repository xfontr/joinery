export interface DocLink {
    href: string;
    /** Repo-relative, never absolute — an absolute path leaks the machine's home directory. */
    resolved: string;
}
