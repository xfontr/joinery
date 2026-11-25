<template>
    <PageHero
        carry="hero-work"
        :title="$t('work.title')"
        :mark="$t('work.titleMark')"
        :lead="$t('work.lead')"
    />

    <UContainer class="flex flex-col gap-24">
        <ULink
            v-for="(item, index) in cases"
            :key="item.slug"
            :to="`/work/${item.slug}`"
            class="group page-grid items-start gap-y-6 border-t border-accented pt-5"
        >
            <div class="col-span-4 flex flex-col gap-3 md:col-span-5">
                <h2
                    class="text-section text-highlighted group-hover:text-primary"
                    :style="carried(`work-title-${item.slug}`)"
                >
                    {{ item.name }}
                </h2>
                <p v-if="item.inProgress" class="text-base text-primary">
                    {{ $t("work.inProgress") }}
                </p>
                <p class="text-lead">{{ item.line }}</p>
                <span class="self-start pt-2 link">{{ $t("work.cta") }}</span>
            </div>
            <img
                v-bind="workScreenshot(item)"
                sizes="(min-width: 48rem) 50vw, 100vw"
                :loading="index ? 'lazy' : 'eager'"
                :fetchpriority="index ? 'auto' : 'high'"
                :alt="item.screenshot.alt"
                :style="carried(`work-shot-${item.slug}`)"
                width="1440"
                height="900"
                class="col-span-4 shot md:col-span-6 md:col-start-7"
            />
        </ULink>
    </UContainer>
</template>

<script setup lang="ts">
import { isStudy } from "~/utils/work";

const { t } = useI18n();

const { data: work } = await useWorkList();

const cases = computed(() => work.value.filter(isStudy));

useSeoMeta({ title: () => t("work.head"), description: () => t("work.lead") });
</script>
