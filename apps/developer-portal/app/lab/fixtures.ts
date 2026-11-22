import huellaShot from "./images/huella-legal.jpg";

export const intro = {
    title: ["Craft,", "amplified."],
    hello: "Websites for small publications and practices, and the tools that keep them running.",
    lead: "AI agents do the heavy lifting under rules written by hand, and every decision is made in the open. The result is for the people who read and use these sites, not for the machine.",
};

export const work = [
    {
        slug: "huella-legal",
        name: "Huella Legal",
        kind: "Law magazine",
        what: "An open-access law magazine, written by its community since 2020.",
        why: "Rigorous law that any curious reader can follow. The redesign makes a case comment as easy to read on a phone as in print, for students first.",
        stage: "Redesign on staging",
        cta: "See the new site ↗",
        href: "https://staging.huellalegal.com",
        shot: huellaShot,
    },
    {
        slug: "marina-roustan",
        name: "Marina Roustan",
        kind: "Psychology practice",
        what: "A clinical psychologist's practice in Barcelona.",
        why: "Someone looking for a therapist is often having a hard week. The rebuild replaces the old WordPress site with a calm, clear one, keeps every old link working, and puts getting in touch one form away.",
        stage: "In design",
        cta: "See today's site ↗",
        href: "https://marinaroustan.com",
        shot: null,
    },
    {
        slug: "wp-editor",
        name: "WP Editor",
        kind: "Editing tool",
        what: "A review desk for site-wide edits to a WordPress site.",
        why: "Hundreds of articles can be corrected at once without anyone losing control: every change is proposed, read as a diff, applied, and can be undone.",
        stage: "In use, runs on one computer",
        cta: "Read how it works",
        href: "/docs/apps/wp-editor/readme",
        shot: null,
    },
    {
        slug: "portal",
        name: "This portal",
        kind: "The workshop",
        what: "The open front door to everything above.",
        why: "Nothing here is hidden behind a pitch. The decisions, plans and checks are published as the work happens, so you can judge the process, not just the result.",
        stage: "Being redesigned, starting with this page",
        cta: "Open the developer view",
        href: "/",
        shot: null,
    },
];

export const method = [
    {
        title: "Look first",
        body: "Every design starts from award-juried sites, studied and measured, never from a template.",
        cta: "Read a benchmark",
        to: "/decisions/0039-developer-portal-benchmark",
    },
    {
        title: "Decide in writing",
        body: "Before anything is built, the open question gets a short written answer that anyone can read later.",
        cta: "Browse the decisions",
        to: "/decisions",
    },
    {
        title: "Plan the whole job",
        body: "Each project becomes a map of what has to happen, in what order, and what waits on what.",
        cta: "See a project's plan",
        to: "/workflows/huella-legal",
    },
    {
        title: "Agents build, rules decide",
        body: "AI agents write most of the code. Tests, lint rules and three automated reviewers decide what gets merged, and the rules grow from real mistakes.",
        cta: "How the agents are set up",
        to: "/docs/docs/concepts/agent-setup",
    },
];

/** The method page: each step told at the depth a curious reader will take. */
export const benchmark = {
    sources:
        "Twelve sites, shortlisted from 28 on Awwwards and Siteinspire, plus four held up as the bar.",
    sites: [
        "rauno.me",
        "linear.app/method",
        "primer.style",
        "carbondesignsystem.com",
        "bratiiev.com",
        "romainavalle.dev",
        "crl-2026",
        "martinfoucaut.com",
        "teamcafeteria.com",
        "tomdekoning.work",
        "brandonyasin.com",
        "supereightstudio.com",
    ],
    taken: [
        { what: "One sentence carries the first screen", seen: "8 of 12" },
        { what: "Lists of work as numbered rows, not cards", seen: "7 of 12" },
        { what: "One accent colour, spent on one job", seen: "11 of 12" },
        { what: "Nothing waits on animation to be read", seen: "2 failed it" },
    ],
};

export const decisions = [
    {
        question: "Will every old link to the magazine still work after the move?",
        answer: "Yes. Every post, page, author and topic address was listed from the live site and given a new home or a redirect.",
        id: "0028-huella-legal-urls-and-cutover",
    },
    {
        question: "Where should the new magazine run, and what will it cost?",
        answer: "Both candidate hosts were built against for real; cost is written as a formula, because no traffic figure existed to guess from.",
        id: "0030-huella-legal-rendering-hosting-and-cost",
    },
    {
        question: "Should the magazine share one design system with every other site?",
        answer: "No. Huella Legal owns its look; a shared package was retired rather than filled on speculation.",
        id: "0036-huella-legal-owns-its-design-system",
    },
    {
        question: "How does a visitor who doesn't write code enter this portal?",
        answer: "Straight into this view, with the developer view one click away. Measured against a 'choose your door' page, which cost every visitor a click.",
        id: "0040-developer-portal-visitor-structure",
    },
];

