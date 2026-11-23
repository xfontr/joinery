import { parse } from "yaml";
import type { Finding } from "./findings.ts";

export interface WorkflowSource {
    /** The basename, e.g. `deploy-portfolio.yml`. */
    file: string;
    text: string;
}

const SEPARATOR = " · ";

const fileFor = (name: string): string =>
    `${name.split(SEPARATOR).join("-").toLowerCase().replaceAll(/\s+/g, "-")}.yml`;

const nameOf = (text: string): string | undefined => {
    const { name } = (parse(text) ?? {}) as { name?: unknown };
    return typeof name === "string" ? name : undefined;
};

/** A workflow whose file isn't its `name` slugged, so `Deploy · Portfolio` sits in `deploy-portfolio.yml`. */
export const misnamedWorkflow = ({ file, text }: WorkflowSource): Finding[] => {
    const name = nameOf(text);
    const expected = name === undefined ? undefined : fileFor(name);
    if (expected === file) return [];

    return [
        {
            id: "misnamed-workflow",
            title: "A workflow's file and name disagree",
            detail:
                name === undefined
                    ? `.github/workflows/${file} has no top-level name. Name it "<Category>${SEPARATOR}<Subject>", e.g. "Deploy${SEPARATOR}Portfolio", or a single word like "CI".`
                    : `.github/workflows/${file} is named "${name}", so the file is ${expected}. Rename one so they match; the category before "${SEPARATOR}" is what groups the Actions sidebar.`,
            evidence: [`.github/workflows/${file}`],
            blocks: true,
        },
    ];
};
