import { describe, expect, it } from "vitest";
import { oneSidedShared, type SourceFile } from "./sides.ts";

const flagged = (...files: SourceFile[]): string[] =>
    oneSidedShared({ app: "apps/demo", files }).map((finding) => finding.evidence[0]!);

const file = (path: string, text = ""): SourceFile => ({ path, text });

describe("oneSidedShared", () => {
    it("flags a shared file only app/ imports, by relative path or alias", () => {
        expect(
            flagged(
                file("layers/a/shared/view.ts", "export const view = 1;"),
                file("layers/a/app/pages/index.vue", 'import { view } from "../../shared/view";'),
                file("app/utils/x.ts", 'import { view } from "#layers/a/shared/view.ts";'),
            ),
        ).toEqual(["apps/demo/layers/a/shared/view.ts"]);
    });

    it("flags a shared file only the Node side reaches, counting tools/ and a nuxt.config", () => {
        expect(
            flagged(
                file("shared/key.ts", "export const key = 1;"),
                file("server/api/x.ts", 'import { key } from "#shared/key";'),
                file("tools/cli.ts", 'import { key } from "../shared/key.ts";'),
                file("nuxt.config.ts", 'import { key } from "./shared/key.ts";'),
            ),
        ).toEqual(["apps/demo/shared/key.ts"]);
    });

    it("passes a file both sides import", () => {
        expect(
            flagged(
                file("shared/rules.ts", "export const rules = 1;"),
                file("app/x.ts", 'import { rules } from "~~/shared/rules";'),
                file("tools/cli.ts", 'import { rules } from "../shared/rules";'),
            ),
        ).toEqual([]);
    });

    it("gives a shared file the sides of the shared files importing it", () => {
        expect(
            flagged(
                file("shared/types/Id.ts", "export type Id = string;"),
                file("shared/types/Item.ts", 'import type { Id } from "./Id.ts";'),
                file("app/x.ts", 'import type { Item } from "#shared/types/Item";'),
                file("server/x.ts", 'import type { Item } from "../shared/types/Item";'),
            ),
        ).toEqual([]);
    });

    it("counts an auto-imported type or util used by name, as huella-legal's app/ uses them", () => {
        expect(
            flagged(
                file("layers/a/shared/types/Summary.ts", "export interface Summary {}"),
                file(
                    "layers/b/app/components/Card.vue",
                    '<script setup lang="ts">\ndefineProps<{ a: Summary }>();\n</script>',
                ),
                file(
                    "layers/a/server/mappers/summary.ts",
                    "export const to = (): Summary => ({});",
                ),
            ),
        ).toEqual([]);
    });

    it("ignores a name that only appears in a string or a comment", () => {
        expect(
            flagged(
                file("shared/types/Challenge.ts", "export type Challenge = () => void;"),
                file("app/x.ts", "const c: Challenge = () => {};"),
                file("server/x.ts", 'throw new Error("Challenge failed"); // a Challenge'),
            ),
        ).toEqual(["apps/demo/shared/types/Challenge.ts"]);
    });

    it("reads a name inside a Vue template expression as a use", () => {
        expect(
            flagged(
                file("shared/utils/label.ts", "export const label = () => '';"),
                file("app/x.vue", '<template><p :title="label()" /></template>'),
                file("server/x.ts", "label();"),
            ),
        ).toEqual([]);
    });

    it("ignores specs and stories, and a shared file nothing uses yet", () => {
        expect(
            flagged(
                file("shared/types/New.ts", "export type New = 1;"),
                file("shared/view.ts", "export const view = 1;"),
                file("app/x.ts", 'import { view } from "~~/shared/view";'),
                file("server/x.spec.ts", 'import { view } from "../shared/view";'),
                file("app/x.stories.ts", "const n: New = 1;"),
            ),
        ).toEqual(["apps/demo/shared/view.ts"]);
    });

    it("survives an import cycle between shared files", () => {
        expect(
            flagged(
                file("shared/a.ts", 'import { b } from "./b.ts";'),
                file("shared/b.ts", 'import { a } from "./a.ts";'),
                file("app/x.ts", 'import { a } from "~~/shared/a";'),
            ),
        ).toEqual(["apps/demo/shared/a.ts", "apps/demo/shared/b.ts"]);
    });
});
