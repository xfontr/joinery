<template>
    <section class="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-10 pb-12 md:px-10 md:pt-20">
        <p class="font-mono text-xs text-muted uppercase">Method</p>
        <h1 class="font-display text-section text-highlighted md:text-title lg:text-statement">
            Five rules, <mark>and what enforces them.</mark>
        </h1>
        <p class="max-w-2xl text-2xl text-highlighted">
            The same rules run every project here. Each one is held by something in the repo, not by
            memory: a skill an agent follows, a check that fails the build, a record anyone can
            read.
        </p>
    </section>

    <section id="look" :class="SECTION">
        <header :class="RULE">
            <span class="font-display text-title text-primary">1</span>
            <h2 class="font-display text-section text-highlighted">Look before drawing.</h2>
        </header>
        <div class="flex flex-col gap-6 md:col-span-8">
            <p class="text-xl text-highlighted">
                No template. A design starts from sites a jury already rated, each captured and
                measured on the same dimensions: type, colour, layout, what a reader takes away.
            </p>
            <p :class="HELD">Held by the <code>benchmark</code> skill. {{ sources }}</p>
            <p v-if="sites" class="font-mono text-sm/loose text-muted">{{ sites }}</p>
            <ULink to="/benchmarks" :class="MORE">Every study, site by site →</ULink>
        </div>
    </section>

    <section id="decide" :class="SECTION">
        <header :class="RULE">
            <span class="font-display text-title text-primary">2</span>
            <h2 class="font-display text-section text-highlighted">Write the decision down.</h2>
        </header>
        <div class="flex flex-col gap-6 md:col-span-8">
            <p class="text-xl text-highlighted">
                A question that could go either way gets a short report: what was asked, what was
                tried, what was chosen and why. The next person, or agent, reads it instead of
                asking again.
            </p>
            <p :class="HELD">Held by the <code>decision-report</code> skill. {{ decided }}</p>
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
            <ULink to="/decisions" :class="MORE">Every decision →</ULink>
        </div>
    </section>

    <section id="plan" :class="SECTION">
        <header :class="RULE">
            <span class="font-display text-title text-primary">3</span>
            <h2 class="font-display text-section text-highlighted">Plan the whole job.</h2>
        </header>
        <div class="flex flex-col gap-6 md:col-span-8">
            <p class="text-xl text-highlighted">
                A project starts from a template that already holds every block such a job needs,
                what each waits on, and what went wrong the last time.
            </p>
            <p :class="HELD">Held by the workflow templates. {{ planned }}</p>
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
            <ULink to="/agentic-workflows" :class="MORE">How a project runs on its map →</ULink>
        </div>
    </section>

    <section id="agents" :class="SECTION">
        <header :class="RULE">
            <span class="font-display text-title text-primary">4</span>
            <h2 class="font-display text-section text-highlighted">
                Let agents build. Let rules decide.
            </h2>
        </header>
        <div class="flex flex-col gap-6 md:col-span-8">
            <p class="text-xl text-highlighted">
                AI agents take a ticket from plan to merge with no person reading the code, and
                {{ PIPELINE.length }} chances to stop and ask for one.
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
            <ULink to="/wiki/docs/concepts/agent-setup" :class="MORE">
                How the agents are set up →
            </ULink>
        </div>
    </section>

    <section id="prove" :class="SECTION">
        <header :class="RULE">
            <span class="font-display text-title text-primary">5</span>
            <h2 class="font-display text-section text-highlighted">Prove it, every time.</h2>
        </header>
        <div class="flex flex-col gap-6 md:col-span-8">
            <p class="text-xl text-highlighted">
                Care that depends on someone remembering slips. Here machines check it on every
                change, so it can't quietly go.
            </p>
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
</template>

<script setup lang="ts">
definePageMeta({ layout: "visitor" });
useHead({ title: "Method" });

const SECTION =
    "mx-auto grid max-w-6xl gap-8 border-t border-accented px-4 py-14 md:grid-cols-12 md:px-10";
