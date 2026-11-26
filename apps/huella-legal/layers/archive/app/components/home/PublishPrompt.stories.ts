import type { Meta, StoryObj } from "@storybook/vue3-vite";

import HomePublishPrompt from "./PublishPrompt.vue";

const meta: Meta<typeof HomePublishPrompt> = {
    component: HomePublishPrompt,
};

export default meta;

type Story = StoryObj<typeof HomePublishPrompt>;

export const Default: Story = {};
