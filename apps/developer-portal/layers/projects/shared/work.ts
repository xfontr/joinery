import type { Work } from "./types/Work.ts";

export const WORK: readonly Work[] = [
    {
        slug: "huella-legal",
        name: "Huella Legal",
        title: "Huella",
        mark: "Legal",
        kind: "Law magazine",
        line: "An open-access law magazine, written by its community since 2020.",
        why: "Rigorous law that any curious reader can follow. The redesign makes a case comment as easy to read on a phone as in print, for students first.",
        story: [
            "Huella Legal began in 2020 as a free law magazine on WordPress: students, teachers and practitioners publishing analysis that any curious reader can follow.",
            "The rebuild keeps everything readers and search engines already know (every article, author and address) and redesigns the reading itself, as an academic journal rather than a blog template.",
        ],
        facts: ["105 articles", "42 authors", "14 topics"],
        countedOn: "29 Sep 2026",
        design: [
            { label: "Paper", value: "Warm ivory paper" },
            { label: "Type", value: "Georgia to read, Montserrat to navigate" },
            { label: "Tone", value: "An academic journal, not a law firm" },
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
                question: "Will every old link to the magazine still work after the move?",
                answer: "Yes. Every post, page, author and topic address was listed from the live site and given a new home or a redirect.",
            },
            {
                id: "0030-huella-legal-rendering-hosting-and-cost",
                question: "Where should the new magazine run, and what will it cost?",
                answer: "Both candidate hosts were built against for real; cost is written as a formula, because no traffic figure existed to guess from.",
            },
            {
                id: "0036-huella-legal-owns-its-design-system",
                question: "Should the magazine share one design system with every other site?",
                answer: "No. Huella Legal owns its look; a shared package was retired rather than filled on speculation.",
            },
        ],
    },
    {
        slug: "marina-roustan",
        name: "Marina Roustan",
        title: "Marina",
        mark: "Roustan",
        kind: "Psychology practice",
        line: "A clinical psychologist's practice in Barcelona.",
        why: "Someone looking for a therapist is often having a hard week. The rebuild replaces the old WordPress site with a calm, clear one, keeps every old link working, and puts getting in touch one form away.",
        story: [
            "Marina Roustan is a clinical and forensic psychologist in Barcelona. Her practice's site runs on WordPress today: a home page, her services, a short blog and a contact form.",
            "The rebuild keeps every word and every address people already find, moves the content into plain files beside the code, and keeps the look patients recognise.",
        ],
        facts: ["10 posts", "7 pages", "about 80 images"],
        countedOn: "15 Nov 2026",
        design: [
            { label: "Paper", value: "Pale blue, with white bands" },
            { label: "Type", value: "Lato throughout, light to read" },
            { label: "Tone", value: "A calm practice, one call to action at a time" },
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
                question: "What does the old site hold, and what happens to each address?",
                answer: "Every post, page and image was counted from the live site. Each address keeps its path or redirects to its new one, and nothing a reader can reach today is lost.",
            },
        ],
    },
];

export const workFor = (slug: string): Work | undefined => WORK.find((item) => item.slug === slug);
