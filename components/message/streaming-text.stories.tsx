import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StreamingText } from "./streaming-text";

const meta: Meta<typeof StreamingText> = {
  component: StreamingText,
  title: "Message/StreamingText",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StreamingText>;

export const Streaming: Story = {
  args: {
    content: "This is a streaming message that reveals word by word with a cursor animation.",
    isStreaming: true,
  },
};

export const Complete: Story = {
  args: {
    content: "This message has finished streaming and shows the complete content.",
    isStreaming: false,
  },
};

export const LongContent: Story = {
  args: {
    content:
      "This is a much longer streaming message that demonstrates how the streaming text component handles longer content. Each word appears gradually, creating a natural reading experience. The cursor animation provides visual feedback that more content is coming.",
    isStreaming: true,
  },
};

export const ShortContent: Story = {
  args: {
    content: "Short.",
    isStreaming: true,
  },
};
