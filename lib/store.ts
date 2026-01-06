import { create } from 'zustand';
import {
  AppState,
  Thread,
  ThreadId,
  MessageId,
  ThreadStatus,
  Message,
  SlashCommand,
} from './types';
import { initialData } from '@/mocks/data';

export interface ThreadActions {
  createThread(parentId?: ThreadId, branchContext?: string, parentMessageId?: MessageId): ThreadId;
  addMessage(threadId: ThreadId, role: 'user' | 'assistant', content: string): MessageId;
  updateMessage(messageId: MessageId, content: string): void;
  setThreadStatus(threadId: ThreadId, status: ThreadStatus): void;
  setActiveThread(threadId: ThreadId): void;
  getThreadAncestors(threadId: ThreadId): Thread[];
}

type Store = AppState & ThreadActions;

const generateId = () => crypto.randomUUID();

export const useStore = create<Store>((set, get) => ({
  ...initialData,

  createThread(parentId, branchContext, parentMessageId) {
    const id = generateId();
    const thread: Thread = {
      id,
      parentId: parentId ?? null,
      parentMessageId: parentMessageId ?? null,
      branchContext: branchContext ?? null,
      status: 'idle',
      messages: [],
      createdAt: Date.now(),
    };
    set((state) => ({
      threads: { ...state.threads, [id]: thread },
    }));
    return id;
  },

  addMessage(threadId, role, content) {
    const id = generateId();
    const message: Message = {
      id,
      threadId,
      role,
      content,
      createdAt: Date.now(),
    };
    set((state) => {
      const thread = state.threads[threadId];
      if (!thread) return state;
      return {
        threads: {
          ...state.threads,
          [threadId]: {
            ...thread,
            messages: [...thread.messages, message],
          },
        },
      };
    });
    return id;
  },

  updateMessage(messageId, content) {
    set((state) => {
      const threads = { ...state.threads };
      for (const threadId in threads) {
        const thread = threads[threadId];
        const msgIndex = thread.messages.findIndex((m) => m.id === messageId);
        if (msgIndex !== -1) {
          const messages = [...thread.messages];
          messages[msgIndex] = { ...messages[msgIndex], content };
          threads[threadId] = { ...thread, messages };
          break;
        }
      }
      return { threads };
    });
  },

  setThreadStatus(threadId, status) {
    set((state) => {
      const thread = state.threads[threadId];
      if (!thread) return state;
      return {
        threads: {
          ...state.threads,
          [threadId]: { ...thread, status },
        },
      };
    });
  },

  setActiveThread(threadId) {
    set({ activeThreadId: threadId });
  },

  getThreadAncestors(threadId) {
    const ancestors: Thread[] = [];
    const { threads } = get();
    let current = threads[threadId];
    while (current?.parentId) {
      const parent = threads[current.parentId];
      if (parent) {
        ancestors.unshift(parent);
        current = parent;
      } else {
        break;
      }
    }
    return ancestors;
  },
}));
