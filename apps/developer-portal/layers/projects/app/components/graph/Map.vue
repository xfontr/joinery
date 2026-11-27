<template>
    <UCard variant="flush">
        <template #header>
            <h2 class="font-semibold">{{ $t("graphMap.title") }}</h2>
            <p class="text-xs text-muted">{{ $t("graphMap.lead") }}</p>
        </template>

        <p v-if="projects.length === 0" class="px-4 py-3 text-sm text-muted">
            {{ $t("graphMap.empty") }}
        </p>

        <div
            v-else
            class="flex h-160 flex-col divide-y divide-default lg:flex-row lg:divide-x lg:divide-y-0"
        >
            <aside
                class="flex max-h-60 flex-col gap-4 overflow-y-auto p-4 lg:max-h-none lg:w-80 lg:shrink-0"
            >
                <UInput
                    v-model="query"
                    icon="i-lucide-search"
                    :placeholder="$t('graphMap.search')"
                    size="sm"
                />

                <section v-for="section in sections" :key="section.label">
                    <h3 class="mb-2 text-sm font-semibold">{{ section.label }}</h3>
                    <ul class="flex flex-col gap-1">
                        <li
                            v-for="project in section.projects"
                            :key="project.name"
                            class="flex items-center justify-between gap-2"
                        >
                            <UCheckbox
                                :model-value="!hidden.includes(project.name)"
                                :label="project.name"
                                size="sm"
                                :ui="{ label: 'font-mono text-xs' }"
                                @update:model-value="toggle(project.name)"
                            />
                            <UButton
                                :aria-label="$t('graphMap.focus', { name: project.name })"
                                :aria-pressed="focus === project.name"
                                icon="i-lucide-locate-fixed"
                                :color="focus === project.name ? 'primary' : 'neutral'"
                                variant="ghost"
                                size="xs"
                                @click="focus = focus === project.name ? null : project.name"
                            />
                        </li>
                    </ul>
                </section>
            </aside>

            <div class="relative min-h-0 flex-1">
                <div ref="canvas" class="size-full" role="img" :aria-label="$t('graphMap.label')" />

                <div
                    class="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-md bg-default p-1 shadow-sm ring ring-default"
                >
                    <UButton
                        :aria-label="
                            rankDir === 'TB'
                                ? $t('graphMap.leftToRight')
                                : $t('graphMap.topToBottom')
                        "
                        :icon="rankDir === 'TB' ? 'i-lucide-arrow-down' : 'i-lucide-arrow-right'"
                        color="neutral"
                        variant="ghost"
                        size="sm"
                        @click="rankDir = rankDir === 'TB' ? 'LR' : 'TB'"
                    />
                    <UButton
                        :aria-label="$t('graphMap.fit')"
                        icon="i-lucide-scan"
                        color="neutral"
                        variant="ghost"
                        size="sm"
                        @click="cy?.fit(undefined, 20)"
                    />
                    <UButton
                        :aria-label="$t('graphMap.reset')"
                        icon="i-lucide-refresh-cw"
                        color="neutral"
                        variant="ghost"
                        size="sm"
                        @click="render"
                    />
                    <UButton
                        :aria-label="$t('graphMap.group')"
                        :aria-pressed="grouped"
                        icon="i-lucide-group"
                        :color="grouped ? 'primary' : 'neutral'"
                        variant="ghost"
                        size="sm"
                        @click="grouped = !grouped"
                    />
                    <UButton
                        :label="$t('graphMap.all')"
                        color="neutral"
                        variant="ghost"
                        size="sm"
                        class="font-mono"
                        @click="showAll"
                    />
                </div>
            </div>
        </div>
    </UCard>
</template>

<script setup lang="ts">
import cytoscape, { type Core, type NodeSingular } from "cytoscape";
import dagre from "cytoscape-dagre";
import type { ProjectNode } from "#layers/snapshot/shared/types/ProjectNode.ts";
import {
    focusedProjects,
    projectGraphElements,
    projectGraphLayout,
    projectGraphStyle,
    type RankDir,
} from "#layers/projects/app/utils/projectGraph.ts";

const { projects } = defineProps<Props>();

cytoscape.use(dagre);

interface Props {
    projects: ProjectNode[];
}

const { t } = useI18n();
const canvas = useTemplateRef<HTMLDivElement>("canvas");
const colorMode = useColorMode();

const rankDir = ref<RankDir>("TB");
const grouped = ref(true);
const query = ref("");
const hidden = ref<string[]>([]);
const focus = ref<string | null>(null);
let cy: Core | undefined;

const matching = computed(() =>
    projects.filter(({ name }) => name.toLowerCase().includes(query.value.trim().toLowerCase())),
);

const sections = computed(() => [
    {
        label: t("graphMap.applications"),
        projects: matching.value.filter(({ type }) => type !== "lib"),
    },
    {
        label: t("graphMap.libraries"),
        projects: matching.value.filter(({ type }) => type === "lib"),
    },
]);

const visible = computed(() => {
    const inFocus = focus.value ? focusedProjects(projects, focus.value) : null;
    return new Set(
        matching.value
            .map(({ name }) => name)
            .filter((name) => !hidden.value.includes(name) && (!inFocus || inFocus.has(name))),
    );
});

const toggle = (name: string) => {
    hidden.value = hidden.value.includes(name)
        ? hidden.value.filter((other) => other !== name)
        : [...hidden.value, name];
};

const showAll = () => {
    hidden.value = [];
    focus.value = null;
    query.value = "";
};

const themeColors = (element: HTMLElement) => {
    const token = (name: string) => getComputedStyle(element).getPropertyValue(name).trim();
    return {
        node: token("--ui-bg-accented"),
        nodeBorder: token("--ui-border-accented"),
        label: token("--ui-text-muted"),
        edge: token("--ui-border-accented"),
        folder: token("--ui-bg-elevated"),
        folderBorder: token("--ui-border-accented"),
        highlight: token("--ui-primary"),
        highlightLabel: token("--ui-text-highlighted"),
    };
};

// Nx fades everything outside the hovered project's neighbourhood.
const highlight = (node: NodeSingular) => {
    const neighbourhood = node.closedNeighborhood();
    cy?.elements().difference(neighbourhood).addClass("transparent");
    neighbourhood.addClass("highlight");
};

const render = () => {
    if (!cy) return;
    cy.elements().remove();
    cy.add(projectGraphElements(projects, visible.value, grouped.value));
    cy.layout(projectGraphLayout(rankDir.value)).run();
};

onMounted(() => {
    if (!canvas.value) return;

    cy = cytoscape({
        container: canvas.value,
        style: projectGraphStyle(themeColors(canvas.value)),
        boxSelectionEnabled: false,
        autounselectify: true,
        minZoom: 0.1,
        maxZoom: 4,
    });

    cy.on("mouseover", "node:childless", ({ target }) => {
        highlight(target);
        canvas.value!.style.cursor = "pointer";
    });
    cy.on("mouseout", "node:childless", () => {
        cy?.elements().removeClass("transparent highlight");
        canvas.value!.style.cursor = "";
    });
    cy.on("tap", "node:childless", ({ target }) => navigateTo(target.data("to")));

    render();
});

onBeforeUnmount(() => cy?.destroy());

watch([visible, grouped], render);
watch(rankDir, (value) => cy?.layout(projectGraphLayout(value)).run());
watch(
    () => colorMode.value,
    () =>
        nextTick(() => {
            if (cy && canvas.value) cy.style(projectGraphStyle(themeColors(canvas.value)));
        }),
);
</script>
