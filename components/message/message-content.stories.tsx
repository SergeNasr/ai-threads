import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MessageContent } from "./message-content";

const meta: Meta<typeof MessageContent> = {
  component: MessageContent,
  title: "Message/MessageContent",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MessageContent>;

export const PlainText: Story = {
  args: {
    content: "This is a simple plain text message.",
    isStreaming: false,
  },
};

export const WithMarkdown: Story = {
  args: {
    content: `# Heading 1

This is a paragraph with **bold text** and *italic text*.

## Heading 2

- List item 1
- List item 2
- List item 3

### Heading 3

Here's some \`inline code\` and a [link](https://example.com).

\`\`\`javascript
const code = "block";
console.log(code);
\`\`\`

> This is a blockquote with some important information.`,
    isStreaming: false,
  },
};

export const Streaming: Story = {
  args: {
    content: `# Streaming Message

This message is currently streaming. Words appear gradually with a cursor animation.

## Features

- Token-by-token reveal
- Cursor animation
- Markdown support`,
    isStreaming: true,
  },
};

export const LongContent: Story = {
  args: {
    content: `# Long Form Content

This demonstrates how the message content component handles longer form content with multiple sections.

## Section 1

This is the first section with some detailed information. It contains multiple paragraphs and various markdown elements.

## Section 2

Here's another section with:

1. Numbered lists
2. More content
3. Additional items

### Subsection

And even subsections with **bold** and *italic* text.`,
    isStreaming: false,
  },
};
