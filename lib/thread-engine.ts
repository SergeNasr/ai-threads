import { ThreadId, MessageId, Thread, ThreadStatus } from './types';
import { useStore } from './store';
import { aiService } from '@/mocks/ai-service';

interface QueueItem {
  threadId: ThreadId;
  status: ThreadStatus;
}

class ThreadEngine {
  private queue: Set<ThreadId> = new Set();
  private processing: Set<ThreadId> = new Set();

  reset(): void {
    this.queue.clear();
    this.processing.clear();
  }

  branch(parentMessageId: MessageId | null, selectedText: string | null): ThreadId {
    const store = useStore.getState();
    
    if (!parentMessageId) {
      // Create root thread if no parent message
      return store.createThread();
    }

    // Find the thread containing the parent message
    let parentThreadId: ThreadId | null = null;
    for (const threadId in store.threads) {
      const thread = store.threads[threadId];
      if (thread.messages.some((m) => m.id === parentMessageId)) {
        parentThreadId = threadId;
        break;
      }
    }

    if (!parentThreadId) {
      throw new Error(`Parent message ${parentMessageId} not found`);
    }

    // Create child thread with branch context
    const childThreadId = store.createThread(
      parentThreadId,
      selectedText ?? null,
      parentMessageId
    );

    return childThreadId;
  }

  enqueue(threadId: ThreadId): void {
    const store = useStore.getState();
    const thread = store.threads[threadId];

    if (!thread) {
      throw new Error(`Thread ${threadId} not found`);
    }

    if (thread.status === 'streaming' || this.processing.has(threadId)) {
      return; // Already processing
    }

    if (this.queue.has(threadId)) {
      return; // Already queued
    }

    this.queue.add(threadId);
    store.setThreadStatus(threadId, 'queued');
  }

  async processQueue(): Promise<void> {
    if (this.queue.size === 0) {
      return;
    }

    // Process all queued threads in parallel
    const threadIds = Array.from(this.queue);
    this.queue.clear();

    await Promise.all(
      threadIds.map((threadId) => this.processThread(threadId))
    );
  }

  private async processThread(threadId: ThreadId): Promise<void> {
    const store = useStore.getState();
    let thread = store.threads[threadId];

    if (!thread) {
      return;
    }

    if (this.processing.has(threadId)) {
      return;
    }

    this.processing.add(threadId);
    store.setThreadStatus(threadId, 'streaming');

    try {
      // Get fresh thread state
      thread = useStore.getState().threads[threadId];
      if (!thread) return;

      // Get the last user message or construct prompt from thread context
      const lastUserMessage = thread.messages
        .filter((m) => m.role === 'user')
        .pop();

      if (!lastUserMessage) {
        // If no user message, construct prompt from branch context
        const prompt = thread.branchContext
          ? `> ${thread.branchContext}\n\nPlease respond to this context.`
          : 'Please respond.';

        // Add user message first
        store.addMessage(threadId, 'user', prompt);
        // Refresh thread state after adding message
        thread = useStore.getState().threads[threadId];
        if (!thread) return;
      }

      // Get the latest user message (might be the one we just added)
      const userMessage = thread.messages
        .filter((m) => m.role === 'user')
        .pop();

      if (!userMessage) {
        throw new Error('No user message found');
      }

      // Create assistant message for streaming
      const assistantMessageId = store.addMessage(threadId, 'assistant', '');

      // Stream response
      let content = '';
      for await (const token of aiService.streamResponse(threadId, userMessage.content)) {
        content += token;
        store.updateMessage(assistantMessageId, content);
      }

      store.setThreadStatus(threadId, 'idle');
    } catch (error) {
      store.setThreadStatus(threadId, 'error');
      throw error;
    } finally {
      this.processing.delete(threadId);
    }
  }

  getQueueStatus(): { threadId: ThreadId; status: ThreadStatus }[] {
    const store = useStore.getState();
    const statuses: { threadId: ThreadId; status: ThreadStatus }[] = [];

    // Add queued threads
    for (const threadId of this.queue) {
      statuses.push({ threadId, status: 'queued' });
    }

    // Add processing threads
    for (const threadId of this.processing) {
      statuses.push({ threadId, status: 'streaming' });
    }

    return statuses;
  }

  getAncestorChain(threadId: ThreadId): Thread[] {
    const store = useStore.getState();
    return store.getThreadAncestors(threadId);
  }

  getParentThread(threadId: ThreadId): Thread | null {
    const store = useStore.getState();
    const thread = store.threads[threadId];

    if (!thread || !thread.parentId) {
      return null;
    }

    return store.threads[thread.parentId] ?? null;
  }
}

export const threadEngine = new ThreadEngine();