export const plan = {
    name: "Huella Legal's rebuild",
    stages: [
        {
            name: "Discovery",
            goal: "Know what the old site really holds.",
            blocks: ["Content audit", "URL inventory", "Feature inventory", "Hosting prototype"],
        },
        {
            name: "Design",
            goal: "One approved direction, drawn on real content.",
            blocks: ["Brand extraction", "Design tokens", "Design lab", "Design approval"],
        },
        {
            name: "Foundations",
            goal: "An app that builds, tests and deploys before any page exists.",
            blocks: ["App scaffold", "Test harness", "Preview deploys", "Content migration"],
        },
        {
            name: "Build",
            goal: "Every page the inventory lists.",
            blocks: ["Home page", "Search", "Contact form", "Images"],
        },
        {
            name: "Hardening",
            goal: "Fast, accessible and findable, measured.",
            blocks: ["Performance", "SEO and feeds"],
        },
        {
            name: "Launch",
            goal: "The domain moves and no old link breaks.",
            blocks: ["Go-live approval", "Domain cutover"],
        },
    ],
    note: "Each block names what it waits on, so nothing ships out of order. The plan is a file in the repo, the tickets are filed from it, and the next project inherits what this one learned.",
};

export const pipeline = [
    {
        step: "Pick",
        does: "Takes the next ticket and reads everything it points at.",
        stops: "the workspace isn't clean",
    },
    {
        step: "Plan",
        does: "A planner agent decides which files change, each copying an existing example.",
        stops: "the ticket needs a choice nobody has made",
    },
    {
        step: "Build",
        does: "An agent writes the change, then lint, types and tests run.",
        stops: "checks still fail after two fixes",
    },
    {
        step: "Review",
        does: "Three reviewers read it in parallel: architecture, correctness, tests.",
        stops: "a blocking finding survives two rounds",
    },
    {
        step: "Polish",
        does: "Comments are trimmed and docs checked against the code.",
        stops: "checks go red",
    },
    {
        step: "Ship",
        does: "Commits, opens the pull request, waits for CI to merge it.",
        stops: "CI fails after one repair",
    },
];

export const huella = {
    facts: [
        { label: "Articles", value: "105" },
        { label: "Authors", value: "42" },
        { label: "Topics", value: "14" },
        { label: "Plan", value: "79 of 82 tickets done" },
    ],
    factsNote: "Counted from the live site on 29 Sep 2026, and from the project's plan today.",
    story: [
        "Huella Legal began in 2020 as a free law magazine on WordPress: students, teachers and practitioners publishing analysis that any curious reader can follow.",
        "The rebuild keeps everything readers and search engines already know (every article, author and address) and redesigns the reading itself, as an academic journal rather than a blog template.",
    ],
    design: [
        { label: "Paper", value: "Warm ivory paper" },
        { label: "Type", value: "Georgia to read, Montserrat to navigate" },
        { label: "Tone", value: "An academic journal, not a law firm" },
    ],
};

/** D: each principle carries the proof that it is practised. */
export const principles = [
    {
        rule: "Look before drawing.",
        line: "No template. Every design starts from award-juried sites, studied and measured.",
        proof: "Twelve sites behind this portal's redesign",
        to: "/decisions/0039-developer-portal-benchmark",
    },
    {
        rule: "Write the decision down.",
        line: "Any question that could go either way gets a short answer anyone can read later.",
        proof: "Will every old link to Huella Legal still work? Yes; here's how",
        to: "/decisions/0028-huella-legal-urls-and-cutover",
    },
    {
        rule: "Plan the whole job.",
        line: "A project is a map of what has to happen and what waits on what, before the first ticket.",
        proof: "How every project is planned, just below",
        to: "#workflows",
    },
    {
        rule: "Let agents build. Let rules decide.",
        line: "AI agents write the code. Tests, lint rules and three reviewers decide what's merged.",
        proof: "How the agents are set up",
        to: "/docs/docs/concepts/agent-setup",
    },
    {
        rule: "Prove it, every time.",
        line: "Speed, accessibility and behaviour are checked by machines on every change, not promised.",
        proof: "Huella Legal scores 100 on Google PageSpeed, on mobile",
        to: "craft",
    },
];

