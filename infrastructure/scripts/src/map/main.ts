import type { Args } from "../shared/cli.ts";
import { ExpectedError } from "../shared/errors.ts";
import { out } from "../shared/adapters/io.ts";
import { PROJECT_ROOTS } from "../shared/domain/layout.ts";
import {
    docs,
    hookNames,
    MAP_PATH,
    projectManifests,
    projectScripts,
    readBoundaries,
    readMap,
    readReadme,
    rootScripts,
    skillFiles,
    workflowFiles,
    writeMap,
    writeReadme,
} from "./adapters/files.ts";
import { hooks, projectCommands, rootCommands, skills, workflows } from "./domain/capabilities.ts";
import { render } from "./domain/render.ts";
import { constraintsIn, README_PATH, readmeRegions, spliceRegions } from "./domain/readme.ts";

interface Output {
    path: string;
    current: string;
    rendered: string;
    write: (markdown: string) => void;
}

const featureMap = (): Output => {
    const scripts = rootScripts();

    return {
        path: MAP_PATH,
        current: readMap(),
        rendered: render(
            [
                ...rootCommands(scripts),
                ...projectCommands(projectScripts(), scripts),
                ...hooks(hookNames()),
                ...workflows(workflowFiles()),
                ...skills(skillFiles()),
            ],
            docs(),
        ),
        write: writeMap,
    };
};

const readme = (): Output => {
    const current = readReadme();
    const regions = readmeRegions(
        constraintsIn(readBoundaries()),
        projectManifests(),
        PROJECT_ROOTS,
    );

    return {
        path: README_PATH,
        current,
        rendered: spliceRegions(current, regions),
        write: writeReadme,
    };
};

export const main = ({ flags }: Args): void => {
    const outputs = [featureMap(), readme()];

    if (flags.has("check")) {
        const stale = outputs.filter(({ current, rendered }) => current !== rendered);

        if (stale.length > 0) {
            const paths = stale.map(({ path }) => path).join(" and ");
            throw new ExpectedError(
                `${paths} out of date. Run \`pnpm docs:map\` and commit the result.`,
            );
        }

        out.success(`${outputs.map(({ path }) => path).join(" and ")} up to date.`);
        return;
    }

    for (const { path, rendered, write } of outputs) {
        write(rendered);
        out.success(`Wrote ${path}.`);
    }
};
