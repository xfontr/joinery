import { isCompleteLine, lineOf, type Log } from "../../shared/domain/usage.ts";

/** The line under the log's current header, or `undefined` for a partial line or a header. */
export const currentLine = (log: Log, line: string): string | undefined => {
    if (isCompleteLine(line, log.columns)) return line;
    if (!log.previous || !isCompleteLine(line, log.previous.columns)) return undefined;

    const cells = line.split(",");
    const old = Object.fromEntries(
        log.previous.columns.map((column, i) => [column, cells[i] ?? ""]),
    );
    return lineOf(log.columns, log.previous.upgrade(old));
};

/**
 * A branch file still headed by the log's previous columns, rewritten under the current ones, or
 * `undefined` when it needs no rewrite. The portal drops every row whose width differs from its
 * file's header, so appending new rows under an old header would hide them.
 */
export const upgradedLog = (log: Log, text: string): string | undefined => {
    const [header, ...lines] = text.split("\n");
    if (!log.previous || header !== log.previous.columns.join(",")) return undefined;

    const rows = lines.flatMap((line) => currentLine(log, line) ?? []);
    return `${[log.columns.join(","), ...rows].join("\n")}\n`;
};
