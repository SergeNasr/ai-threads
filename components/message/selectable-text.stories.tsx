import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SelectableText } from "./selectable-text";

const meta: Meta<typeof SelectableText> = {
  component: SelectableText,
  title: "Message/SelectableText",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SelectableText>;

export const Default: Story = {
  args: {
    onBranch: (text) => alert(`Branching with text: "${text}"`),
    children: (
      <p className="text-text-primary">
        This is a paragraph of text. Try selecting some text to see the branch button appear.
        You can select any portion of this text and click the branch button to create a new thread.
      </p>
    ),
  },
};

export const LongContent: Story = {
  args: {
    onBranch: (text) => alert(`Branching with text: "${text}"`),
    children: (
      <div className="text-text-primary space-y-4">
        <p>
          This is a longer piece of content with multiple paragraphs. You can select text from any
          paragraph to create a branch.
        </p>
        <p>
          The branch button will appear near your selection, allowing you to quickly create a new
          thread based on the selected text.
        </p>
        <p>
          This feature enables users to explore tangents and dive deeper into specific topics
          without losing the context of the main conversation.
        </p>
      </div>
    ),
  },
};

export const WithMarkdown: Story = {
  args: {
    onBranch: (text) => alert(`Branching with text: "${text}"`),
    children: (
      <div className="text-text-primary">
        <h2 className="text-xl font-semibold mb-2">Markdown Content</h2>
        <p>
          You can select text from <strong>bold</strong>, <em>italic</em>, or even{" "}
          <code className="bg-bg-tertiary px-1 rounded">code blocks</code>.
        </p>
        <ul className="list-disc list-inside mt-4">
          <li>Select text from lists</li>
          <li>Select text from headings</li>
          <li>Select any text to branch</li>
        </ul>
      </div>
    ),
  },
};
