import type { Meta, StoryObj } from "@storybook/vue3-vite";

import AboutTopics from "./Topics.vue";

const meta: Meta<typeof AboutTopics> = {
    component: AboutTopics,
};

export default meta;

type Story = StoryObj<typeof AboutTopics>;

export const Default: Story = {};
