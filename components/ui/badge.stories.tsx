import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "./badge";

const meta: Meta<typeof Badge> = {
  component: Badge,
  title: "UI/Badge",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "streaming", "queued", "error"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    variant: "default",
    children: "Default",
  },
};

export const Streaming: Story = {
  args: {
    variant: "streaming",
    children: "Streaming",
  },
};

export const Queued: Story = {
  args: {
    variant: "queued",
    children: "Queued",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    children: "Error",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="streaming">Streaming</Badge>
      <Badge variant="queued">Queued</Badge>
      <Badge variant="error">Error</Badge>
    </div>
  ),
};
