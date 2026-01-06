import { describe, it, expect, beforeEach, vi } from 'vitest';
import { threadEngine } from './thread-engine';
import { useStore } from './store';
import { aiService } from '@/mocks/ai-service';
import { ThreadId, MessageId } from './types';
import { initialData } from '@/mocks/data';

// Mock the AI service
vi.mock('@/mocks/ai-service', () => ({
  aiService: {
    streamResponse: vi.fn(),
  },
}));

describe('thread-engine', () => {
  beforeEach(() => {
    // Reset store to initial state
    const storeActions = {
      createThread: useStore.getState().createThread,
      addMessage: useStore.getState().addMessage,
      updateMessage: useStore.getState().updateMessage,
      setThreadStatus: useStore.getState().setThreadStatus,
      setActiveThread: useStore.getState().setActiveThread,
      getThreadAncestors: useStore.getState().getThreadAncestors,
    };
    useStore.setState({
      ...initialData,
      ...storeActions,
    });
    // Reset thread engine internal state
    threadEngine.reset();
    // Clear mocks
    vi.clearAllMocks();
  });

  describe('branch', () => {
    it('creates root thread when parentMessageId is null', () => {
      const threadId = threadEngine.branch(null, null);
      const thread = useStore.getState().threads[threadId];

      expect(thread).toBeDefined();
      expect(thread.parentId).toBeNull();
      expect(thread.parentMessageId).toBeNull();
      expect(thread.branchContext).toBeNull();
    });

    it('creates child thread with branch context', () => {
      const { rootThreadId, addMessage } = useStore.getState();
      const messageId = addMessage(rootThreadId, 'assistant', 'Test message');

      const childThreadId = threadEngine.branch(messageId, 'selected text');
      const childThread = useStore.getState().threads[childThreadId];

      expect(childThread.parentId).toBe(rootThreadId);
      expect(childThread.parentMessageId).toBe(messageId);
      expect(childThread.branchContext).toBe('selected text');
    });

    it('creates child thread without branch context when selectedText is null', () => {
      const { rootThreadId, addMessage } = useStore.getState();
      const messageId = addMessage(rootThreadId, 'assistant', 'Test message');

      const childThreadId = threadEngine.branch(messageId, null);
      const childThread = useStore.getState().threads[childThreadId];

      expect(childThread.parentId).toBe(rootThreadId);
      expect(childThread.parentMessageId).toBe(messageId);
      expect(childThread.branchContext).toBeNull();
    });

    it('throws error when parent message not found', () => {
      expect(() => {
        threadEngine.branch('non-existent-message-id' as MessageId, 'text');
      }).toThrow('Parent message non-existent-message-id not found');
    });
  });

  describe('enqueue', () => {
    it('adds thread to queue', () => {
      const { rootThreadId } = useStore.getState();
      threadEngine.enqueue(rootThreadId);

      const status = threadEngine.getQueueStatus();
      expect(status).toHaveLength(1);
      expect(status[0].threadId).toBe(rootThreadId);
      expect(status[0].status).toBe('queued');
    });

    it('sets thread status to queued', () => {
      const { rootThreadId } = useStore.getState();
      const originalStatus = useStore.getState().threads[rootThreadId].status;
      expect(originalStatus).toBe('idle'); // Original state
      
      threadEngine.enqueue(rootThreadId);
      
      const updatedThread = useStore.getState().threads[rootThreadId];
      expect(updatedThread.status).toBe('queued');
    });

    it('does not enqueue thread that is already streaming', () => {
      const { rootThreadId, setThreadStatus } = useStore.getState();
      setThreadStatus(rootThreadId, 'streaming');
      
      // Verify status was set
      expect(useStore.getState().threads[rootThreadId].status).toBe('streaming');

      threadEngine.enqueue(rootThreadId);

      const status = threadEngine.getQueueStatus();
      expect(status).toHaveLength(0);
    });

    it('does not enqueue thread twice', () => {
      const { rootThreadId } = useStore.getState();
      threadEngine.enqueue(rootThreadId);
      threadEngine.enqueue(rootThreadId);

      const status = threadEngine.getQueueStatus();
      expect(status).toHaveLength(1);
    });

    it('throws error when thread not found', () => {
      expect(() => {
        threadEngine.enqueue('non-existent-thread' as ThreadId);
      }).toThrow('Thread non-existent-thread not found');
    });
  });

  describe('processQueue', () => {
    it('processes queued threads', async () => {
      const tokens = ['Hello', ' ', 'world'];
      const mockGenerator = async function* () {
        for (const token of tokens) {
          yield token;
        }
      };

      vi.mocked(aiService.streamResponse).mockReturnValue(mockGenerator());

      const { createThread, addMessage } = useStore.getState();
      // Create a new thread to avoid the welcome message
      const threadId = createThread();
      addMessage(threadId, 'user', 'Test prompt');
      threadEngine.enqueue(threadId);

      await threadEngine.processQueue();

      const thread = useStore.getState().threads[threadId];
      expect(thread.status).toBe('idle');
      expect(thread.messages).toHaveLength(2); // user + assistant
      expect(thread.messages[1].role).toBe('assistant');
      expect(thread.messages[1].content).toBe('Hello world');
    });

    it('creates user message from branch context if no user message exists', async () => {
      const mockGenerator = async function* () {
        yield 'Response';
      };

      vi.mocked(aiService.streamResponse).mockReturnValue(mockGenerator());

      const { rootThreadId, createThread } = useStore.getState();
      const childThreadId = createThread(rootThreadId, 'branch context', 'msg-1');
      threadEngine.enqueue(childThreadId);

      await threadEngine.processQueue();

      const thread = useStore.getState().threads[childThreadId];
      const userMessage = thread.messages.find((m) => m.role === 'user');
      expect(userMessage).toBeDefined();
      expect(userMessage?.content).toContain('branch context');
    });

    it('processes multiple threads in parallel', async () => {
      const mockGenerator = async function* () {
        yield 'Response';
      };

      vi.mocked(aiService.streamResponse).mockReturnValue(mockGenerator());

      const { rootThreadId, createThread, addMessage } = useStore.getState();
      const thread1 = createThread();
      const thread2 = createThread();
      addMessage(thread1, 'user', 'Prompt 1');
      addMessage(thread2, 'user', 'Prompt 2');

      threadEngine.enqueue(thread1);
      threadEngine.enqueue(thread2);

      await threadEngine.processQueue();

      expect(useStore.getState().threads[thread1].status).toBe('idle');
      expect(useStore.getState().threads[thread2].status).toBe('idle');
    });

    it('handles errors and sets status to error', async () => {
      const mockGenerator = async function* () {
        throw new Error('Stream error');
        yield ''; // Unreachable but needed for type
      };

      vi.mocked(aiService.streamResponse).mockReturnValue(mockGenerator());

      const { rootThreadId, createThread, addMessage } = useStore.getState();
      const threadId = createThread();
      addMessage(threadId, 'user', 'Test prompt');
      threadEngine.enqueue(threadId);

      await expect(threadEngine.processQueue()).rejects.toThrow('Stream error');

      const thread = useStore.getState().threads[threadId];
      expect(thread.status).toBe('error');
    });

    it('does nothing when queue is empty', async () => {
      await threadEngine.processQueue();
      expect(aiService.streamResponse).not.toHaveBeenCalled();
    });
  });

  describe('getQueueStatus', () => {
    it('returns empty array when no threads are queued', () => {
      const status = threadEngine.getQueueStatus();
      expect(status).toEqual([]);
    });

    it('returns queued threads', () => {
      const { rootThreadId, createThread } = useStore.getState();
      const thread1 = createThread();
      const thread2 = createThread();

      threadEngine.enqueue(rootThreadId);
      threadEngine.enqueue(thread1);
      threadEngine.enqueue(thread2);

      const status = threadEngine.getQueueStatus();
      expect(status).toHaveLength(3);
      expect(status.every((s) => s.status === 'queued')).toBe(true);
      expect(status.map((s) => s.threadId)).toContain(rootThreadId);
      expect(status.map((s) => s.threadId)).toContain(thread1);
      expect(status.map((s) => s.threadId)).toContain(thread2);
    });
  });

  describe('getAncestorChain', () => {
    it('returns empty array for root thread', () => {
      const { rootThreadId } = useStore.getState();
      const ancestors = threadEngine.getAncestorChain(rootThreadId);
      expect(ancestors).toEqual([]);
    });

    it('returns ancestor chain for nested thread', () => {
      const { rootThreadId, createThread, addMessage } = useStore.getState();
      const msg1 = addMessage(rootThreadId, 'assistant', 'Message 1');
      const child1 = threadEngine.branch(msg1, 'text1');
      const msg2 = addMessage(child1, 'assistant', 'Message 2');
      const child2 = threadEngine.branch(msg2, 'text2');

      const ancestors = threadEngine.getAncestorChain(child2);
      expect(ancestors).toHaveLength(2);
      expect(ancestors[0].id).toBe(rootThreadId);
      expect(ancestors[1].id).toBe(child1);
    });
  });

  describe('getParentThread', () => {
    it('returns null for root thread', () => {
      const { rootThreadId } = useStore.getState();
      const parent = threadEngine.getParentThread(rootThreadId);
      expect(parent).toBeNull();
    });

    it('returns parent thread for child thread', () => {
      const { rootThreadId, addMessage } = useStore.getState();
      const messageId = addMessage(rootThreadId, 'assistant', 'Test message');
      const childThreadId = threadEngine.branch(messageId, 'selected text');

      const parent = threadEngine.getParentThread(childThreadId);
      expect(parent).not.toBeNull();
      expect(parent?.id).toBe(rootThreadId);
    });

    it('returns null for non-existent thread', () => {
      const parent = threadEngine.getParentThread('non-existent' as ThreadId);
      expect(parent).toBeNull();
    });
  });
});
