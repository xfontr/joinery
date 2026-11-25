<template>
    <UContainer
        as="section"
        class="flex flex-col justify-between gap-12 pt-8 pb-10 md:min-h-hero md:gap-16 md:pt-16"
    >
        <h1 class="text-hero text-highlighted">
            {{ $t("index.title") }}<br />
            <mark>{{ $t("index.titleMark") }}</mark>
        </h1>
        <div class="page-grid items-end gap-y-10">
            <p class="col-span-4 text-lead text-highlighted md:col-span-6">
                {{ $t("index.lead") }}
            </p>
            <ul class="col-span-4 md:col-span-5 md:col-start-8">
                <li v-for="item in index" :key="item.slug" class="border-t border-default">
                    <ULink :to="item.to" class="group grid grid-cols-2 gap-4 py-2.5">
                        <span class="font-medium text-highlighted group-hover:text-primary">
                            {{ item.name }}
                        </span>
                        <span class="self-center font-mono text-meta text-muted">{{
                            item.stage
                        }}</span>
                    </ULink>
                </li>
            </ul>
        </div>
    </UContainer>

    <RuleSheet />

    <WorkflowTeaser />

    <WorkList />

    <UContainer class="pt-32">
        <ul class="page-grid gap-y-6 border-t border-accented pt-6">
            <li v-for="item in DEEPER" :key="item.id" class="col-span-4">
                <ULink :to="item.to" class="group flex flex-col gap-2">
                    <span class="font-mono text-meta text-muted">
                        {{ $t(`index.deeper.${item.id}.kicker`) }}
                    </span>
                    <span
                        class="text-heading text-highlighted group-hover:text-primary"
                        :style="item.carry"
                    >
                        {{ $t(`index.deeper.${item.id}.title`) }}
                    </span>
                </ULink>
            </li>
        </ul>
    </UContainer>
</template>

<script setup lang="ts">
const DEEPER = [
    { id: "method", to: "/method", carry: carried("hero-method") },
    { id: "workflows", to: "/agentic-workflows", carry: carried("hero-workflows") },
    { id: "work", to: "/work", carry: carried("hero-work") },
] as const;

const { t } = useI18n();
useSeoMeta({ title: t("index.head"), description: t("index.lead") });

const { data: work } = await useWorkList();

/** Every piece of work and where it stands, so the first screen already shows what got made. */
const index = computed(() =>
    work.value.map((entry) => ({
        slug: entry.slug,
        name: entry.name,
        stage: entry.stage,
        to: entry.caseStudy ? `/work/${entry.slug}` : portalUrl(entry.live.href),
    })),
);
</script>
