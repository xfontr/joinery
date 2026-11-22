import { serveEndpoint } from "@monorepo/configs/vitest/utils/nuxt";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises, type VueWrapper } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { parse } from "yaml";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NuxtPage } from "#components";
import { assembleWorkflows, type Workflows } from "#layers/workflows/shared/workflows.ts";

const MESSAGES = {
    app: {
        apps: {
            catalog: "Catalog",
            docs: "Docs",
            health: "Health",
            home: "Home",
            work: "Work",
        },
        nav: {
            audits: "Audits",
            benchmarks: "Benchmarks",
            changelog: "What's new",
            coverage: "Coverage",
            decisions: "Decisions",
            deps: "Dependencies",
            docs: "Documentation",
            graph: "Architecture",
            issues: "Work in progress",
            overview: "Overview",
            projects: "Projects",
            telemetry: "Tooling usage",
            workflows: "Workflows",
        },
    },
    newProject: {
        errors: {
            milestone: "Already {project}'s milestone",
        },
        none: "None",
        pageItem: "{title} ({type})",
        pageProblems: {
            untitled: "Name the page, or remove it",
        },
        review: {
            area: "Area label",
            complexity: "Complexity",
            complexityValue: "{points} SP",
            featuresOn: "Features on",
            id: "Id",
            leftOut: "Left out",
            milestone: "Milestone",
            pages: "Pages",
            summary: "Summary",
            template: "Template",
            tickets: "Tickets",
            ticketsValue: "{size}, {count} for {blocks} blocks",
            title: "Title",
        },
        steps: {
            details: {
                hint: "The id, milestone and area label follow the title until you change them.",
                question: "What is it called?",
                title: "Details",
            },
            features: {
                hint: "Leaving one out takes its blocks out of the map; the ticket count beside it follows. You can change this later in Settings.",
                question: "Which features does it need?",
                title: "Features",
            },
            pages: {
                hint: "Add a layout once, not each page on it: the legal and about pages on one layout are one page template. Each becomes a block with its own estimate.",
                question: "Which page templates, custom pages and blogs does it have?",
                title: "Pages",
            },
            review: {
                hint: "Nothing goes to GitHub. The project file is all that gets written.",
                question: "Ready to create it?",
                title: "Review",
            },
            template: {
                hint: "The template is the map of blocks the project starts from. It can't be changed later.",
                question: "What are you building?",
                title: "Template",
            },
        },
    },
    pageHeader: {
        breadcrumb: "Breadcrumb",
        wordmark: "monorepo",
    },
    ticketSize: {
        block: {
            summary: "One ticket per block, or its suggested ones, each PR reviewed by hand",
            title: "Reviewed",
        },
        fast: {
            summary: "Tickets of up to {width} SP, and the spikes together; sign-offs stay apart",
            title: "Fast",
            warning:
                "Meant for AI-run projects, putting speed over code quality: for internal tools and experiments.",
        },
        supervised: {
            summary:
                "A stage's build blocks share tickets of up to {width} SP; spikes and sign-offs stay apart",
            title: "Supervised",
        },
    },
    wizardDetails: {
        area: {
            help: "Where its code lives",
            label: "Area label",
        },
        id: {
            help: "kebab-case; the file name",
            label: "Id",
        },
        milestone: {
            help: "Its tickets live here",
            label: "Milestone",
        },
        summary: {
            help: "One line on what the site is and who reads it",
            label: "Summary",
        },
        title: {
            label: "Title",
            placeholder: "Harbour Notes",
        },
    },
    wizardFooter: {
        back: "Back",
        create: "Create project",
        download: "Download YAML",
        next: "Next",
        readOnly: {
            description:
                "This portal is a read-only snapshot. Download the file and add it to data/workflows/projects/{id}.yaml in a pull request.",
            title: "You're not authorised to create projects here",
        },
    },
    wizardReview: {
        graph: "Dependency graph",
    },
    wizardSummary: {
        ticketSize: "Ticket size",
        units: {
            blocks: "blocks",
            points: "SP",
            tickets: "tickets",
        },
        untitled: "Untitled project",
    },
    workflow: {
        fallback: "Workflow",
    },
    workflowActions: {
        never: "Never synced — run {setup} then {sync}",
    },
    workflowEstimateReceipt: {
        core: "Core build",
        label: "Estimate breakdown",
        points: "{points} SP",
        title: "What's in it",
        total: "Total",
        unnamed: "Unnamed page",
    },
    workflowFeaturePicker: {
        points: "{points} SP",
    },
    workflowGraph: {
        details: "Details for {title}",
        fit: "Fit the selected path",
        full: "Full screen",
        node: "{title}, {state}",
        zoomIn: "Zoom in",
        zoomOut: "Zoom out",
    },
    workflowLeaveModal: {
        stay: "Stay",
    },
    workflowNew: {
        cancel: "Cancel",
        leave: {
            action: "Leave without creating",
            description: "Nothing picked on this page is in a project file yet.",
            title: "Leave without creating?",
        },
        title: "New project",
    },
    workflowNewProjectCard: {
        label: "New project",
    },
    workflowPagePicker: {
        add: "{type} · {points} SP",
        name: "{type} name",
        points: "{points} SP",
        remove: "Remove {page}",
    },
    workflowProjects: {
        empty: "No project under {folder} yet.",
        title: "Projects",
    },
    workflowTemplatePicker: {
        counts: "{blocks} blocks by default · {fast}–{block} tickets · {points} SP",
        legend: "Template",
    },
    workflowTemplates: {
        title: "Templates",
    },
    workflowTicketSizePicker: {
        legend: "Ticket size",
    },
    workflows: {
        capabilityState: {
            "can-file": "Can file now",
        },
        crumb: "workflows",
        guide: "How workflows work",
        intro: "A workflow is a map of every block a kind of project needs and what each one needs first, learned from the ones already shipped. Each project picks its features, files the blocks as GitHub tickets with their blocked-by links, and from then on GitHub says where it stands.",
        missing: "No project {id} under {folder}.",
        title: "Workflows",
    },
};

