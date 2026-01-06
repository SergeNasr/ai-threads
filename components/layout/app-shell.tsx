"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { threadEngine } from "@/lib/thread-engine";
import { ThreadId, Thread, ThreadStatus } from "@/lib/types";
import { Breadcrumb } from "./breadcrumb";
import { ParentThreadPreview } from "./parent-thread-preview";
import { RunningThreadsIndicator } from "./running-threads-indicator";
import { RunningThreadsPanel } from "./running-threads-panel";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { activeThreadId, threads, setActiveThread } = useStore();
  const [showRunningPanel, setShowRunningPanel] = useState(false);

  const activeThread = threads[activeThreadId];
  const ancestors = useMemo(() => {
    if (!activeThread) return [];
    return threadEngine.getAncestorChain(activeThreadId);
  }, [activeThreadId, activeThread]);

  const parentThread = useMemo(() => {
    if (!activeThread) return null;
    return threadEngine.getParentThread(activeThreadId);
  }, [activeThreadId, activeThread]);

  const runningThreads = useMemo(() => {
    const queueStatus = threadEngine.getQueueStatus();
    return queueStatus
      .map(({ threadId, status }) => {
        const thread = threads[threadId];
        return thread ? { thread, status } : null;
      })
      .filter(
        (item): item is { thread: Thread; status: ThreadStatus } =>
          item !== null
      );
  }, [threads]);

  const handleNavigate = (threadId: ThreadId) => {
    setActiveThread(threadId);
  };

  return (
    <div className="flex flex-col h-screen bg-bg-primary">
      {activeThread && (
        <Breadcrumb
          ancestors={ancestors}
          currentThread={activeThread}
          onNavigate={handleNavigate}
        />
      )}
      <div className="flex flex-1 overflow-hidden">
        {parentThread && <ParentThreadPreview thread={parentThread} />}
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
      <RunningThreadsIndicator
        count={runningThreads.length}
        onClick={() => setShowRunningPanel(!showRunningPanel)}
      />
      {showRunningPanel && (
        <RunningThreadsPanel
          threads={runningThreads}
          onSelect={handleNavigate}
          onClose={() => setShowRunningPanel(false)}
        />
      )}
    </div>
  );
}
