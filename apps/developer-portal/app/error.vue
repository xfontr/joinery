<template>
    <UApp>
        <NuxtLayout name="visitor">
            <section
                v-if="error.status === 404"
                data-error="not-found"
                class="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-10 pb-20 md:px-10 md:pt-20"
            >
                <p class="font-mono text-xs text-muted uppercase">
                    {{ $t("error.kicker", { status: error.status }) }}
                </p>
                <h1 class="font-display text-title text-highlighted md:text-statement">
                    {{ $t("error.notFound.title") }}
                </h1>
                <p class="max-w-xl text-lg text-muted">{{ $t("error.notFound.lead") }}</p>
                <div class="flex flex-col gap-3 sm:flex-row">
                    <UButton to="/" :label="$t('error.notFound.home')" class="justify-center" />
                    <UButton
                        to="/overview"
                        variant="outline"
                        color="neutral"
                        trailing-icon="i-lucide-arrow-right"
                        :label="$t('error.notFound.developer')"
                        class="justify-center"
                    />
                </div>
            </section>

            <section
                v-else
                data-error="server"
                class="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-10 pb-20 md:px-10 md:pt-20"
            >
                <p class="font-mono text-xs text-muted uppercase">
                    {{ $t("error.kicker", { status: error.status }) }}
                </p>
                <h1 class="font-display text-title text-highlighted">
                    {{ $t("error.server.title") }}
                </h1>
                <p class="max-w-xl text-lg text-muted">{{ $t("error.server.lead") }}</p>
                <div class="flex flex-col gap-3 sm:flex-row">
                    <UButton
                        icon="i-lucide-rotate-cw"
                        :label="$t('error.server.retry')"
                        class="justify-center"
                        @click="reloadNuxtApp({ force: true })"
                    />
                    <UButton
                        to="/"
                        variant="outline"
                        color="neutral"
                        :label="$t('error.server.home')"
                        class="justify-center"
                    />
                </div>
            </section>
        </NuxtLayout>
    </UApp>
</template>

<script lang="ts" setup>
import type { NuxtError } from "#app";

interface Props {
    error: NuxtError;
}

const { error } = defineProps<Props>();

const { t } = useI18n();

useHead(
    {
        title: () => t("error.head", { status: error.status }),
        meta: [{ name: "robots", content: "noindex" }],
    },
    { tagPriority: "high" },
);
</script>