const editing = vi.hoisted(() => ({ editable: true, edit: vi.fn() }));
mockNuxtImport("useWorkflowEdit", () => () => editing);

const TEMPLATE = {
    id: "new-website",
    title: "New website",
    stages: [{ id: "build", title: "Build" }],
    groups: [{ id: "blog", title: "Blog", optional: true, default: true }],
    capabilities: [
        { id: "post-page", stage: "build", group: "blog", title: "Post page" },
        { id: "search", stage: "build", title: "Search", optional: true, default: false },
    ],
};

const button = (wrapper: VueWrapper, label: string) =>
    wrapper.findAll("button").find((candidate) => candidate.text() === label);

const options = (wrapper: VueWrapper, legend: string) =>
    wrapper
        .findAll("fieldset")
        .find((group) => group.find("legend").text() === legend)
        ?.findAll("label") ?? [];

const choice = (wrapper: VueWrapper, legend: string, title: string) =>
    options(wrapper, legend)
        .find((option) => option.text().startsWith(title))
        ?.find("input");

const templates = (template: object = TEMPLATE): Workflows =>
    assembleWorkflows([{ file: "new-website.yaml", ok: true, value: template }], [], {});

const Routed = defineComponent({ render: () => h(NuxtPage) });

const open = async (data: Workflows = templates()) => {
    serveEndpoint("/api/workflows", () => data);
    const wrapper = await mountSuspended(Routed, { route: "/workflows/new" });
    await flushPromises();
    return wrapper;
};

const path = () => useRouter().currentRoute.value.path;

const landsOn = (target: string) => vi.waitFor(() => expect(path()).toBe(target));

const press = async (label: string) => {
    [...document.body.querySelectorAll("[role=dialog] button")]
        .find((candidate) => candidate.textContent?.trim() === label)!
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushPromises();
};

beforeEach(() => {
    editing.editable = true;
    editing.edit.mockReset().mockResolvedValue(true);
});

beforeEach(() => {
    useNuxtApp().$i18n.mergeLocaleMessage("en", MESSAGES);
});

