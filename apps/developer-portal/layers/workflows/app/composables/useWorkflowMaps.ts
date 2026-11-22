import {
    GLYPH_MAP,
    lessonCount,
    projectMap,
    type Workflows,
} from "#layers/workflows/shared/workflows.ts";

// Each of these is a cut of `/api/workflows` with its own key, and prerender stores only the cut
// in a page's payload, so a visitor page never carries the whole set.

/** Every project's map, for the project maps page. */
export const useWorkflowMaps = () =>
    useFetch("/api/workflows", {
        key: "workflow-maps",
        transform: ({ projects }: Workflows) =>
            projects.map((view) => ({
                id: view.project.id,
                title: view.project.title,
                map: projectMap(view),
            })),
        default: () => [],
    });

/** One project's map at glyph scale, or null while it is missing. */
export const useWorkflowGlyph = (id: string) =>
    useFetch("/api/workflows", {
        key: `workflow-glyph-${id}`,
        transform: ({ projects }: Workflows) => {
            const view = projects.find(({ project }) => project.id === id);
            return view ? projectMap(view, GLYPH_MAP) : null;
        },
        default: () => null,
    });

/** The templates that hold blocks, and how many lessons they carry between them. */
export const useWorkflowTemplates = () =>
    useFetch("/api/workflows", {
        key: "workflow-templates",
        transform: ({ templates }: Workflows) => ({
            templates: templates
                .filter((template) => template.capabilities.length)
                .map(({ id, title, summary }) => ({ id, title, summary })),
            lessons: lessonCount(templates),
        }),
        default: () => ({ templates: [], lessons: 0 }),
    });
