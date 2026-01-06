"use client";

import { Thread } from "@/lib/types";
import { MessageBubble } from "@/components/message";

interface ParentThreadPreviewProps {
  thread: Thread | null;
}

export function ParentThreadPreview({ thread }: ParentThreadPreviewProps) {
  if (!thread) return null;

  return (
    <div className="w-80 shrink-0 border-r border-border-subtle bg-surface-dimmed overflow-y-auto">
      <div className="p-4">
        <h3 className="text-text-tertiary text-xs font-semibold uppercase tracking-wide mb-4">
          Parent Thread
        </h3>
        <div className="space-y-4 opacity-50">
          {thread.messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onBranch={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
