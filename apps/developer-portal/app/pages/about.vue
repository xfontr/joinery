<template>
    <PageHero :title="$t('about.title')" :mark="$t('about.titleMark')" :lead="$t('about.lead')">
        <ULink
            :to="LINKEDIN"
            target="_blank"
            class="text-base text-highlighted underline decoration-primary underline-offset-4"
        >
            {{ $t("about.linkedin") }} ↗
        </ULink>
    </PageHero>

    <section class="mx-auto max-w-6xl px-4 pb-16 md:px-10">
        <h2 class="pb-6 font-mono text-xs text-muted uppercase">{{ $t("about.look.label") }}</h2>
        <ul class="flex flex-col">
            <li v-for="item in look" :key="item.id" class="border-t border-default py-4">
                <ULink
                    :to="item.to"
                    class="grid gap-1 sm:grid-cols-3"
                    :target="item.external ? '_blank' : undefined"
                >
                    <span class="font-display text-2xl text-highlighted">
                        {{ $t(`about.look.items.${item.id}.term`) }} →
                    </span>
                    <span class="text-base sm:col-span-2">
                        {{ $t(`about.look.items.${item.id}.detail`) }}
                    </span>
                </ULink>
            </li>
        </ul>
    </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: "visitor" });

const LINKEDIN = "https://www.linkedin.com/in/xifre/";

const { t } = useI18n();
useSeoMeta({ title: t("about.head"), description: t("about.lead") });

const {
    public: { repoUrl },
} = useRuntimeConfig();

const look = [
    { id: "work", to: "/work", external: false },
    { id: "method", to: "/method", external: false },
    { id: "maps", to: "/agentic-workflows", external: false },
    { id: "developer", to: "/overview", external: false },
    ...(repoUrl ? [{ id: "repo", to: repoUrl, external: true }] : []),
];
</script>
