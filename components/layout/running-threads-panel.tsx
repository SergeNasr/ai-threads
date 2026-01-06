"use client";

import { Thread, ThreadId, ThreadStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RunningThreadsPanelProps {
  threads: { thread: Thread; status: ThreadStatus }[];
  onSelect: (threadId: ThreadId) => void;
  onClose: () => void;
}

const getBadgeVariant = (status: ThreadStatus): "streaming" | "queued" | "error" | "default" => {
  if (status === "streaming" || status === "queued" || status === "error") {
    return status;
  }
  return "default";
};

export function RunningThreadsPanel({
  threads,
  onSelect,
  onClose,
}: RunningThreadsPanelProps) {
  if (threads.length === 0) return null;

  const getThreadPreview = (thread: Thread) => {
    if (thread.branchContext) {
      const preview = thread.branchContext.slice(0, 50);
      return preview.length < thread.branchContext.length
        ? `${preview}...`
        : preview;
    }
    const lastMessage = thread.messages[thread.messages.length - 1];
    if (lastMessage) {
      const preview = lastMessage.content.slice(0, 50);
      return preview.length < lastMessage.content.length
        ? `${preview}...`
        : preview;
    }
    return "New thread";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 rounded-lg bg-bg-secondary border border-border-subtle shadow-xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
        <h3 className="text-text-primary text-sm font-semibold">
          Running Threads
        </h3>
        <Button variant="ghost" className="h-auto p-1" onClick={onClose} aria-label="Close">
          <span className="text-text-secondary text-lg">×</span>
        </Button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {threads.map(({ thread, status }) => (
          <button
            key={thread.id}
            onClick={() => {
              onSelect(thread.id);
              onClose();
            }}
            className="w-full flex items-start gap-3 px-4 py-3 hover:bg-bg-tertiary transition-colors text-left border-b border-border-subtle last:border-b-0"
          >
            <Badge variant={getBadgeVariant(status)} className="shrink-0">
              {status === "streaming" ? "Streaming" : status === "queued" ? "Queued" : status === "error" ? "Error" : "Idle"}
            </Badge>
            <div className="flex-1 min-w-0">
              <p className="text-text-primary text-sm truncate">
                {getThreadPreview(thread)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
