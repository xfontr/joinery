<template>
    <PageHero
        carry="hero-method"
        :title="$t('method.title')"
        :mark="$t('method.titleMark')"
        :lead="$t('method.lead')"
    />

    <RuleSection
        id="look"
        :number="1"
        skill="benchmark"
        :count="benchmarks.length"
        to="/benchmarks"
    >
        <p v-if="sites" class="font-mono text-sm/loose text-muted">{{ sites }}</p>
    </RuleSection>

    <RuleSection
        id="decide"
        :number="2"
        skill="decision-report"
        :count="decisions.length"
        to="/decisions"
    >
        <DecisionQuestions :items="decisionItems" />
    </RuleSection>

    <RuleSection id="plan" :number="3" :count="lessons" to="/agentic-workflows">
        <TermList :items="templates" />
    </RuleSection>

    <RuleSection
        id="agents"
        :number="4"
        :body-params="{ steps: PIPELINE.length }"
        to="/wiki/docs/concepts/agent-setup"
    >
        <TermList :items="pipeline" ordered wide />
    </RuleSection>

    <RuleSection id="prove" :number="5">
        <MethodChecks :specs :rules />
    </RuleSection>

    <UContainer v-if="example" as="section" class="pt-6">
        <ULink
            :to="`/work/${example.slug}`"
            class="group flex flex-col gap-2 border-t border-accented pt-10"
        >
            <span class="font-mono text-xs text-muted uppercase">
                {{ $t("method.example.kicker") }}
            </span>
            <span class="font-display text-title text-highlighted group-hover:text-primary">
                {{ example.title }} <mark>{{ example.mark }}</mark> →
            </span>
            <span class="text-lg">{{ $t("method.example.line") }}</span>
        </ULink>
    </UContainer>
</template>

<script setup lang="ts">
import { isStudy } from "#layers/projects/app/utils/work.ts";
import { specTotal } from "#layers/snapshot/app/utils/metrics.ts";
import { ruleCounts } from "#layers/telemetry/shared/lintUsage.ts";
import { lessonCount } from "#layers/workflows/shared/workflows.ts";

definePageMeta({ layout: "visitor" });

const DECISIONS = {
    comments: "0009-comment-discipline",
    console: "0032-console-output-policy",
    board: "0035-one-board-area-labels",
    visitor: "0040-developer-portal-visitor-structure",
} as const;

const { t } = useI18n();
useHead({ title: t("method.head") });

const decisionItems = Object.entries(DECISIONS).map(([key, id]) => ({
    id,
    question: t(`method.decide.decisions.${key}.question`),
    answer: t(`method.decide.decisions.${key}.answer`),
}));
const pipeline = PIPELINE.map((id) => ({
    id,
    term: t(`method.agents.pipeline.${id}.step`),
    detail: t(`method.agents.pipeline.${id}.does`),
}));

const [{ data: benchmarks }, { data: workflows }, { data: work }] = await Promise.all([
    useBenchmarks(),
    useWorkflows(),
    useWorkList(),
]);
const example = computed(() =>
    work.value.filter(isStudy).find((entry) => entry.slug === "huella-legal"),
);
const decisions = useDecisionReports();

const sites = computed(() => benchmarks.value.map((item) => item.title).join(" · "));
const templates = computed(() =>
    workflows.value.templates
        .filter((template) => template.capabilities.length)
        .map(({ id, title, summary }) => ({ id, term: title, detail: summary })),
);
const specs = specTotal(metricsArtifact()?.projects);
const rules = ruleCounts(usageArtifact()?.lint);

const lessons = computed(() => lessonCount(workflows.value.templates));
</script>
