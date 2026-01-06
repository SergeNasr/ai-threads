import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Breadcrumb } from "./breadcrumb";
import { Thread } from "@/lib/types";

const meta: Meta<typeof Breadcrumb> = {
  component: Breadcrumb,
  title: "Layout/Breadcrumb",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

const createMockThread = (
  id: string,
  parentId: string | null = null,
  branchContext: string | null = null,
  messages: Thread["messages"] = []
): Thread => ({
  id,
  parentId,
  parentMessageId: null,
  branchContext,
  status: "idle",
  messages,
  createdAt: Date.now(),
});

export const RootOnly: Story = {
  args: {
    ancestors: [],
    currentThread: createMockThread("root-1"),
    onNavigate: () => {},
  },
};

export const WithOneLevel: Story = {
  args: {
    ancestors: [
      createMockThread("root-1", null, null, [
        {
          id: "msg-1",
          threadId: "root-1",
          role: "user",
          content: "What is React?",
          createdAt: Date.now(),
        },
      ]),
    ],
    currentThread: createMockThread("child-1"),
    onNavigate: () => {},
  },
};

export const WithMultipleLevels: Story = {
  args: {
    ancestors: [
      createMockThread("root-1", null, null, [
        {
          id: "msg-1",
          threadId: "root-1",
          role: "user",
          content: "What is React?",
          createdAt: Date.now(),
        },
      ]),
      createMockThread("child-1", "root-1", "React is a JavaScript library", [
        {
          id: "msg-2",
          threadId: "child-1",
          role: "user",
          content: "Tell me more about hooks",
          createdAt: Date.now(),
        },
      ]),
    ],
    currentThread: createMockThread("child-2"),
    onNavigate: () => {},
  },
};

export const WithLongBranchContext: Story = {
  args: {
    ancestors: [
      createMockThread("root-1", null, null),
      createMockThread(
        "child-1",
        "root-1",
        "This is a very long branch context that should be truncated when displayed in the breadcrumb trail"
      ),
    ],
    currentThread: createMockThread("child-2"),
    onNavigate: () => {},
  },
};

export const Interactive: Story = {
  args: {
    ancestors: [
      createMockThread("root-1", null, null, [
        {
          id: "msg-1",
          threadId: "root-1",
          role: "user",
          content: "What is React?",
          createdAt: Date.now(),
        },
      ]),
      createMockThread("child-1", "root-1", "React hooks", [
        {
          id: "msg-2",
          threadId: "child-1",
          role: "user",
          content: "Explain useState",
          createdAt: Date.now(),
        },
      ]),
    ],
    currentThread: createMockThread("child-2"),
    onNavigate: (threadId) => {
      console.log("Navigate to:", threadId);
    },
  },
};
