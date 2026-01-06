import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RunningThreadsPanel } from "./running-threads-panel";
import { Thread, ThreadStatus } from "@/lib/types";

const meta: Meta<typeof RunningThreadsPanel> = {
  component: RunningThreadsPanel,
  title: "Layout/RunningThreadsPanel",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RunningThreadsPanel>;

const createMockThread = (
  id: string,
  status: ThreadStatus,
  branchContext: string | null = null,
  content: string = ""
): Thread => ({
  id,
  parentId: null,
  parentMessageId: null,
  branchContext,
  status,
  messages: content
    ? [
        {
          id: `msg-${id}`,
          threadId: id,
          role: "user" as const,
          content,
          createdAt: Date.now(),
        },
      ]
    : [],
  createdAt: Date.now(),
});

export const Empty: Story = {
  args: {
    threads: [],
    onSelect: () => {},
    onClose: () => {},
  },
};

export const SingleStreaming: Story = {
  args: {
    threads: [
      {
        thread: createMockThread("thread-1", "idle", null, "What is React?"),
        status: "streaming" as ThreadStatus,
      },
    ],
    onSelect: (threadId) => {
      console.log("Select thread:", threadId);
    },
    onClose: () => {
      console.log("Close panel");
    },
  },
};

export const MultipleThreads: Story = {
  args: {
    threads: [
      {
        thread: createMockThread(
          "thread-1",
          "idle",
          null,
          "Explain React hooks in detail"
        ),
        status: "streaming" as ThreadStatus,
      },
      {
        thread: createMockThread(
          "thread-2",
          "idle",
          "useState is a hook",
          "How does useState work?"
        ),
        status: "queued" as ThreadStatus,
      },
      {
        thread: createMockThread(
          "thread-3",
          "idle",
          null,
          "What are the best practices for React?"
        ),
        status: "streaming" as ThreadStatus,
      },
    ],
    onSelect: (threadId) => {
      console.log("Select thread:", threadId);
    },
    onClose: () => {
      console.log("Close panel");
    },
  },
};

export const WithLongContent: Story = {
  args: {
    threads: [
      {
        thread: createMockThread(
          "thread-1",
          "idle",
          "This is a very long branch context that should be truncated when displayed in the running threads panel",
          "Can you explain this concept in more detail?"
        ),
        status: "streaming" as ThreadStatus,
      },
      {
        thread: createMockThread(
          "thread-2",
          "idle",
          null,
          "This is a very long message content that should also be truncated properly in the panel display"
        ),
        status: "queued" as ThreadStatus,
      },
    ],
    onSelect: (threadId) => {
      console.log("Select thread:", threadId);
    },
    onClose: () => {
      console.log("Close panel");
    },
  },
};

export const MixedStatuses: Story = {
  args: {
    threads: [
      {
        thread: createMockThread("thread-1", "idle", null, "Question 1"),
        status: "streaming" as ThreadStatus,
      },
      {
        thread: createMockThread("thread-2", "idle", null, "Question 2"),
        status: "queued" as ThreadStatus,
      },
      {
        thread: createMockThread("thread-3", "idle", null, "Question 3"),
        status: "streaming" as ThreadStatus,
      },
      {
        thread: createMockThread("thread-4", "idle", null, "Question 4"),
        status: "queued" as ThreadStatus,
      },
    ],
    onSelect: (threadId) => {
      console.log("Select thread:", threadId);
    },
    onClose: () => {
      console.log("Close panel");
    },
  },
};
