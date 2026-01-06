import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tooltip } from "./tooltip";
import { Button } from "./button";

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  title: "UI/Tooltip",
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    delay: { control: "number" },
  },
  decorators: [
    (Story) => (
      <div className="p-16 flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Top: Story = {
  args: {
    content: "Tooltip on top",
    position: "top",
    children: <Button>Hover me</Button>,
  },
};

export const Bottom: Story = {
  args: {
    content: "Tooltip on bottom",
    position: "bottom",
    children: <Button>Hover me</Button>,
  },
};

export const Left: Story = {
  args: {
    content: "Tooltip on left",
    position: "left",
    children: <Button>Hover me</Button>,
  },
};

export const Right: Story = {
  args: {
    content: "Tooltip on right",
    position: "right",
    children: <Button>Hover me</Button>,
  },
};

export const AllPositions: Story = {
  render: () => (
    <div className="flex gap-8">
      <Tooltip content="Top" position="top">
        <Button variant="secondary">Top</Button>
      </Tooltip>
      <Tooltip content="Bottom" position="bottom">
        <Button variant="secondary">Bottom</Button>
      </Tooltip>
      <Tooltip content="Left" position="left">
        <Button variant="secondary">Left</Button>
      </Tooltip>
      <Tooltip content="Right" position="right">
        <Button variant="secondary">Right</Button>
      </Tooltip>
    </div>
  ),
};
