import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MessageBubble } from "./message-bubble";
import { type Message } from "@/lib/types";

const meta: Meta<typeof MessageBubble> = {
  component: MessageBubble,
  title: "Message/MessageBubble",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MessageBubble>;

const createMessage = (
  role: "user" | "assistant",
  content: string,
  id = "1"
): Message => ({
  id,
  threadId: "thread-1",
  role,
  content,
  createdAt: Date.now(),
});

export const UserMessage: Story = {
  args: {
    message: createMessage(
      "user",
      "This is a user message. It appears on the right side with a user-specific background color."
    ),
    isStreaming: false,
    onBranch: (text) => alert(`Branching with: "${text}"`),
  },
};

export const AssistantMessage: Story = {
  args: {
    message: createMessage(
      "assistant",
      "This is an assistant message. It appears on the left side with an assistant-specific background color."
    ),
    isStreaming: false,
    onBranch: (text) => alert(`Branching with: "${text}"`),
  },
};

export const StreamingAssistant: Story = {
  args: {
    message: createMessage(
      "assistant",
      "This is a streaming assistant message. The content appears word by word with a cursor animation."
    ),
    isStreaming: true,
    onBranch: (text) => alert(`Branching with: "${text}"`),
  },
};

export const WithMarkdown: Story = {
  args: {
    message: createMessage(
      "assistant",
      `# Markdown Support

This message demonstrates **markdown** rendering:

- Lists
- *Formatting*
- \`Code blocks\`

> Blockquotes work too!`
    ),
    isStreaming: false,
    onBranch: (text) => alert(`Branching with: "${text}"`),
  },
};

export const Conversation: Story = {
  render: () => (
    <div className="w-full max-w-2xl mx-auto space-y-6 p-4 bg-bg-primary">
      <MessageBubble
        message={createMessage(
          "user",
          "Can you explain how React hooks work?",
          "1"
        )}
        onBranch={(text) => alert(`Branching with: "${text}"`)}
      />
      <MessageBubble
        message={createMessage(
          "assistant",
          `# React Hooks Explained

React hooks are functions that let you use state and other React features in functional components.

## Common Hooks

- **useState**: Manages component state
- **useEffect**: Handles side effects
- **useContext**: Accesses React context

Hooks must be called at the top level of your component, not inside loops or conditions.`,
          "2"
        )}
        onBranch={(text) => alert(`Branching with: "${text}"`)}
      />
      <MessageBubble
        message={createMessage(
          "user",
          "Thanks! Can you give me an example of useState?",
          "3"
        )}
        onBranch={(text) => alert(`Branching with: "${text}"`)}
      />
      <MessageBubble
        message={createMessage(
          "assistant",
          `Here's a simple useState example:

\`\`\`javascript
const [count, setCount] = useState(0);

return (
  <button onClick={() => setCount(count + 1)}>
    Count: {count}
  </button>
);
\`\`\`

The \`useState\` hook returns an array with the current state value and a function to update it.`,
          "4"
        )}
        isStreaming={true}
        onBranch={(text) => alert(`Branching with: "${text}"`)}
      />
    </div>
  ),
};
