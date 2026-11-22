import type { Work } from "./types/Work.ts";

export const WORK: readonly Work[] = [
    {
        slug: "huella-legal",
        name: "Huella Legal",
        title: "Huella",
        mark: "Legal",
        kind: "Law magazine",
        stage: "Redesign on staging",
        line: "A free law magazine, written by students, teachers and lawyers since 2020.",
        why: "The magazine publishes legal analysis for anyone curious, students first. The redesign makes a long case comment as easy to read on a phone as on paper.",
        story: [
            "The rebuild keeps every article, author and URL that readers and search engines already know. The reading itself is redesigned to look like an academic journal.",
        ],
        facts: ["105 articles", "42 authors", "14 topics"],
        countedOn: "29 Sep 2026",
        design: [
            { label: "Paper", value: "Warm ivory" },
            { label: "Type", value: "Georgia for reading, Montserrat for navigation" },
            { label: "Tone", value: "Academic journal" },
        ],
        screenshot: {
            file: "huella-legal.jpg",
            alt: "Huella Legal's new home page",
            caption: "The new home page, on staging.",
        },
        live: { href: "https://staging.huellalegal.com", label: "See the new site ↗" },
        decisions: [
            {
                id: "0028-huella-legal-urls-and-cutover",
                question: "Will old links still work after the move?",
                answer: "Yes. Every post, page, author and topic URL from the live site keeps its address or redirects to the new one.",
            },
            {
                id: "0030-huella-legal-rendering-hosting-and-cost",
                question: "Where will it be hosted, and at what cost?",
                answer: "Both candidate hosts were tried with real builds. With no traffic figures to go on, cost is written as a formula.",
            },
            {
                id: "0036-huella-legal-owns-its-design-system",
                question: "Should it share a design system with the other sites?",
                answer: "No. It keeps its own look, and the shared package was retired.",
            },
        ],
    },
    {
        slug: "marina-roustan",
        name: "Marina Roustan",
        title: "Marina",
        mark: "Roustan",
        kind: "Psychology practice",
        stage: "In design",
        line: "A clinical psychologist's practice in Barcelona.",
        why: "People looking for a therapist are often having a hard week. The new site is calm and clear, and getting in touch takes one form.",
        story: [
            "Marina Roustan is a clinical and forensic psychologist. Her current site runs on WordPress: a home page, her services, a short blog and a contact form.",
            "The rebuild keeps the words, the URLs and the look her patients know. The content moves into plain files next to the code.",
        ],
        facts: ["10 posts", "7 pages", "about 80 images"],
        countedOn: "15 Nov 2026",
        design: [
            { label: "Paper", value: "Pale blue with white bands" },
            { label: "Type", value: "Lato, in a light weight" },
            { label: "Tone", value: "Calm, with one call to action per page" },
        ],
        screenshot: {
            file: "marina-roustan.jpg",
            alt: "Marina Roustan's home page today, before the rebuild",
            caption: "Today's site, before the rebuild.",
        },
        live: { href: "https://marinaroustan.com", label: "See today's site ↗" },
        decisions: [
            {
                id: "0038-marina-roustan-discovery",
                question: "What's on the old site, and where does each URL go?",
                answer: "Every post, page and image was counted. Each URL keeps its path or redirects, so nothing that works today breaks.",
            },
        ],
    },
];

export const workFor = (slug: string): Work | undefined => WORK.find((item) => item.slug === slug);
