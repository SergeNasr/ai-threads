import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BranchButton } from "./branch-button";

const meta: Meta<typeof BranchButton> = {
  component: BranchButton,
  title: "Message/BranchButton",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BranchButton>;

export const Default: Story = {
  args: {
    onClick: () => alert("Branch clicked!"),
    position: { top: 50, left: 100 },
  },
  render: (args) => (
    <div className="relative w-full h-64 bg-bg-secondary p-8">
      <p className="text-text-primary">
        Select some text to see the branch button appear. The button is positioned at: top{" "}
        {args.position.top}px, left {args.position.left}px
      </p>
      <BranchButton {...args} />
    </div>
  ),
};

export const DifferentPositions: Story = {
  render: () => (
    <div className="relative w-full h-96 bg-bg-secondary p-8 space-y-4">
      <BranchButton
        onClick={() => {}}
        position={{ top: 20, left: 50 }}
      />
      <BranchButton
        onClick={() => {}}
        position={{ top: 100, left: 200 }}
      />
      <BranchButton
        onClick={() => {}}
        position={{ top: 200, left: 350 }}
      />
    </div>
  ),
};
