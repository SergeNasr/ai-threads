"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { threadEngine } from "@/lib/thread-engine";
import { type ThreadId, type MessageId } from "@/lib/types";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";

interface ThreadViewProps {
  threadId: ThreadId;
}

export function ThreadView({ threadId }: ThreadViewProps) {
  const { threads, addMessage, setActiveThread } = useStore();
  const thread = threads[threadId];

  useEffect(() => {
    setActiveThread(threadId);
  }, [threadId, setActiveThread]);

  if (!thread) {
    return (
      <div className="flex items-center justify-center h-full text-text-secondary">
        Thread not found
      </div>
    );
  }

  const handleSubmit = async (content: string) => {
    addMessage(threadId, "user", content);
    threadEngine.enqueue(threadId);
    await threadEngine.processQueue();
  };

  const handleBranch = (messageId: MessageId, selectedText: string) => {
    const childThreadId = threadEngine.branch(messageId, selectedText);
    setActiveThread(childThreadId);
  };

  const getInitialInputValue = () => {
    if (thread && thread.branchContext && thread.messages.length === 0) {
      return `> ${thread.branchContext}\n\n`;
    }
    return "";
  };

  return (
    <div className="flex flex-col h-full bg-bg-primary">
      <div className="flex-1 flex justify-center overflow-hidden">
        <div className="w-full max-w-3xl flex flex-col h-full">
          <MessageList
            messages={thread.messages}
            threadStatus={thread.status}
            onBranch={handleBranch}
          />
          <ChatInput
            threadId={threadId}
            onSubmit={handleSubmit}
            disabled={thread.status === "streaming"}
            initialValue={getInitialInputValue()}
          />
        </div>
      </div>
    </div>
  );
}
