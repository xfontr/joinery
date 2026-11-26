import type { Meta, StoryObj } from "@storybook/vue3-vite";

import SubjectsSectionNav from "./SectionNav.vue";

const meta: Meta<typeof SubjectsSectionNav> = {
    component: SubjectsSectionNav,
    args: {
        index: {
            subjects: [
                { value: { id: "1", slug: "derecho-penal", name: "Derecho penal" }, count: 24 },
            ],
            formats: [
                { value: "articulo", count: 40 },
                { value: "tfg-tfm", count: 6 },
            ],
            topics: [
                { value: { id: "2", slug: "prision", name: "Prisión" }, count: 3 },
                { value: { id: "3", slug: "teletrabajo", name: "Teletrabajo" }, count: 1 },
            ],
        },
    },
};

export default meta;

type Story = StoryObj<typeof SubjectsSectionNav>;

export const Default: Story = {};
