<template>
    <UContainer as="section" class="flex flex-col gap-6 pt-10 pb-16 md:pt-20">
        <h1 class="font-display text-title text-highlighted md:text-statement">
            {{ $t("index.title") }} <mark>{{ $t("index.titleMark") }}</mark>
        </h1>
        <p class="max-w-2xl text-2xl text-highlighted">{{ $t("index.lead") }}</p>
    </UContainer>

    <UContainer as="section" @pointerenter.once="warm">
        <p class="pb-6 font-mono text-xs text-muted uppercase">{{ $t("index.rules.label") }}</p>
        <article
            v-for="(item, index) in principles"
            :key="item.id"
            class="grid gap-4 border-t border-accented py-10 md:grid-cols-12"
            @pointerenter="hover(item.id, $event)"
            @pointerleave="hovered = null"
        >
            <p class="font-display text-title text-primary md:col-span-2">{{ index + 1 }}</p>
            <div class="flex flex-col gap-4 md:col-span-7">
                <h2 class="font-display text-section text-highlighted" :style="item.carry">
                    {{ $t(`rules.${item.id}.title`) }}
                </h2>
                <p class="max-w-xl text-lg">{{ $t(`index.rules.${item.id}.line`) }}</p>
            </div>
            <ULink
                :to="item.to"
                class="self-end text-base text-highlighted underline decoration-primary underline-offset-4 md:col-span-3"
            >
                {{ item.proof }} →
            </ULink>
        </article>
        <CursorPreview v-slot="{ subject }" :subject="hovered">
            <BenchmarksPreview v-if="subject === 'look'" :benchmarks />
            <DecisionsPreview v-else-if="subject === 'decide' && example" :report="example" />
            <WorkflowPreview v-else-if="subject === 'plan' && plan" :map="plan" />
            <PipelinePreview v-else-if="subject === 'agents'" />
            <ChecksPreview v-else-if="subject === 'prove'" :specs :rules />
        </CursorPreview>
    </UContainer>

    <WorkflowTeaser />

    <WorkList />

    <UContainer as="section" class="grid gap-6 pt-20 md:grid-cols-3">
        <ULink
            v-for="item in DEEPER"
            :key="item.id"
            :to="item.to"
            class="flex flex-col gap-2 border-t border-default pt-5"
        >
            <span class="font-mono text-xs text-muted uppercase">
                {{ $t(`index.deeper.${item.id}.kicker`) }}
            </span>
            <span class="font-display text-3xl/tight text-highlighted" :style="item.carry">
                {{ $t(`index.deeper.${item.id}.title`) }} →
            </span>
        </ULink>
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

const DEEPER = [
    { id: "method", to: "/method", carry: carried("hero-method") },
    { id: "workflows", to: "/agentic-workflows", carry: carried("hero-workflows") },
    { id: "work", to: "/work", carry: carried("hero-work") },
] as const;

const { t } = useI18n();
useSeoMeta({ title: t("index.head"), description: t("index.lead") });

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
