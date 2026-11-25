<template>
    <PageHero
        carry="hero-method"
        :title="$t('method.title')"
        :mark="$t('method.titleMark')"
        :lead="$t('method.lead')"
    />

    <UContainer class="page-grid">
        <RuleIndex />

        <div class="col-span-4 flex flex-col md:col-span-9">
            <RuleSection id="look" :to="LINKS.benchmarks">
                <p v-if="sites" class="max-w-xl font-mono text-meta text-muted">{{ sites }}</p>
            </RuleSection>

            <RuleSection id="decide" :to="LINKS.decisions">
                <DecisionQuestions :items="decisionItems" class="mt-4" />
            </RuleSection>

            <RuleSection id="plan" to="/agentic-workflows">
                <TermList :items="templates" class="mt-4" />
            </RuleSection>

            <RuleSection id="agents" :body-params="{ steps: PIPELINE.length }" :to="LINKS.agents">
                <TermList :items="pipeline" ordered grid class="mt-4" />
            </RuleSection>

            <RuleSection id="prove">
                <MethodChecks :specs :rules class="mt-4" />
            </RuleSection>

            <ULink
                v-if="example"
                :to="`/work/${example.slug}`"
                class="group flex flex-col gap-4 border-t border-accented pt-8"
            >
                <span class="text-title text-highlighted group-hover:text-primary">
                    {{ example.title }} <mark>{{ example.mark }}</mark>
                </span>
                <span class="text-lead">{{ $t("method.example.line") }}</span>
            </ULink>
        </div>
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
] = await Promise.all([
    useBenchmarks(),
    useWorkflowTemplates(),
    useWorkList(),
    useRuleCounts(),
    useSpecTotal(),
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
</script>
