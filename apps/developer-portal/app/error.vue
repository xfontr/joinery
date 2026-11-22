<template>
    <UApp>
        <NuxtLayout name="visitor">
            <UContainer as="section" class="flex flex-col gap-6 pt-10 pb-16" data-error>
                <p class="font-mono text-xs text-muted uppercase">{{ error.status }}</p>
                <h1 class="font-display text-section text-highlighted">
                    {{ error.status === 404 ? $t("error.notFound") : $t("error.server") }}
                </h1>
                <ULink to="/" class="text-primary underline underline-offset-4">
                    {{ $t("error.back") }}
                </ULink>
            </UContainer>
        </NuxtLayout>
    </UApp>
</template>

<script setup lang="ts">
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
