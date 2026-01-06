import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IconButton } from "./icon-button";

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2Z" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M1.724 1.053a.5.5 0 0 0-.714.545l1.403 4.85a.5.5 0 0 0 .397.354l5.69.953c.268.053.268.437 0 .49l-5.69.953a.5.5 0 0 0-.397.354l-1.403 4.85a.5.5 0 0 0 .714.545l13-6.5a.5.5 0 0 0 0-.894l-13-6.5Z" />
  </svg>
);

const meta: Meta<typeof IconButton> = {
  component: IconButton,
  title: "UI/IconButton",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Primary: Story = {
  args: {
    variant: "primary",
    icon: <SendIcon />,
    label: "Send message",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    icon: <PlusIcon />,
    label: "Add item",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    icon: <PlusIcon />,
    label: "Add item",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton size="sm" icon={<PlusIcon />} label="Small" />
      <IconButton size="md" icon={<PlusIcon />} label="Medium" />
      <IconButton size="lg" icon={<PlusIcon />} label="Large" />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <IconButton variant="primary" icon={<SendIcon />} label="Primary" />
      <IconButton variant="secondary" icon={<SendIcon />} label="Secondary" />
      <IconButton variant="ghost" icon={<SendIcon />} label="Ghost" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    icon: <SendIcon />,
    label: "Send message",
    disabled: true,
  },
};
