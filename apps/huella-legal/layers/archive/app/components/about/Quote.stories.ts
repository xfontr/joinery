import type { Meta, StoryObj } from "@storybook/vue3-vite";

import AboutQuote from "./Quote.vue";

const meta: Meta<typeof AboutQuote> = {
    component: AboutQuote,
};

export default meta;

type Story = StoryObj<typeof AboutQuote>;

export const Default: Story = {};
