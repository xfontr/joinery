<template>
    <UContainer as="section" id="workflows" class="pb-20">
        <ULink
            to="/agentic-workflows"
            class="group grid items-center gap-10 border-t border-accented pt-10 md:grid-cols-12"
        >
            <div class="flex flex-col gap-5 md:col-span-6">
                <p class="font-mono text-xs text-muted uppercase">
                    {{ $t("workflowTeaser.kicker") }}
                </p>
                <h2 class="font-display text-section text-highlighted md:text-title">
                    {{ $t("workflowTeaser.title") }}
                    <mark>{{ $t("workflowTeaser.titleMark") }}</mark>
                </h2>
                <p class="max-w-md text-lg text-default">{{ $t("workflowTeaser.line") }}</p>
                <span
                    class="font-display text-2xl text-highlighted underline decoration-primary underline-offset-8 group-hover:text-primary"
                >
                    {{ $t("workflowTeaser.cta") }} →
                </span>
            </div>
            <div v-if="glyph" class="flex justify-center md:col-span-6">
                <WorkflowGlyph :map="glyph" :label="$t('workflowTeaser.glyphLabel')" />
            </div>
        </ULink>
    </UContainer>
</template>

<script setup lang="ts">
/** The project whose plan the teaser draws; its copy names it too. */
const PLAN = "huella-legal";

const { data: glyph } = await useWorkflowGlyph(PLAN);
</script>
