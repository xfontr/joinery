import { readFileSync } from "node:fs";
import postcss from "postcss";
import { at } from "../../shared/adapters/git.ts";

export const readText = (path: string): string => readFileSync(at(path), "utf8");

/** Every `--*` declared in a top-level `@theme` or `:root`; a later declaration wins. */
export const readCustomProperties = (path: string): Map<string, string> => {
    const properties = new Map<string, string>();

    for (const node of postcss.parse(readText(path)).nodes) {
        const isTheme = node.type === "atrule" && node.name === "theme";
        const isRoot = node.type === "rule" && node.selector === ":root";
        if (!isTheme && !isRoot) continue;

        for (const child of node.nodes ?? []) {
            if (child.type === "decl" && child.prop.startsWith("--")) {
                properties.set(child.prop, child.value);
            }
        }
    }

    return properties;
};
