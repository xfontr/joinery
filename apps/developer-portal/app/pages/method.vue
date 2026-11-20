<template>
    <section class="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-10 pb-12 md:px-10 md:pt-20">
        <h1 class="font-display text-section text-highlighted md:text-title lg:text-statement">
            Five rules, <mark>all automated</mark>
        </h1>
        <p class="max-w-2xl text-2xl text-highlighted">
            Every project here follows them. Each one is backed by a check that fails the build, a
            skill the agents load, or a public record.
        </p>
    </section>

    <section id="look" :class="SECTION">
        <header :class="RULE">
            <span class="font-display text-title text-primary">1</span>
            <h2 class="font-display text-section text-highlighted">Look before drawing.</h2>
        </header>
        <div class="flex flex-col gap-6 md:col-span-8">
            <p class="text-xl text-highlighted">
                I start each design from sites an awards jury already picked, and measure each one
                the same way: type, colour, layout.
            </p>
            <p :class="HELD">Skill: <code>benchmark</code>{{ sources }}</p>
            <p v-if="sites" class="font-mono text-sm/loose text-muted">{{ sites }}</p>
            <ULink to="/benchmarks" :class="MORE">All studies →</ULink>
        </div>
    </section>

    <section id="decide" :class="SECTION">
        <header :class="RULE">
            <span class="font-display text-title text-primary">2</span>
            <h2 class="font-display text-section text-highlighted">Write decisions down.</h2>
        </header>
        <div class="flex flex-col gap-6 md:col-span-8">
            <p class="text-xl text-highlighted">
                When a call could go either way, I write a short report: the question, the options,
                what was picked and why. The next person, or agent, reads it instead of asking
                again.
            </p>
            <p :class="HELD">Skill: <code>decision-report</code>{{ decided }}</p>
            <div class="flex flex-col">
                <ULink
                    v-for="item in DECISIONS"
                    :key="item.id"
                    :to="`/decisions/${item.id}`"
                    class="group flex flex-col gap-2 border-t border-default py-5"
                >
                    <span class="font-display text-2xl text-highlighted group-hover:text-primary">
                        {{ item.question }}
                    </span>
                    <span class="max-w-xl text-base text-muted">{{ item.answer }}</span>
                </ULink>
            </div>
            <ULink to="/decisions" :class="MORE">All decisions →</ULink>
        </div>
    </section>

    <section id="plan" :class="SECTION">
        <header :class="RULE">
            <span class="font-display text-title text-primary">3</span>
            <h2 class="font-display text-section text-highlighted">Plan the whole job.</h2>
        </header>
        <div class="flex flex-col gap-6 md:col-span-8">
            <p class="text-xl text-highlighted">
                Each project starts from a template with every task the job needs, what each one
                waits on, and what went wrong last time.
            </p>
            <p v-if="planned" :class="HELD">{{ planned }}</p>
            <ul class="flex flex-col">
                <li
                    v-for="template in templates"
                    :key="template.id"
                    class="grid gap-1 border-t border-default py-4 sm:grid-cols-3"
                >
                    <span class="font-display text-2xl text-highlighted">{{ template.title }}</span>
                    <span class="text-base sm:col-span-2">{{ template.summary }}</span>
                </li>
            </ul>
            <ULink to="/agentic-workflows" :class="MORE">Agentic workflows →</ULink>
        </div>
    </section>

    <section id="agents" :class="SECTION">
        <header :class="RULE">
            <span class="font-display text-title text-primary">4</span>
            <h2 class="font-display text-section text-highlighted">Let agents write the code.</h2>
        </header>
        <div class="flex flex-col gap-6 md:col-span-8">
            <p class="text-xl text-highlighted">
                An agent takes a ticket from plan to merge, and no person reads the code. Any of the
                {{ PIPELINE.length }} steps can stop and ask me.
            </p>
            <ol class="flex flex-col">
                <li
                    v-for="item in PIPELINE"
                    :key="item.step"
                    class="grid gap-1 border-t border-default py-4 sm:grid-cols-4"
                >
                    <span class="font-display text-2xl text-highlighted">{{ item.step }}</span>
                    <span class="text-base sm:col-span-3">{{ item.does }}</span>
                </li>
            </ol>
            <ULink to="/wiki/docs/concepts/agent-setup" :class="MORE">Agent setup →</ULink>
        </div>
    </section>

    <section id="prove" :class="SECTION">
        <header :class="RULE">
            <span class="font-display text-title text-primary">5</span>
            <h2 class="font-display text-section text-highlighted">Check every change.</h2>
        </header>
        <div class="flex flex-col gap-6 md:col-span-8">
            <p class="text-xl text-highlighted">These run on every push and again in CI.</p>
            <ul class="flex flex-col">
                <li
                    v-for="item in checks"
                    :key="item.area"
                    class="grid gap-2 border-t border-default py-5 sm:grid-cols-4"
                >
                    <span class="font-mono text-xs text-muted uppercase">{{ item.area }}</span>
                    <div class="flex flex-col gap-2 sm:col-span-3">
                        <span class="font-display text-2xl text-highlighted">{{ item.claim }}</span>
                        <span class="text-base">{{ item.how }}</span>
                        <ULink :to="item.to" :class="MORE">{{ item.cta }} →</ULink>
                    </div>
                </li>
            </ul>
        </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 pt-6 md:px-10">
        <ULink
            :to="`/work/${example.slug}`"
            class="group flex flex-col gap-2 border-t border-accented pt-10"
        >
            <span class="font-mono text-xs text-muted uppercase">Case study</span>
            <span class="font-display text-title text-highlighted group-hover:text-primary">
                {{ example.title }} <mark>{{ example.mark }}</mark> →
            </span>
            <span class="text-lg">A law magazine rebuilt with these five rules.</span>
        </ULink>
    </section>
