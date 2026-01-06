"use client";

import { AppShell } from "@/components/layout";
import { ThreadView } from "@/components/thread";
import { useStore } from "@/lib/store";

export default function Home() {
  const { activeThreadId } = useStore();

  return (
    <AppShell>
      <ThreadView threadId={activeThreadId} />
    </AppShell>
  );
}
