<template>
    <UDashboardPanel id="projects">
        <template #header>
            <PageHeader :title="current.label" :crumbs>
                <template #title>
                    <h1 class="flex items-baseline gap-2 text-2xl font-semibold text-highlighted">
                        {{ current.label }}
                        <span data-figure class="text-dimmed">{{ shown.length }}</span>
                    </h1>
                </template>
                <template #actions>
                    <UInput
                        v-model="search"
                        icon="i-lucide-search"
                        :placeholder="$t('projectsList.filter')"
                        size="sm"
                        :aria-label="$t('projectsList.filter')"
                    />
                </template>
            </PageHeader>
        </template>

        <template #body>
            <ProjectsTable :groups :headed="filter === 'all'">
                <template #empty>
                    {{ search ? $t("projectsList.noMatch", { search }) : $t("projectsList.empty") }}
                </template>
            </ProjectsTable>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
const { filter, current, crumbs, search, shown, groups, ready } = useProjectList();

await ready;
</script>
