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
                        placeholder="Filter projects"
                        size="sm"
                        aria-label="Filter projects"
                    />
                </template>
            </PageHeader>
        </template>

        <template #body>
            <ProjectsTable :groups :headed="filter === 'all'">
                <template #empty>
                    {{ search ? `No project matches “${search}”.` : "No projects collected yet." }}
                </template>
            </ProjectsTable>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
const { filter, current, crumbs, search, shown, groups, ready } = useProjectList();

await ready;
</script>
