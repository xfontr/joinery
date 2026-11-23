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
        :to="LINKS.benchmarks"
    >
        <p v-if="sites" class="font-mono text-sm/loose text-muted">{{ sites }}</p>
    </RuleSection>

    <RuleSection
        id="decide"
        :number="2"
        skill="decision-report"
        :count="decisions.length"
        :to="LINKS.decisions"
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
        :to="LINKS.agents"
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
import { isStudy } from "~/utils/work";

const LINKS = {
    benchmarks: portalUrl("/benchmarks"),
    decisions: portalUrl("/decisions"),
    agents: portalUrl("/wiki/docs/concepts/agent-setup"),
};

const DECISIONS = {
    comments: "0009-comment-discipline",
    console: "0032-console-output-policy",
    board: "0035-one-board-area-labels",
    visitor: "0040-developer-portal-visitor-structure",
} as const;

const { t } = useI18n();
useSeoMeta({ title: t("method.head"), description: t("method.lead") });

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

const [
    { data: benchmarks },
    { data: workflows },
    { data: work },
    { data: rules },
    { data: specs },
    { data: decisions },
] = await Promise.all([
    useBenchmarks(),
    useWorkflowTemplates(),
    useWorkList(),
    useRuleCounts(),
    useSpecTotal(),
    useDecisionReports(),
]);
const example = computed(() =>
    work.value.filter(isStudy).find((entry) => entry.slug === "huella-legal"),
);

const sites = computed(() => benchmarks.value.map((item) => item.title).join(" · "));
const templates = computed(() =>
    workflows.value.templates.map(({ id, title, summary }) => ({
        id,
        term: title,
        detail: summary,
    })),
);

const lessons = computed(() => workflows.value.lessons);
</script>
