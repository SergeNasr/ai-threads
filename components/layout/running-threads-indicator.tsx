"use client";

import { Badge } from "@/components/ui/badge";

interface RunningThreadsIndicatorProps {
  count: number;
  onClick: () => void;
}

export function RunningThreadsIndicator({
  count,
  onClick,
}: RunningThreadsIndicatorProps) {
  if (count === 0) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-md bg-bg-secondary px-3 py-2 shadow-lg border border-border-subtle hover:bg-bg-tertiary transition-colors cursor-pointer"
    >
      <span className="text-status-streaming text-base">⟳</span>
      <span className="text-text-primary text-sm font-medium">
        {count} {count === 1 ? "thread" : "threads"} running
      </span>
    </button>
  );
}
