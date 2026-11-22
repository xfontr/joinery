<template>
    <PageHero
        carry="hero-work"
        :title="$t('work.title')"
        :mark="$t('work.titleMark')"
        :lead="$t('work.lead')"
    />

    <UContainer as="section" class="flex flex-col">
        <ULink
            v-for="(item, index) in cases"
            :key="item.slug"
            :to="`/work/${item.slug}`"
            class="group grid gap-6 border-t border-accented py-10 md:grid-cols-12 md:gap-10"
        >
            <img
                v-bind="workScreenshot(item)"
                sizes="(min-width: 48rem) 58vw, 100vw"
                :loading="index ? 'lazy' : 'eager'"
                :fetchpriority="index ? 'auto' : 'high'"
                :alt="item.screenshot.alt"
                :style="carried(`work-shot-${item.slug}`)"
                width="1440"
                height="900"
                class="w-full border border-default md:col-span-7"
            />
            <div class="flex flex-col gap-3 md:col-span-5">
                <p class="font-mono text-xs text-muted uppercase">{{ item.kind }}</p>
                <h2
                    class="font-display text-section text-highlighted group-hover:text-primary"
                    :style="carried(`work-title-${item.slug}`)"
                >
                    {{ item.name }}
                </h2>
                <p class="text-lg">{{ item.line }}</p>
                <p class="font-mono text-sm text-muted">{{ item.facts.join(" · ") }}</p>
                <span class="mt-2 text-primary underline underline-offset-4">
                    {{ $t("work.cta") }} →
                </span>
            </div>
        </ULink>
    </UContainer>
</template>

<script setup lang="ts">
import { isStudy } from "#layers/projects/app/utils/work.ts";

definePageMeta({ layout: "visitor" });

const { t } = useI18n();

const { data: work } = await useWorkList();

const cases = computed(() => work.value.filter(isStudy));

useSeoMeta({ title: () => t("work.head"), description: () => t("work.lead") });
</script>
