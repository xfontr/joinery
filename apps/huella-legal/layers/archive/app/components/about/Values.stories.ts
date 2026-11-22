import type { Meta, StoryObj } from "@storybook/vue3-vite";

import AboutValues from "./Values.vue";

const meta: Meta<typeof AboutValues> = {
    component: AboutValues,
};

export default meta;

type Story = StoryObj<typeof AboutValues>;

export const Default: Story = {};