const RULE = "flex items-baseline gap-4 md:col-span-4 md:flex-col md:items-start";
const HELD = "font-mono text-sm text-muted";
const MORE = "self-start text-primary underline underline-offset-4";

const IN_HOUSE = "monorepo/";

const DECISIONS = [
    {
        question: "How much should a code comment say?",
        answer: "One fact the code can't show, in one sentence. A skill trims the rest before anything is committed.",
        id: "0009-comment-discipline",
    },
    {
        question: "Can a stray console message reach production?",
        answer: "No. Console output fails the pipeline, in the source and in every test run.",
        id: "0032-console-output-policy",
    },
    {
        question: "Where is work tracked across every project?",
        answer: "On one permanent board, with area labels and milestones, instead of a board per app.",
        id: "0035-one-board-area-labels",
    },
    {
        question: "How does a visitor who doesn't write code enter this portal?",
        answer: "Straight into the visitor view, with the developer view one click away.",
        id: "0040-developer-portal-visitor-structure",
    },
];

const PIPELINE = [
    { step: "Pick", does: "Takes the next ticket and reads everything it points at." },
    {
        step: "Plan",
        does: "A planner agent decides which files change, each copying an existing example.",
    },
    { step: "Build", does: "An agent writes the change, then lint, types and tests run." },
    {
        step: "Review",
        does: "Three reviewers read it in parallel: architecture, correctness, tests.",
    },
    { step: "Polish", does: "Comments are trimmed and docs checked against the code." },
    { step: "Ship", does: "Commits, opens the pull request, waits for CI to merge it." },
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
    benchmarks.value.length ? `${benchmarks.value.length} sites studied so far.` : "",
);
const sites = computed(() => benchmarks.value.map((item) => item.title).join(" · "));

const decided = computed(() =>
    decisions.value.length ? `${decisions.value.length} written so far.` : "",
);

const templates = computed(() =>
    workflows.value.templates.filter((template) => template.capabilities.length),
);
const lessons = computed(() =>
    templates.value.reduce(
        (sum, template) =>
            sum +
            [...template.capabilities, ...template.types].reduce(
                (count, block) => count + block.lessons.length,
                0,
            ),
        0,
    ),
);
const planned = computed(() =>
    lessons.value
        ? `${lessons.value} lessons from past projects are already written into them.`
        : "",
);

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
            ? `${specs.value} test files, from one function to a whole page in a real browser.`
            : "Tests from one function to a whole page in a real browser.",
        how: "Coverage is measured on every run, and its floor is enforced in CI.",
        cta: "Coverage, project by project",
        to: "/coverage",
    },
    {
        area: "Accessibility",
        claim: "Pages are checked against WCAG AA in a real browser.",
        how: "The end-to-end kit every app shares runs the check, and one violation fails the run.",
        cta: "The shared test kit",
        to: "/wiki/packages/configs/readme",
    },
    {
        area: "Rules in code",
        claim: rules.value
            ? `${rules.value.enabled} lint rules switched on, ${rules.value.inHouse} of them written in-house.`
            : "Lint rules decide what lands, some of them written in-house.",
        how: "Switching a rule off needs a written reason, and every rule an agent trips is logged.",
        cta: "Which rules fire",
        to: "/telemetry",
    },
    {
        area: "Repository",
        claim: "One gate checks every commit, push, agent edit and CI run.",
        how: "No build steps in shared packages, no hand-edited versions, no forgotten TODOs.",
        cta: "The gate",
        to: "/wiki/infrastructure/scripts/src/invariants/readme",
    },
    {
        area: "System design",
        claim: "Every app is split into layers that may only lean on the ones beneath.",
        how: "The boundaries are lint rules, so a shortcut across them fails before review.",
        cta: "How the pieces fit",
        to: "/graph",
    },
    {
        area: "Observability",
        claim: "The apps report their errors and slow requests.",
        how: "Browser and server share one trace, so a slow click can be followed to the query behind it.",
        cta: "How it's wired",
        to: "/wiki/packages/observability/readme",
    },
]);
</script>
