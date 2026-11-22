import type { Meta, StoryObj } from "@storybook/vue3-vite";

import DirectoryPrinciples from "./Principles.vue";

const meta: Meta<typeof DirectoryPrinciples> = {
    component: DirectoryPrinciples,
};

export default meta;

type Story = StoryObj<typeof DirectoryPrinciples>;

export const Default: Story = {};
