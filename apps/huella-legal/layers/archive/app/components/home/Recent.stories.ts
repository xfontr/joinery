import type { Meta, StoryObj } from "@storybook/vue3-vite";

import HomeRecent from "./Recent.vue";

const article = (id: string, title: string, category: string): ArticleSummary => ({
    id,
    slug: `articulo-${id}`,
    title,
    publishedAt: "2024-03-12T09:00:00Z",
    authors: [{ id, slug: `autor-${id}`, name: "Lucía Fernández Prieto" }],
    category: { id, slug: `area-${id}`, name: category },
    tags: [],
    format: "articulo",
    readingMinutes: 12,
});

const meta: Meta<typeof HomeRecent> = {
    component: HomeRecent,
    args: {
        articles: [
            article("1", "La reforma del recurso de casación penal", "Derecho penal"),
            article(
                "2",
                "El despido por causas objetivas tras la última reforma",
                "Derecho laboral",
            ),
            article("3", "La protección de datos en el proceso civil", "Derecho civil"),
        ],
    },
};

export default meta;

type Story = StoryObj<typeof HomeRecent>;

export const Default: Story = {};
