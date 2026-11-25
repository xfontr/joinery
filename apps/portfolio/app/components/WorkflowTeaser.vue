<template>
    <section id="workflows" class="dark bg-muted text-default">
        <UContainer class="page-grid items-center gap-y-12 py-24">
            <div class="col-span-4 flex flex-col gap-6">
                <h2 class="text-section text-highlighted">
                    {{ $t("workflowTeaser.title") }}
                    <mark>{{ $t("workflowTeaser.titleMark") }}</mark>
                </h2>
                <p class="text-lead text-highlighted">{{ $t("workflowTeaser.line") }}</p>
                <ULink raw to="/agentic-workflows" class="self-start link">
                    {{ $t("workflowTeaser.cta") }}
                </ULink>
            </div>
            <div v-if="glyph" class="col-span-4 md:col-span-8 md:col-start-5">
                <MapPlate
                    :map="glyph"
                    :label="$t('workflowTeaser.glyphLabel')"
                    class="max-md:hidden"
                />
                <WorkflowGlyph
                    :map="glyph"
                    :label="$t('workflowTeaser.glyphLabel')"
                    class="w-full md:hidden"
                />
            </div>
        </UContainer>
    </section>
</template>

<script setup lang="ts">
/** The project whose plan the teaser draws; its copy names it too. */
const PLAN = "huella-legal";

const { data: glyph } = await useWorkflowGlyph(PLAN);
</script>
