<template>
    <section
        :id
        class="mx-auto grid max-w-6xl gap-8 border-t border-accented px-4 py-14 md:grid-cols-12 md:px-10"
    >
        <header class="flex items-baseline gap-4 md:col-span-4 md:flex-col md:items-start">
            <span class="font-display text-title text-primary">{{ number }}</span>
            <h2 class="font-display text-section text-highlighted" :style="carriedTitle">
                {{ $t(`rules.${id}.title`) }}
            </h2>
        </header>
        <div class="flex flex-col gap-6 md:col-span-8">
            <p class="text-xl text-highlighted">{{ $t(`rules.${id}.body`, bodyParams) }}</p>
            <p v-if="skill" class="font-mono text-sm text-muted">
                {{ $t("ruleSection.skill") }} <code>{{ skill }}</code>
                <template v-if="count"> · {{ $t(`rules.${id}.count`, { count }) }}</template>
            </p>
            <p v-else-if="count" class="font-mono text-sm text-muted">
                {{ $t(`rules.${id}.count`, { count }) }}
            </p>
            <slot />
            <ULink v-if="to" :to class="self-start text-primary underline underline-offset-4">
                {{ $t(`rules.${id}.more`) }} →
            </ULink>
        </div>
    </section>
</template>

<script setup lang="ts">
import type { RuleId } from "~/types/RuleId";

interface Props {
    id: RuleId;
    number: number;
    /** Values the rule's `body` copy interpolates. */
    bodyParams?: Record<string, number>;
    /** The skill an agent loads to follow the rule. */
    skill?: string;
    /** What the rule has produced so far; zero or unset prints nothing. */
    count?: number;
    /** Where the rule's `more` link leads. */
    to?: string;
}

const { id, number, bodyParams = {}, skill, count = 0, to } = defineProps<Props>();

const carriedTitle = computed(() => carried(`rule-${id}`));
</script>
