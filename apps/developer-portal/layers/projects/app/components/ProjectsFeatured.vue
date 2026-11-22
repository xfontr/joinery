<template>
    <section class="flex flex-col gap-3">
        <div class="flex items-center justify-between gap-3">
            <div>
                <h2 class="text-xl font-semibold">{{ $t("projectsFeatured.title") }}</h2>
                <p class="mt-1 text-sm text-muted">{{ $t("projectsFeatured.lead") }}</p>
            </div>
            <UButton
                to="/projects"
                :label="$t('projectsFeatured.all')"
                size="xs"
                variant="ghost"
                color="neutral"
                trailing-icon="i-lucide-arrow-right"
            />
        </div>

        <div class="grid gap-4 @4xl:grid-cols-2">
            <UCard
                v-for="project in featured"
                :key="project.root"
                :ui="{ root: 'h-full flex flex-col', header: 'flex-1', body: 'mt-auto' }"
            >
                <template #header>
                    <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                            <h3 class="font-semibold">{{ project.title }}</h3>
                            <p class="mt-1 line-clamp-3 text-sm text-muted">
                                {{ project.description }}
                            </p>
                        </div>
                        <span class="shrink-0 font-mono text-xs text-muted">
                            {{ $t("projectsFeatured.kind") }}
                        </span>
                    </div>
                </template>
                <div class="flex items-center justify-between gap-3">
                    <span class="truncate font-mono text-xs text-dimmed">{{ project.root }}</span>
                    <UButton
                        :to="`/wiki/${project.root}/readme`"
                        :label="$t('projectsFeatured.readMore')"
                        icon="i-lucide-book-open"
                        size="xs"
                        variant="soft"
                    />
                </div>
            </UCard>
        </div>
    </section>
</template>

<script setup lang="ts">
const FEATURED = 2;

const { t } = useI18n();
const { projects, readmeFor, ready } = useCatalog();

await ready;

const featured = computed(() =>
    projects
        .filter((project) => project.root.startsWith("apps/"))
        .slice(0, FEATURED)
        .map((project) => ({
            root: project.root,
            title: readmeFor(project)?.title ?? project.name,
            description: readmeFor(project)?.description ?? t("projectsFeatured.noDescription"),
        })),
);
</script>
