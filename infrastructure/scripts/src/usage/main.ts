import { out } from "../shared/adapters/io.ts";
import { currentBranch } from "../shared/adapters/usage.ts";
import { logFileFor, LOGS } from "../shared/domain/usage.ts";
import { appendToLog, takeBuffer } from "./adapters/files.ts";
import { currentLine } from "./domain/rows.ts";

export const main = (): void => {
    const branch = currentBranch();
    if (!branch) {
        out.info("Not on a branch — the recorded rows wait for the next flush.");
        return;
    }

    for (const log of LOGS) {
        const buffer = takeBuffer(log.name);
        const lines = buffer.text.split("\n").flatMap((line) => currentLine(log, line) ?? []);

        if (lines.length > 0) {
            const path = appendToLog(log, logFileFor(branch), lines);
            out.success(`Flushed ${lines.length} rows into ${path}.`);
        }

        buffer.discard();
    }
};
