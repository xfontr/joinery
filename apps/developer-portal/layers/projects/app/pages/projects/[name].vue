<template>
    <UDashboardPanel id="project">
        <template #header>
            <PageHeader
                :title="project?.name ?? name"
                :crumbs="[{ label: $t('projects.crumb'), to: '/projects' }, { label: name }]"
                :tabs="project ? tabs : []"
            >
                <template #title>
                    <h1 class="truncate font-mono text-2xl font-semibold text-highlighted">
                        {{ project?.name ?? name }}
                    </h1>
                </template>
                <template v-if="readme?.description" #intro>
                    <p class="mt-2 max-w-3xl px-4 text-sm text-toned sm:px-6">
                        {{ readme.description }}
                    </p>
                </template>
            </PageHeader>
        </template>

        <template #body>
            <UAlert
                v-if="!project"
                color="neutral"
                variant="subtle"
                icon="i-lucide-box"
                :title="$t('project.missing.title')"
                :description="$t('project.missing.description', { name })"
            />

            <div v-else class="grid items-start gap-6 lg:grid-cols-4">
                <aside class="order-first lg:sticky lg:top-0 lg:order-last">
                    <ProjectAbout :project :metric :projects :coverage-pct />
                </aside>

                <div class="min-w-0 lg:col-span-3">
                    <article
                        v-if="tab === 'readme'"
                        data-prose
                        data-readme
                        class="overflow-x-auto border border-default bg-default px-6 py-5"
                    >
                        <ContentRenderer v-if="readme" :value="readme" />
                        <p v-else class="text-muted">{{ $t("project.noReadme") }}</p>
                    </article>
                    <ProjectCoverageTab
                        v-else-if="tab === 'coverage'"
                        :coverage
                        :age="coverageAge"
                    />
                    <ProjectDepsTab v-else-if="tab === 'deps'" :outdated :age="depsAge" />
                    <ProjectIssuesTab
                        v-else-if="tab === 'issues'"
                        :issues="issues.list"
                        :read="issues.read"
                        :area="issues.area"
                    />
                    <ProjectExtraTab v-else-if="extra" :tab="extra" :name />
                </div>
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
const {
    name,
    tab,
    tabs,
    project,
    metric,
    projects,
    coverage,
    coverageAge,
    outdated,
    depsAge,
    extra,
    issues,
    ready,
} = useProjectPage();

await ready;

const coveragePct = computed(() => coverage.value?.lines?.pct ?? null);

const { data: readme } = await useAsyncData(
    () => `project-readme-${name.value}`,
    () =>
        project.value
            ? queryCollection("docs").path(`/${project.value.root.toLowerCase()}/readme`).first()
            : Promise.resolve(null),
);
</script>
