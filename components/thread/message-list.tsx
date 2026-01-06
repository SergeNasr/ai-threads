"use client";

import { useEffect, useRef } from "react";
import { type Message } from "@/lib/types";
import { MessageBubble } from "@/components/message";

interface MessageListProps {
  messages: Message[];
  threadStatus: "idle" | "streaming" | "queued" | "error";
  onBranch: (messageId: string, selectedText: string) => void;
}

export function MessageList({
  messages,
  threadStatus,
  onBranch,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string | null>(null);
  const lastMessagesLengthRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const lastMessage = messages[messages.length - 1];
    const isNewMessage =
      lastMessage?.id !== lastMessageIdRef.current ||
      messages.length !== lastMessagesLengthRef.current;
    const isStreaming = threadStatus === "streaming";

    if (isNewMessage || isStreaming) {
      const scrollToBottom = () => {
        container.scrollTop = container.scrollHeight;
      };

      scrollToBottom();
      lastMessageIdRef.current = lastMessage?.id ?? null;
      lastMessagesLengthRef.current = messages.length;

      if (isStreaming) {
        const interval = setInterval(scrollToBottom, 100);
        return () => clearInterval(interval);
      }
    }
  }, [messages, threadStatus]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-6 py-4 space-y-6"
    >
      {messages.map((message, index) => {
        const isLastMessage = index === messages.length - 1;
        const isStreaming =
          isLastMessage &&
          threadStatus === "streaming" &&
          message.role === "assistant";

        return (
          <MessageBubble
            key={message.id}
            message={message}
            isStreaming={isStreaming}
            onBranch={(selectedText) => onBranch(message.id, selectedText)}
          />
        );
      })}
    </div>
  );
}
