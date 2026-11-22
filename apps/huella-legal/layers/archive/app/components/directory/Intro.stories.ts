import type { Meta, StoryObj } from "@storybook/vue3-vite";

import DirectoryIntro from "./Intro.vue";

const meta: Meta<typeof DirectoryIntro> = {
    component: DirectoryIntro,
    args: { count: 120 },
};

export default meta;

type Story = StoryObj<typeof DirectoryIntro>;

export const Default: Story = {};
