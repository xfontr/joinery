import type { Meta, StoryObj } from "@storybook/vue3-vite";

import HomeHero from "./Hero.vue";

const meta: Meta<typeof HomeHero> = {
    component: HomeHero,
};

export default meta;

type Story = StoryObj<typeof HomeHero>;

export const Default: Story = {};
