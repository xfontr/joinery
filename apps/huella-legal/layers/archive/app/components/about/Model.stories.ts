import type { Meta, StoryObj } from "@storybook/vue3-vite";

import AboutModel from "./Model.vue";

const meta: Meta<typeof AboutModel> = {
    component: AboutModel,
};

export default meta;

type Story = StoryObj<typeof AboutModel>;

export const Default: Story = {};
