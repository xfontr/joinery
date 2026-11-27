import { posix } from "node:path";
import type { Finding } from "./findings.ts";

export interface SourceFile {
    /** Relative to the app root, e.g. `layers/forms/shared/types/Challenge.ts`. */
    path: string;
    text: string;
}

export interface NuxtSources {
    /** Repo-relative, e.g. `apps/huella-legal`. */
    app: string;
    files: SourceFile[];
}

type Side = "client" | "node";

const SPECIFIER = /(?:\bfrom|\bimport)\s*(?:\(\s*)?["']([^"']+)["']/g;

const EXPORTED =
    /\bexport\s+(?:declare\s+)?(?:type|interface|const|let|function|enum|class)\s+(\w+)/g;

const COMMENT_OR_STRING = /\/\*[\s\S]*?\*\/|\/\/[^\n]*|"[^"\n]*"|'[^'\n]*'/g;

const SCRIPT = /(<script[^>]*>)([\s\S]*?)(<\/script>)/g;

// Nuxt auto-imports only the top level of these two, in the app root and in every layer.
const AUTO_IMPORTED = /(?:^|\/)shared\/(?:types|utils)\/[^/]+\.ts$/;

const isTest = (path: string): boolean => /\.(?:spec|test|stories)\.ts$/.test(path);

const roleOf = (path: string): Side | "shared" | undefined => {
    if (isTest(path)) return undefined;
    if (posix.basename(path) === "nuxt.config.ts") return "node";

    for (const segment of path.split("/")) {
        if (segment === "shared") return "shared";
        if (segment === "app") return "client";
        if (segment === "server" || segment === "tools" || segment === "modules") return "node";
    }

    return undefined;
};

const ALIASES: [string, string][] = [
    ["#layers/", "layers/"],
    ["#shared/", "shared/"],
    ["~~/", ""],
    ["@@/", ""],
    ["~/", "app/"],
    ["@/", "app/"],
];

const resolve = (specifier: string, from: string, known: Set<string>): string | undefined => {
    let base: string | undefined;

    if (specifier.startsWith(".")) {
        base = posix.normalize(posix.join(posix.dirname(from), specifier));
    } else {
        const alias = ALIASES.find(([prefix]) => specifier.startsWith(prefix));
        if (alias) base = alias[1] + specifier.slice(alias[0].length);
    }

    if (base === undefined) return undefined;
    return [base, `${base}.ts`, `${base}/index.ts`].find((candidate) => known.has(candidate));
};

const blank = (code: string): string => code.replaceAll(COMMENT_OR_STRING, " ");

// A Vue template's expressions sit inside attribute quotes, so only its script blocks are blanked.
const codeOf = ({ path, text }: SourceFile): string =>
    path.endsWith(".vue")
        ? text.replaceAll(SCRIPT, (_, open: string, body: string, close: string) =>
              [open, blank(body), close].join(""),
          )
        : blank(text);

const mentions = (code: string, names: string[]): boolean =>
    names.some((name) => new RegExp(String.raw`\b${name}\b`).test(code));

const importersOf = (files: SourceFile[], shared: SourceFile[]): Map<string, Set<string>> => {
    const known = new Set(files.map(({ path }) => path));
    const importers = new Map(shared.map(({ path }) => [path, new Set<string>()]));
    const autoImported = shared
        .filter(({ path }) => AUTO_IMPORTED.test(path))
        .map(({ path, text }) => ({
            path,
            names: [...text.matchAll(EXPORTED)].map(([, n]) => n!),
        }));

    for (const file of files) {
        if (roleOf(file.path) === undefined) continue;

        for (const [, specifier] of file.text.matchAll(SPECIFIER)) {
            const target = resolve(specifier!, file.path, known);
            if (target !== undefined && target !== file.path) importers.get(target)?.add(file.path);
        }

        const code = codeOf(file);
        for (const { path, names } of autoImported) {
            if (path !== file.path && mentions(code, names)) importers.get(path)?.add(file.path);
        }
    }

    return importers;
};

const sidesOf = (
    path: string,
    importers: Map<string, Set<string>>,
    seen: Set<string> = new Set(),
): Set<Side> => {
    const sides = new Set<Side>();
    seen.add(path);

    for (const importer of importers.get(path) ?? []) {
        const role = roleOf(importer);
        if (role === "shared") {
            if (!seen.has(importer))
                sidesOf(importer, importers, seen).forEach((s) => sides.add(s));
        } else if (role !== undefined) {
            sides.add(role);
        }
    }

    return sides;
};

const oneSidedFinding = (path: string, side: Side): Finding => ({
    id: "one-sided-shared",
    title: "A shared/ file is used by one side only",
    detail:
        side === "client"
            ? `${path} is only reached from app/. shared/ is for code both app/ and server/ use, so it goes in that app/ or layer's app/types or app/utils.`
            : `${path} is only reached from server/, tools/ or a nuxt.config. shared/ is for code both app/ and server/ use, so it goes in server/ or tools/.`,
    evidence: [path],
});

/** Every `shared/` file reached from exactly one of `app/` and the Node side, specs aside. */
export const oneSidedShared = ({ app, files }: NuxtSources): Finding[] => {
    const shared = files.filter(({ path }) => path.endsWith(".ts") && roleOf(path) === "shared");
    const importers = importersOf(files, shared);

    return shared.flatMap(({ path }) => {
        const sides = [...sidesOf(path, importers)];
        return sides.length === 1 ? [oneSidedFinding(`${app}/${path}`, sides[0]!)] : [];
    });
};
