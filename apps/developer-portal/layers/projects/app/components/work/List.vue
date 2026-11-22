<template>
    <section id="work" class="bg-muted">
        <UContainer class="py-20">
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
                        :style="carried(`work-shot-${item.slug}`)"
                        width="1440"
                        height="900"
                        class="w-full border border-default md:col-span-2 md:row-span-6"
                    />
                    <p class="font-mono text-xs text-muted uppercase">
                        {{ item.kind }} · {{ item.stage }}
                    </p>
                    <h3
                        class="font-display text-heading text-highlighted"
                        :style="carried(`work-title-${item.slug}`)"
                    >
                        {{ item.name }}
                    </h3>
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
        </UContainer>
    </section>
</template>

<script setup lang="ts">
import { isStudy } from "#layers/projects/app/utils/work.ts";

const { data: work } = await useWorkList();

const items = computed(() =>
    work.value.map((entry, index) => ({
        slug: entry.slug,
        name: entry.name,
        kind: entry.kind,
        what: entry.line,
        stage: entry.stage,
        story: entry.caseStudy ? `/work/${entry.slug}` : null,
        cta: entry.live.label,
        href: entry.live.href,
        shot: index === 0 && isStudy(entry) ? workScreenshot(entry) : undefined,
        shotAlt: isStudy(entry) ? entry.screenshot.alt : "",
    })),
);
</script>
