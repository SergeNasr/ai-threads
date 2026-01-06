import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Textarea } from "./textarea";

const meta: Meta<typeof Textarea> = {
  component: Textarea,
  title: "UI/Textarea",
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    minRows: { control: "number" },
    maxRows: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: "Type your message...",
  },
};

export const WithMinRows: Story = {
  args: {
    placeholder: "Minimum 3 rows",
    minRows: 3,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled textarea",
    disabled: true,
  },
};

export const AutoExpanding: Story = {
  render: function Render() {
    const [value, setValue] = useState("");
    return (
      <div className="w-96">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type to see auto-expand (Cmd+Enter to submit)"
          minRows={1}
          maxRows={6}
          onSubmit={() => alert("Submitted!")}
        />
        <p className="text-text-tertiary text-xs mt-2">
          Press Cmd/Ctrl + Enter to trigger onSubmit
        </p>
      </div>
    );
  },
};
