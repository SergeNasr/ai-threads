import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Skeleton } from "./skeleton";

const meta: Meta<typeof Skeleton> = {
  component: Skeleton,
  title: "UI/Skeleton",
  tags: ["autodocs"],
  argTypes: {
    width: { control: "text" },
    height: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    width: 200,
    height: 20,
  },
};

export const Circle: Story = {
  args: {
    width: 48,
    height: 48,
    className: "rounded-full",
  },
};

export const Card: Story = {
  render: () => (
    <div className="flex gap-4 p-4 bg-bg-secondary rounded-md w-80">
      <Skeleton width={48} height={48} className="rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton width="60%" height={16} />
        <Skeleton width="100%" height={12} />
        <Skeleton width="80%" height={12} />
      </div>
    </div>
  ),
};

export const MessageList: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <div className="flex gap-3">
        <Skeleton width={32} height={32} className="rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton width="70%" height={14} />
          <Skeleton width="100%" height={14} />
          <Skeleton width="40%" height={14} />
        </div>
      </div>
      <div className="flex gap-3">
        <Skeleton width={32} height={32} className="rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton width="90%" height={14} />
          <Skeleton width="60%" height={14} />
        </div>
      </div>
    </div>
  ),
};