describe("new project wizard", () => {
    it("writes the features and ticket size picked on the way, and nothing to GitHub", async () => {
        const wrapper = await open();

        await button(wrapper, "Next")?.trigger("click");
        await wrapper.find("input").setValue("Harbour Notes");
        await button(wrapper, "Next")?.trigger("click");
        await wrapper
            .findAll("[role='switch']")
            .find((card) => card.text().includes("Search"))
            ?.trigger("click");
        await choice(wrapper, "Ticket size", "Fast")?.setValue();
        await button(wrapper, "Next")?.trigger("click");
        await button(wrapper, "Create project")?.trigger("click");

        expect(editing.edit).toHaveBeenCalledWith({
            action: "create",
            project: "harbour-notes",
            template: "new-website",
            title: "Harbour Notes",
            summary: "",
            milestone: "Harbour Notes",
            area: "app:harbour-notes",
            switches: { search: true },
            ticketSize: "fast",
            extras: [],
        });
        await landsOn("/workflows/harbour-notes");
    });

    it("asks for pages on a template with page types and writes each as an extra of its type", async () => {
        const types = [{ id: "custom-page", stage: "build", title: "Custom page", complexity: 5 }];
        const data = assembleWorkflows(
            [{ file: "new-website.yaml", ok: true, value: { ...TEMPLATE, types } }],
            [],
            {},
        );
        const wrapper = await open(data);

        await button(wrapper, "Next")?.trigger("click");
        await wrapper.find("input").setValue("Harbour Notes");
        await button(wrapper, "Next")?.trigger("click");
        await button(wrapper, "Custom page · 5 SP")?.trigger("click");
        const name = wrapper.find("input[aria-label='Custom page name']");
        await name.setValue("Services");
        await name.trigger("keydown", { key: "Enter" });

        expect(wrapper.find("[aria-label='Estimate breakdown']").text()).toMatch(
            /Services · Custom page\s*5 SP/,
        );

        await button(wrapper, "Next")?.trigger("click");
        expect(wrapper.find("[role='switch']").exists()).toBe(true);
        await button(wrapper, "Next")?.trigger("click");
        await button(wrapper, "Create project")?.trigger("click");

        expect(editing.edit).toHaveBeenCalledWith(
            expect.objectContaining({
                extras: [{ id: "services-page", type: "custom-page", title: "Services" }],
            }),
        );
    });

    it("lets a wizard nobody started be left at once", async () => {
        await open();

        await useRouter().push("/workflows");

        await vi.waitFor(() => expect(path()).toBe("/workflows"));
    });

    it("holds a navigation away from a started wizard until the user leaves anyway", async () => {
        const wrapper = await open();
        await button(wrapper, "Next")?.trigger("click");

        await useRouter().push("/workflows");
        await flushPromises();

        expect(path()).toBe("/workflows/new");

        await press("Leave without creating");

        await landsOn("/workflows");
        expect(editing.edit).not.toHaveBeenCalled();
    });

    it("keeps the ticket size in view on every step, priced for the features picked so far", async () => {
        const wrapper = await open();
        const size = (title: string) =>
            options(wrapper, "Ticket size")
                .find((option) => option.text().startsWith(title))
                ?.text();

        expect(size("Fast")).toMatch(/\D1$/);

        await button(wrapper, "Next")?.trigger("click");
        await wrapper.find("input").setValue("Harbour Notes");
        await button(wrapper, "Next")?.trigger("click");
        await wrapper
            .findAll("[role='switch']")
            .find((card) => card.text().includes("Search"))
            ?.trigger("click");

        expect(size("Fast")).toMatch(/\D1$/);
        expect(size("Reviewed")).toMatch(/\D2$/);
    });

    it("maps only the blocks the picked features switch on, on the review step", async () => {
        const wrapper = await open();
        const mapped = () =>
            wrapper
                .findAll("button[aria-pressed]")
                .map((block) => block.attributes("aria-label")?.split(",")[0]);

        expect(wrapper.text()).not.toContain("Dependency graph");

        await button(wrapper, "Next")?.trigger("click");
        await wrapper.find("input").setValue("Harbour Notes");
        await button(wrapper, "Next")?.trigger("click");
        await button(wrapper, "Next")?.trigger("click");

        expect(mapped()).toEqual(["Post page"]);
    });

    it("follows the title again once the id is cleared, instead of sticking at empty", async () => {
        const wrapper = await open();

        await button(wrapper, "Next")?.trigger("click");
        await wrapper.find("input").setValue("Harbour Notes");
        const id = wrapper.findAll("input")[1]!;
        await id.setValue("typed");
        await id.setValue("");

        expect((id.element as HTMLInputElement).value).toBe("harbour-notes");
    });

    it("refuses another project's milestone on the details step, not at Create", async () => {
        const data = assembleWorkflows(
            [{ file: "new-website.yaml", ok: true, value: TEMPLATE }],
            [
                {
                    file: "harbour.yaml",
                    ok: true,
                    value: {
                        id: "harbour",
                        title: "Harbour",
                        template: "new-website",
                        milestone: "Harbour Notes",
                    },
                },
            ],
            {},
        );
        const wrapper = await open(data);

        await button(wrapper, "Next")?.trigger("click");
        await wrapper.find("input").setValue("Harbour Notes");

        expect(wrapper.text()).toContain("Already Harbour's milestone");
        expect(button(wrapper, "Next")?.attributes("disabled")).toBeDefined();
    });

    it("starts on a template with blocks, even when a blank one sorts first", async () => {
        const data = assembleWorkflows(
            [
                {
                    file: "custom.yaml",
                    ok: true,
                    value: {
                        id: "custom",
                        title: "Custom",
                        stages: [{ id: "build", title: "Build" }],
                    },
                },
                { file: "new-website.yaml", ok: true, value: TEMPLATE },
            ],
            [],
            {},
        );
        const wrapper = await open(data);

        expect(
            options(wrapper, "Template")
                .find((option) => option.find<HTMLInputElement>("input").element.checked)
                ?.text(),
        ).toContain("New website");
    });

    it("won't move past the details until the project has a title", async () => {
        const wrapper = await open();

        await button(wrapper, "Next")?.trigger("click");
        await nextTick();

        expect(button(wrapper, "Next")?.attributes("disabled")).toBeDefined();
    });

    it("runs the whole wizard on the static site but locks Create, which has no server to write through", async () => {
        editing.editable = false;
        const wrapper = await open();

        await button(wrapper, "Next")?.trigger("click");
        await wrapper.find("input").setValue("Harbour Notes");
        await button(wrapper, "Next")?.trigger("click");
        await button(wrapper, "Next")?.trigger("click");
        await button(wrapper, "Create project")?.trigger("click");

        expect(button(wrapper, "Create project")?.attributes("disabled")).toBeDefined();
        expect(button(wrapper, "Download YAML")).toBeDefined();
        expect(editing.edit).not.toHaveBeenCalled();
    });

    it("downloads the project file the dev server would have written", async () => {
        editing.editable = false;
        const blobs: Blob[] = [];
        vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
            blobs.push(blob as Blob);
            return "blob:project";
        });
        vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
        const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
        const wrapper = await open();

        await button(wrapper, "Next")?.trigger("click");
        await wrapper.find("input").setValue("Harbour Notes");
        await button(wrapper, "Next")?.trigger("click");
        await wrapper
            .findAll("[role='switch']")
            .find((card) => card.text().includes("Search"))
            ?.trigger("click");
        await choice(wrapper, "Ticket size", "Fast")?.setValue();
        await button(wrapper, "Next")?.trigger("click");
        await button(wrapper, "Download YAML")?.trigger("click");

        expect((click.mock.contexts[0] as HTMLAnchorElement | undefined)?.download).toBe(
            "harbour-notes.yaml",
        );
        expect(parse((await blobs[0]?.text()) ?? "")).toEqual({
            id: "harbour-notes",
            title: "Harbour Notes",
            template: "new-website",
            area: "app:harbour-notes",
            milestone: "Harbour Notes",
            summary: "",
            switches: { search: true },
            ticketSize: "fast",
        });
    });

    it("stays on the wizard when the server refuses the project", async () => {
        editing.edit.mockResolvedValue(false);
        const wrapper = await open();

        await button(wrapper, "Next")?.trigger("click");
        await wrapper.find("input").setValue("Harbour Notes");
        await button(wrapper, "Next")?.trigger("click");
        await button(wrapper, "Next")?.trigger("click");
        await button(wrapper, "Create project")?.trigger("click");

        expect(editing.edit).toHaveBeenCalled();
        expect(path()).toBe("/workflows/new");
    });
});
