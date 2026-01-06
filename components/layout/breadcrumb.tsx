"use client";

import { Thread, ThreadId } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface BreadcrumbProps {
  ancestors: Thread[];
  currentThread: Thread;
  onNavigate: (threadId: ThreadId) => void;
}

export function Breadcrumb({
  ancestors,
  currentThread,
  onNavigate,
}: BreadcrumbProps) {
  const allThreads = [...ancestors, currentThread];

  const getThreadLabel = (thread: Thread, index: number) => {
    if (index === 0) return "Root";
    if (thread.branchContext) {
      const preview = thread.branchContext.slice(0, 30);
      return preview.length < thread.branchContext.length
        ? `${preview}...`
        : preview;
    }
    const firstMessage = thread.messages[0];
    if (firstMessage) {
      const preview = firstMessage.content.slice(0, 30);
      return preview.length < firstMessage.content.length
        ? `${preview}...`
        : preview;
    }
    return `Thread ${index}`;
  };

  return (
    <nav className="flex items-center gap-2 px-4 py-3 border-b border-border-subtle bg-bg-secondary">
      {allThreads.map((thread, index) => {
        const isLast = index === allThreads.length - 1;
        const label = getThreadLabel(thread, index);

        return (
          <div key={thread.id} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-text-tertiary text-sm">/</span>
            )}
            {isLast ? (
              <span className="text-text-primary text-sm font-medium">
                {label}
              </span>
            ) : (
              <Button
                variant="ghost"
                className="h-auto p-0 text-sm text-text-secondary hover:text-text-primary"
                onClick={() => onNavigate(thread.id)}
              >
                {label}
              </Button>
            )}
          </div>
        );
      })}
    </nav>
  );
}
