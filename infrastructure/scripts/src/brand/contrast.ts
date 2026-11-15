import { out } from "../shared/adapters/io.ts";
import { fail, type Args } from "../shared/cli.ts";
import { ExpectedError } from "../shared/errors.ts";
import { readCustomProperties } from "./adapters/files.ts";
import { contrastTable, failing, measure, MINIMUM } from "./domain/contrast.ts";

const USAGE =
    "Name the stylesheet, repo-relative — pnpm brand:contrast apps/<app>/layers/design/app/assets/main.css";

export const contrast = ({ positionals }: Args): void => {
    const [path] = positionals;
    if (path === undefined) throw new ExpectedError(USAGE);

    const rows = measure(readCustomProperties(path));
    if (rows.length === 0)
        throw new ExpectedError(`${path} sets no --ui-text-* or --ui-bg-* role.`);

    out.info(contrastTable(rows));

    const below = failing(rows);
    if (below.length > 0) fail(`${below.length} pair(s) below ${MINIMUM}:1.`);
};
