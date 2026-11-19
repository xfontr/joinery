<template>
    <UDashboardPanel id="project">
        <template #header>
            <UDashboardNavbar :title="project?.name ?? name" :ui="{ title: 'font-mono' }">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
                <template #right>
                    <SnapshotAge :manifest="snapshot?.manifest ?? null" artifact="metrics" />
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
            <UAlert
                v-if="!project"
                color="neutral"
                variant="subtle"
                icon="i-lucide-box"
                title="No such project"
                :description="`No collected project lives in a folder called ${name}.`"
            />

            <div v-else class="flex flex-col gap-6 lg:flex-row lg:items-start">
                <UCard variant="flush" class="lg:sticky lg:top-0 lg:order-last lg:w-80 lg:shrink-0">
                    <template #header>
                        <h2 class="font-semibold text-highlighted">About</h2>
                        <p class="font-mono text-xs text-muted">{{ project.root }}</p>
                    </template>

                    <dl class="divide-y divide-default text-sm">
                        <div
                            v-for="fact in facts"
                            :key="fact.label"
                            class="flex items-baseline justify-between gap-3 px-4 py-2"
                        >
                            <dt class="text-muted">{{ fact.label }}</dt>
                            <dd class="font-mono tabular-nums" :class="fact.class">
                                {{ fact.value }}
                            </dd>
                        </div>

                        <div v-for="list in relations" :key="list.label" class="px-4 py-2">
                            <dt class="flex justify-between text-muted">
                                {{ list.label }}
                                <span class="font-mono text-xs">{{ list.items.length }}</span>
                            </dt>
                            <dd v-if="list.items.length === 0" class="text-muted">None</dd>
                            <dd v-for="item in list.items" v-else :key="item.name">
                                <NuxtLink
                                    :to="item.to"
                                    class="block truncate font-mono text-xs text-highlighted hover:underline"
                                >
                                    {{ item.name }}
                                </NuxtLink>
                            </dd>
                        </div>

                        <div v-if="project.tags.length > 0" class="px-4 py-2">
                            <dt class="text-muted">Tags</dt>
                            <dd class="flex flex-wrap gap-x-3 font-mono text-xs text-highlighted">
                                <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
                            </dd>
                        </div>
                    </dl>

                    <template #footer>
                        <UAlert
                            v-if="live.error"
                            color="warning"
                            variant="subtle"
                            icon="i-lucide-cloud-off"
                            title="Live deployment status is unavailable"
                            :description="live.error"
                            class="mb-3"
                        />
                        <div class="flex flex-wrap gap-2">
                            <UButton
                                v-for="link in buttons"
                                :key="link.label"
                                :to="link.to"
                                :label="link.label"
                                :icon="link.icon"
                                :target="link.external ? '_blank' : undefined"
                                :external="link.external"
                                size="xs"
                                color="neutral"
                                variant="outline"
                            />
                        </div>
                    </template>
                </UCard>

                <article
                    class="min-w-0 flex-1 border border-default bg-default px-6 py-5"
                    data-prose
                    data-readme
                >
                    <ContentRenderer v-if="readme" :value="readme" />
                    <p v-else class="text-muted">This project has no README.</p>
                </article>
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
const route = useRoute("projects-name");
const name = computed(() => String(route.params.name));

const { snapshot, projects, live, metricFor, linksFor } = await useCatalog();

const project = computed(() =>
    projects.value.find((candidate) => folderOf(candidate.root) === name.value),
);

const { data: readme } = await useAsyncData(`project-readme-${name.value}`, () =>
    project.value
        ? queryCollection("docs").path(`/${project.value.root.toLowerCase()}/readme`).first()
        : Promise.resolve(null),
);

const facts = computed(() => {
    if (!project.value) return [];
    const metric = metricFor(project.value);

    return [
        { label: "Kind", value: categoryOf(project.value.root), class: "text-highlighted" },
        {
            label: "Version",
            value: metric?.currentVersion ?? "unversioned",
            class: "text-highlighted",
        },
        {
            label: "Unreleased commits",
            value: dash(metric?.unreleasedCommits),
            class: "text-highlighted",
        },
        {
            label: "Line coverage",
            value: dash(metric?.coverageLinesPct, "%"),
            class: toneClass(coverageTone(metric?.coverageLinesPct)) || "text-highlighted",
        },
        { label: "Specs", value: dash(metric?.specs), class: "text-highlighted" },
        { label: "Commits", value: dash(metric?.commits), class: "text-highlighted" },
        {
            label: "Last two weeks",
            value: dash(metric?.commitsLastTwoWeeks),
            class: "text-highlighted",
        },
    ];
});

const pageFor = (packageName: string): string => {
    const found = projects.value.find((candidate) => candidate.name === packageName);
    return found ? `/projects/${folderOf(found.root)}` : "/projects";
};

const relations = computed(() =>
    project.value
        ? [
              {
                  label: "Uses",
                  items: project.value.dependsOn.map((item) => ({ name: item, to: pageFor(item) })),
              },
              {
                  label: "Used by",
                  items: project.value.dependedOnBy.map((item) => ({
                      name: item,
                      to: pageFor(item),
                  })),
              },
          ]
        : [],
);

const buttons = computed(() => {
    if (!project.value) return [];
    const links = linksFor(project.value);

    return [
        { label: "Open site", icon: "i-lucide-external-link", to: links.website, external: true },
        {
            label: "Docs",
            icon: "i-lucide-book-open",
            to: `/wiki/${project.value.root.toLowerCase()}/readme`,
            external: false,
        },
        { label: "API", icon: "i-lucide-braces", to: links.apiDocs, external: true },
        {
            label: "Storybook",
            icon: "i-lucide-panels-top-left",
            to: links.storybook,
            external: true,
        },
        { label: "Deploys", icon: "i-lucide-rocket", to: links.deploys, external: true },
    ].filter((link) => link.to);
});
</script>
