<template>
    <section id="work" class="bg-muted">
        <div class="mx-auto max-w-6xl px-4 py-20 md:px-10">
            <h2 class="font-display text-section text-highlighted md:text-title">
                {{ $t("workList.title") }} <mark>{{ $t("workList.titleMark") }}</mark>
            </h2>
            <div class="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-3">
                <article
                    v-for="item in items"
                    :key="item.slug"
                    class="flex flex-col gap-3"
                    :class="item.shot && 'md:col-span-3 md:grid md:grid-cols-3 md:gap-x-10'"
                >
                    <img
                        v-if="item.shot"
                        :src="item.shot"
                        :alt="item.shotAlt"
                        width="1440"
                        height="900"
                        class="w-full border border-default md:col-span-2 md:row-span-6"
                    />
                    <p class="font-mono text-xs text-muted uppercase">
                        {{ item.kind }} · {{ item.stage }}
                    </p>
                    <h3 class="font-display text-heading text-highlighted">{{ item.name }}</h3>
                    <p class="text-base">{{ item.what }}</p>
                    <div class="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                        <ULink
                            v-if="item.story"
                            :to="item.story"
                            class="text-primary underline underline-offset-4"
                        >
                            {{ $t("workList.caseStudy") }}
                        </ULink>
                        <ULink :to="item.href" class="underline underline-offset-4">
                            {{ item.cta }}
                        </ULink>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { WORK } from "#layers/projects/shared/work.ts";

/** Apps and tools with no case study, linked to where they can be seen instead. */
const TOOLS = [
    { key: "wpEditor", slug: "wp-editor", href: "/wiki/apps/wp-editor/readme" },
    { key: "portal", slug: "portal", href: "/overview" },
] as const;

const { t } = useI18n();

const items = computed(() => [
    ...WORK.map((work, index) => ({
        slug: work.slug,
        name: work.name,
        kind: work.kind,
        what: work.line,
        stage: work.stage,
        story: `/work/${work.slug}`,
        cta: work.live.label,
        href: work.live.href,
        shot: index === 0 ? workScreenshot(work) : undefined,
        shotAlt: t("workList.shotAlt", { name: work.name }),
    })),
    ...TOOLS.map(({ key, slug, href }) => ({
        slug,
        name: t(`workList.tools.${key}.name`),
        kind: t(`workList.tools.${key}.kind`),
        what: t(`workList.tools.${key}.what`),
        stage: t(`workList.tools.${key}.stage`),
        story: null,
        cta: t(`workList.tools.${key}.cta`),
        href,
        shot: undefined,
        shotAlt: "",
    })),
]);
</script>
