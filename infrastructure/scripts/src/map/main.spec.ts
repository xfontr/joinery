import { beforeEach, describe, expect, it, vi } from "vitest";

const files = vi.hoisted(() => ({
    rootScripts: vi.fn(),
    projectScripts: vi.fn(),
    hookNames: vi.fn(),
    workflowFiles: vi.fn(),
    skillFiles: vi.fn(),
    docs: vi.fn(),
    readMap: vi.fn(),
    writeMap: vi.fn(),
    projectManifests: vi.fn(),
    readBoundaries: vi.fn(),
    readReadme: vi.fn(),
    writeReadme: vi.fn(),
}));
const readme = vi.hoisted(() => ({
    README_PATH: "README.md",
    constraintsIn: vi.fn(),
    readmeRegions: vi.fn(),
    spliceRegions: vi.fn(),
}));
const domain = vi.hoisted(() => ({
    rootCommands: vi.fn(),
    projectCommands: vi.fn(),
    hooks: vi.fn(),
    workflows: vi.fn(),
    skills: vi.fn(),
    render: vi.fn(),
}));
const io = vi.hoisted(() => ({ out: { success: vi.fn() } }));
vi.mock("./adapters/files.ts", () => ({ ...files, MAP_PATH: "docs/FEATURES.md" }));
vi.mock("./domain/capabilities.ts", () => domain);
vi.mock("./domain/render.ts", () => domain);
vi.mock("./domain/readme.ts", () => readme);
vi.mock("../shared/adapters/io.ts", () => io);

import { main } from "./main.ts";

beforeEach(() => {
    vi.clearAllMocks();
    files.rootScripts.mockReturnValue(["lint"]);
    files.projectScripts.mockReturnValue([]);
    files.hookNames.mockReturnValue([]);
    files.workflowFiles.mockReturnValue([]);
    files.skillFiles.mockReturnValue([]);
    files.docs.mockReturnValue([]);
    domain.rootCommands.mockReturnValue([]);
    domain.projectCommands.mockReturnValue([]);
    domain.hooks.mockReturnValue([]);
    domain.workflows.mockReturnValue([]);
    domain.skills.mockReturnValue([]);
    domain.render.mockReturnValue("rendered");
    files.readMap.mockReturnValue("rendered");
    files.projectManifests.mockReturnValue([]);
    files.readReadme.mockReturnValue("readme");
    readme.spliceRegions.mockReturnValue("readme");
});

describe("map main", () => {
    it("renders and writes the generated feature map", () => {
        main({ flags: new Set(), positionals: [] });

        expect(files.writeMap).toHaveBeenCalledWith("rendered");
        expect(io.out.success).toHaveBeenCalledWith("Wrote docs/FEATURES.md.");
        expect(files.writeReadme).toHaveBeenCalledWith("readme");
    });

    it("accepts a current generated map under check", () => {
        main({ flags: new Set(["check"]), positionals: [] });

        expect(io.out.success).toHaveBeenCalledWith("docs/FEATURES.md and README.md up to date.");
        expect(files.writeMap).not.toHaveBeenCalled();
    });

    it("rejects stale generated output under check", () => {
        files.readMap.mockReturnValue("stale");

        expect(() => main({ flags: new Set(["check"]), positionals: [] })).toThrow(
            "docs/FEATURES.md out of date",
        );
    });

    it("rejects a README whose rendered tables were edited by hand under check", () => {
        readme.spliceRegions.mockReturnValue("re-rendered");

        expect(() => main({ flags: new Set(["check"]), positionals: [] })).toThrow(
            /^README\.md out of date/,
        );
        expect(files.writeReadme).not.toHaveBeenCalled();
    });

    it("does not hide a filesystem failure while writing the generated map", () => {
        files.writeMap.mockImplementation(() => {
            throw new Error("read-only");
        });

        expect(() => main({ flags: new Set(), positionals: [] })).toThrow("read-only");
    });
});