/** E: the questions a visitor asks, in the order they ask them. */
export const questions = [
    {
        q: "What is this?",
        a: "The open workshop behind a handful of websites and the tools that keep them running.",
    },
    {
        q: "What's being made?",
        a: "A law magazine for students, a psychologist's practice, an editing desk for WordPress, and this portal.",
    },
    {
        q: "How is a whole project run?",
        a: "On one map that people and AI agents work from together.",
    },
    {
        q: "How does it get made?",
        a: "Look first, decide in writing, plan the whole job, then let AI agents build under hand-written rules.",
    },
    {
        q: "Can I check?",
        a: "Yes. Every decision, plan and review is published as it happens.",
    },
];

/** The workflows story: the feature told at a visitor's depth. */
export const workflows = {
    pitch: "One map that people and AI agents work from together.",
    lead: "Every project starts from a template that already knows the job: each block it needs, what each waits on, and the mistakes earlier projects made. The map says what can start now, files the work as tickets, and redraws itself as tickets close.",
    steps: [
        {
            title: "A template knows the job",
            body: "A website rebuild already holds every block such a project needs, from the content audit to the domain cutover, with what each one waits on.",
        },
        {
            title: "The map says what can start",
            body: "Order comes from what each block needs, not from phases. Anything with nothing left to wait on can begin today.",
        },
        {
            title: "Questions before tickets",
            body: "Work is filed only once nothing it depends on is undecided. Calls only a person can make are marked as theirs, and wait for them.",
        },
        {
            title: "Agents take what's ready",
            body: "AI agents pick up open tickets, the ones that unblock the most first. Each closed ticket moves the map forward.",
        },
        {
            title: "The next project learns",
            body: "What went wrong becomes a lesson in the template, with the ticket that taught it, so the next project starts already knowing.",
        },
    ],
    rules: [
        {
            rule: "Answer the questions before filing the work.",
            paid: "Build tickets were once filed the night before the final design (#208), and a newsletter provider was swapped after it was wired (#242 → #299).",
        },
        {
            rule: "Unknowns go first.",
            paid: "Hosting was decided on paper and changed five times (#186, #244, #302, #377).",
        },
        {
            rule: "A change of host is its own decision.",
            paid: "A hosting switch slipped in under a lint ticket and was reverted two days later (#377, #378).",
        },
        {
            rule: "Deploy work is checked on a real deploy.",
            paid: "Four bugs only a real deploy could show (#382, #387, #388, #395).",
        },
        {
            rule: "A blocked ticket can't be picked.",
            paid: "Otherwise an agent could start from a plan that went stale an hour earlier; the pick command reads the links live and refuses.",
        },
    ],
};

/** The craft: what "careful" means, in plain words, each with where to check it. */
export const craft = {
    title: "Careful, and measured.",
    lead: "Care that depends on someone remembering slips. Here it's checked by machines on every change, so it can't quietly go.",
    items: [
        {
            area: "Speed",
            claim: "Huella Legal scores 100 on Google PageSpeed, on mobile.",
            how: "Pages are prerendered, and the plan checks real readers' load times, not only a lab score.",
            cta: "Try it on a phone",
            to: "https://staging.huellalegal.com",
        },
        {
            area: "Accessibility",
            claim: "Every page of Huella Legal is tested against WCAG AA.",
            how: "A browser opens each page in the test suite, and a single violation fails the build.",
            cta: "The test approach",
            to: "/decisions/0037-huella-legal-e2e-and-visual-tooling",
        },
        {
            area: "Tests",
            claim: "419 test files, from one function to a whole page driven in a real browser.",
            how: "Coverage is measured on every run, and its floor is enforced in CI.",
            cta: "Coverage, project by project",
            to: "/coverage",
        },
        {
            area: "Rules in code",
            claim: "31 groups of lint rules, 9 of them written in-house.",
            how: "Switching a rule off needs a written reason, and every rule an agent trips is logged.",
            cta: "Which rules fire",
            to: "/telemetry",
        },
        {
            area: "Repository discipline",
            claim: "One gate checks every commit, push, agent edit and CI run.",
            how: "No build steps in shared packages, no hand-edited versions, no forgotten TODOs: a broken rule can't land.",
            cta: "The gate",
            to: "/docs/infrastructure/scripts/src/invariants/readme",
        },
        {
            area: "System design",
            claim: "Every app is split into layers that may only lean on the ones beneath.",
            how: "The boundaries are lint rules, so a shortcut across them fails before review.",
            cta: "How the pieces fit",
            to: "/graph",
        },
        {
            area: "Tool telemetry",
            claim: "Even the internal tools are measured.",
            how: "Every run of every repo script is logged, so a tool nobody uses gets noticed and retired.",
            cta: "Tooling usage",
            to: "/telemetry",
        },
        {
            area: "Observability",
            claim: "The apps report their errors and slow requests.",
            how: "Browser and server share one trace, so a slow click can be followed to the query behind it.",
            cta: "How it's wired",
            to: "/docs/packages/observability/readme",
        },
    ],
};
