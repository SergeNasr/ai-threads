"use client";

import { type Message } from "@/lib/types";
import { SelectableText } from "./selectable-text";
import { MessageContent } from "./message-content";

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  onBranch: (selectedText: string) => void;
}

export const MessageBubble = ({
  message,
  isStreaming = false,
  onBranch,
}: MessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}
    >
      <div
        className={`max-w-[85%] rounded-lg px-4 py-3 ${
          isUser
            ? "bg-[var(--surface-user)]"
            : "bg-[var(--surface-assistant)]"
        }`}
      >
        <SelectableText onBranch={onBranch}>
          <MessageContent content={message.content} isStreaming={isStreaming} />
        </SelectableText>
      </div>
    </div>
  );
};
