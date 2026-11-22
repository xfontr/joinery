import type { Meta, StoryObj } from "@storybook/vue3-vite";

import AboutTeam from "./Team.vue";

const meta: Meta<typeof AboutTeam> = {
    component: AboutTeam,
};

export default meta;

type Story = StoryObj<typeof AboutTeam>;

export const Default: Story = {};
