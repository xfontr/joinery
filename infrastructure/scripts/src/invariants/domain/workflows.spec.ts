import { describe, expect, it } from "vitest";
import { misnamedWorkflow } from "./workflows.ts";

const flagged = (file: string, name?: string): boolean =>
    misnamedWorkflow({
        file,
        text: name === undefined ? "on: push\n" : `name: ${name}\non: push\n`,
    }).length > 0;

describe("misnamedWorkflow", () => {
    it.each([
        ["deploy-developer-portal.yml", "Deploy · Developer portal"],
        ["pr-docs-review.yml", "PR · Docs review"],
        ["ci.yml", "CI"],
    ])("passes %s named %s", (file, name) => {
        expect(flagged(file, name)).toBe(false);
    });

    it("flags a file named after its host rather than its name, as netlify-deployment was", () => {
        expect(flagged("netlify-deployment.yml", "Deploy · Huella Legal")).toBe(true);
    });

    it("flags a name whose category drifted from the file's", () => {
        expect(flagged("deploy-portfolio.yml", "Portfolio deploy")).toBe(true);
    });

    it("flags a workflow with no name, since GitHub would show its path in the sidebar", () => {
        expect(flagged("ci.yml")).toBe(true);
    });
});