</template>

<script setup lang="ts">
import { workFor } from "#layers/projects/shared/work.ts";
import { lessonCount } from "#layers/workflows/shared/workflows.ts";

definePageMeta({ layout: "visitor" });
useHead({ title: "Method" });

const SECTION =
    "mx-auto grid max-w-6xl gap-8 border-t border-accented px-4 py-14 md:grid-cols-12 md:px-10";
const RULE = "flex items-baseline gap-4 md:col-span-4 md:flex-col md:items-start";
const HELD = "font-mono text-sm text-muted";
const MORE = "self-start text-primary underline underline-offset-4";

const IN_HOUSE = "monorepo/";

const example = workFor("huella-legal")!;

const DECISIONS = [
    {
        question: "How much should a code comment say?",
        answer: "One fact the code can't show, in one sentence.",
        id: "0009-comment-discipline",
    },
    {
        question: "Can a stray console message reach production?",
        answer: "No. Any console output fails the build, in the source and in tests.",
        id: "0032-console-output-policy",
    },
    {
        question: "Where is work tracked?",
        answer: "On one GitHub board for every project, with a label per area.",
        id: "0035-one-board-area-labels",
    },
    {
        question: "Where does someone who doesn't code land on this site?",
        answer: "Here, in the visitor view. The developer view is one click away.",
        id: "0040-developer-portal-visitor-structure",
    },
];

const PIPELINE = [
    { step: "Pick", does: "Takes the next ticket and reads everything it links to." },
    { step: "Plan", does: "Lists the files to change, each copied from an existing example." },
    { step: "Build", does: "Writes the change, then runs lint, types and tests." },
    { step: "Review", does: "Three agents review architecture, correctness and tests at once." },
    { step: "Polish", does: "Trims comments and checks the docs still match the code." },
    { step: "Ship", does: "Opens the pull request and merges it once CI passes." },
];

const [{ data: benchmarks }, { data: workflows }, { data: metrics }, { data: usage }] =
    await Promise.all([
        useBenchmarks(),
        useWorkflows(),
        useSnapshot("metrics"),
        useSnapshot("usage"),
    ]);
const decisions = useDecisionReports();

const sources = computed(() =>
    benchmarks.value.length ? ` · ${benchmarks.value.length} sites studied so far.` : "",
);
const sites = computed(() => benchmarks.value.map((item) => item.title).join(" · "));

const decided = computed(() =>
    decisions.value.length ? ` · ${decisions.value.length} written so far.` : "",
);

const templates = computed(() =>
    workflows.value.templates.filter((template) => template.capabilities.length),
);
const planned = computed(() => {
    const lessons = lessonCount(workflows.value.templates);
    return lessons ? `${lessons} lessons from past projects so far.` : "";
});

const specs = computed(() => {
    const projects = metrics.value?.metrics?.projects;
    return projects?.length ? projects.reduce((sum, project) => sum + project.specs, 0) : null;
});

const rules = computed(() => {
    const all = usage.value?.usage?.lint.rules;
    if (!all) return null;
    const enabled = Object.entries(all).filter(([, rule]) => rule.enabled);
    return enabled.length
        ? {
              enabled: enabled.length,
              inHouse: enabled.filter(([name]) => name.startsWith(IN_HOUSE)).length,
          }
        : null;
});

const checks = computed(() => [
    {
        area: "Tests",
        claim: specs.value
            ? `${specs.value} test files, from single functions to full pages in a real browser.`
            : "Tests, from single functions to full pages in a real browser.",
        how: "If coverage drops below the minimum, the build fails.",
        cta: "Coverage by project",
        to: "/coverage",
    },
    {
        area: "Accessibility",
        claim: "Pages are tested against WCAG AA in a real browser.",
        how: "One violation fails the build.",
        cta: "The shared test kit",
        to: "/wiki/packages/configs/readme",
    },
    {
        area: "Lint rules",
        claim: rules.value
            ? `${rules.value.enabled} lint rules on, ${rules.value.inHouse} of them written for this repo.`
            : "Lint rules, some written for this repo.",
        how: "Turning one off needs a written reason.",
        cta: "Which rules fire most",
        to: "/telemetry",
    },
    {
        area: "Repository",
        claim: "Repo-wide rules are checked on every commit, push and CI run.",
        how: "No hand-edited version numbers, no leftover TODOs.",
        cta: "The checks",
        to: "/wiki/infrastructure/scripts/src/invariants/readme",
    },
    {
        area: "System design",
        claim: "Each app is split into layers, and a layer can only use the ones below it.",
        how: "Crossing a boundary is a lint error.",
        cta: "Dependency graph",
        to: "/graph",
    },
    {
        area: "Observability",
        claim: "The apps report their errors and slow requests.",
        how: "A slow click can be traced to the query behind it.",
        cta: "Observability setup",
        to: "/wiki/packages/observability/readme",
    },
]);
</script>
