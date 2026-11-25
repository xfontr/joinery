<template>
    <UContainer as="section" class="pt-28" @pointerenter.once="warm">
        <div class="page-grid items-end gap-y-4 pb-10">
            <h2 class="col-span-4 text-section text-highlighted md:col-span-6">
                {{ $t("index.rules.label") }}
            </h2>
            <ULink
                raw
                to="/method"
                class="col-span-4 font-mono text-meta link md:col-span-3 md:col-start-10 md:justify-self-end"
            >
                {{ $t("app.visitor.nav.method") }}
            </ULink>
        </div>
        <ol class="sheet border-t border-accented">
            <li
                v-for="(item, index) in principles"
                :key="item.id"
                :data-rule="item.id"
                class="border-t border-default transition-colors hover:bg-muted md:border-t-0 md:px-5 md:first:pl-0"
                @pointerenter="hover(item.id, $event)"
                @pointerleave="hovered = null"
            >
                <ULink :to="item.to" class="group flex h-full flex-col gap-4 pt-5 pb-8">
                    <span class="font-mono text-meta text-muted">0{{ index + 1 }}</span>
                    <span
                        class="text-heading text-highlighted group-hover:text-primary"
                        :style="item.carry"
                    >
                        {{ $t(`rules.${item.id}.title`) }}
                    </span>
                    <span class="flex-1 text-base">{{ $t(`index.rules.${item.id}.line`) }}</span>
                    <span class="self-start font-mono text-meta link">{{ item.proof }}</span>
                </ULink>
            </li>
        </ol>
        <CursorPreview v-slot="{ subject }" :subject="hovered">
            <BenchmarksPreview v-if="subject === 'look'" :benchmarks />
            <DecisionsPreview v-else-if="subject === 'decide' && example" :report="example" />
            <WorkflowPreview v-else-if="subject === 'plan' && plan" :map="plan" />
            <PipelinePreview v-else-if="subject === 'agents'" />
            <ChecksPreview v-else-if="subject === 'prove'" :specs :rules />
        </CursorPreview>
    </UContainer>
</template>

<script setup lang="ts">
import type { RuleId } from "~/types/RuleId";

const DECISION = "0028-huella-legal-urls-and-cutover";
/** The project rule 3 previews, the same one the workflow teaser draws. */
const PLAN = "huella-legal";

const PROOFS = {
    look: portalUrl("/benchmarks"),
    decide: portalUrl(`/decisions/${DECISION}`),
    plan: "#workflows",
    agents: portalUrl("/wiki/docs/concepts/agent-setup"),
    prove: "/method#prove",
} as const satisfies Record<RuleId, string>;

const { t } = useI18n();

const [
    { data: benchmarks },
    { data: plan },
    { data: rules },
    { data: specs },
    { data: decisions },
] = await Promise.all([
    useBenchmarks(),
    useWorkflowGlyph(PLAN),
    useRuleCounts(),
    useSpecTotal(),
    useDecisionReports(),
]);

const example = computed(() => decisions.value.find((report) => report.id === DECISION));

const hovered = ref<RuleId | null>(null);
const hover = (id: RuleId, event: PointerEvent) => {
    if (event.pointerType === "mouse") hovered.value = id;
};

/** Fetches and decodes the screenshots rule 1 previews before its card first opens. */
const warm = () => {
    for (const item of benchmarks.value.slice(0, 3)) {
        const image = new Image();
        image.src = item.screenshot;
        void image.decode().catch(() => undefined);
    }
};

const counted = computed((): Partial<Record<RuleId, string>> => {
    return {
        ...(benchmarks.value.length && {
            look: t("index.rules.look.proofCount", { count: benchmarks.value.length }),
        }),
        ...(rules.value && { prove: t("index.rules.prove.proofCount", rules.value) }),
    };
});

const principles = computed(() =>
    RULES.map((id) => ({
        id,
        to: PROOFS[id],
        carry: carried(`rule-${id}`),
        proof: counted.value[id] ?? t(`index.rules.${id}.proof`),
    })),
);
</script>
