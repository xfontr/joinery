import type { Finding } from "./findings.ts";

export interface ManifestSource {
    /** Repo-relative, e.g. `packages/content/package.json`. */
    path: string;
    manifest: unknown;
    /** `version` at the base ref; undefined when no base was given or the file is new there. */
    baseVersion?: string;
}

const LIFECYCLE_SCRIPTS = [
    "preinstall",
    "install",
    "postinstall",
    "prepare",
    "prepublish",
    "prepublishOnly",
];

const SOURCE_ONLY_FIELDS = ["main", "types", "typings", "module"];

type JsonObject = Record<string, unknown>;

const isObject = (value: unknown): value is JsonObject =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const isPackage = (path: string): boolean => /^packages\/[^/]+\/package\.json$/.test(path);

const scriptNames = (manifest: JsonObject): string[] =>
    isObject(manifest.scripts) ? Object.keys(manifest.scripts) : [];

const lifecycleFinding = (path: string, scripts: string[]): Finding => ({
    id: "lifecycle-script",
    title: "A lifecycle script is declared",
    detail: `${path} declares ${scripts.join(", ")}. CI installs with --ignore-scripts, so it would work locally and do nothing there.`,
    evidence: [path],
    blocks: true,
});

const buildFinding = (path: string, fields: string[]): Finding => ({
    id: "package-build-step",
    title: "A package declares a build step",
    detail: `${path} declares ${fields.join(", ")}. packages/* export raw source through their exports map, with no build script, main or types.`,
    evidence: [path],
    blocks: true,
});

const versionFinding = (path: string, from: string, to: string): Finding => ({
    id: "version-hand-edit",
    title: "A version was edited by hand",
    detail: `${path} moved from ${from} to ${to}. nx release derives versions from Conventional Commits.`,
    evidence: [path],
    blocks: true,
});

export const manifestBans = ({ path, manifest, baseVersion }: ManifestSource): Finding[] => {
    if (!isObject(manifest)) return [];

    const findings: Finding[] = [];
    const scripts = scriptNames(manifest);

    const lifecycle = scripts.filter((name) => LIFECYCLE_SCRIPTS.includes(name));
    if (lifecycle.length > 0) findings.push(lifecycleFinding(path, lifecycle));

    if (isPackage(path)) {
        const buildFields = [
            ...scripts.filter((name) => name === "build").map(() => "a build script"),
            ...SOURCE_ONLY_FIELDS.filter((field) => field in manifest),
        ];
        if (buildFields.length > 0) findings.push(buildFinding(path, buildFields));
    }

    const { version } = manifest;
    if (baseVersion !== undefined && typeof version === "string" && version !== baseVersion) {
        findings.push(versionFinding(path, baseVersion, version));
    }

    return findings;
};
