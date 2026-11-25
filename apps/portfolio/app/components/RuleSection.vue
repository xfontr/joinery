<template>
    <section
        :id
        class="flex scroll-mt-4 flex-col gap-6 border-t border-accented pt-8 pb-24"
        :data-rule="id"
    >
        <h2 class="text-section text-highlighted" :style="carriedTitle">
            {{ $t(`rules.${id}.title`) }}
        </h2>
        <p class="max-w-2xl text-lead text-highlighted">{{ $t(`rules.${id}.body`, bodyParams) }}</p>
        <slot />
        <ULink raw v-if="to" :to class="self-start link">{{ $t(`rules.${id}.more`) }}</ULink>
    </section>
</template>

<script setup lang="ts">
import type { RuleId } from "~/types/RuleId";

interface Props {
    id: RuleId;
    /** Values the rule's `body` copy interpolates. */
    bodyParams?: Record<string, number>;
    /** Where the rule's `more` link leads. */
    to?: string;
}

const { id, bodyParams = {}, to } = defineProps<Props>();

const carriedTitle = computed(() => carried(`rule-${id}`));
</script>
