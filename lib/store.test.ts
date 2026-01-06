import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './store';

describe('store', () => {
    beforeEach(() => {
        // Reset to initial state before each test
        useStore.setState(useStore.getInitialState());
    });

    it('starts with a root thread', () => {
        const { threads, rootThreadId } = useStore.getState();
        expect(threads[rootThreadId]).toBeDefined();
        expect(threads[rootThreadId].parentId).toBeNull();
    });

    it('creates a new thread', () => {
        const { createThread } = useStore.getState();
        const id = createThread();
        const thread = useStore.getState().threads[id];

        expect(thread.status).toBe('idle');
        expect(thread.messages).toEqual([]);
    });

    it('creates a child thread with context', () => {
        const { createThread, rootThreadId } = useStore.getState();
        const id = createThread(rootThreadId, 'highlighted text', 'msg-123');
        const thread = useStore.getState().threads[id];

        expect(thread.parentId).toBe(rootThreadId);
        expect(thread.branchContext).toBe('highlighted text');
        expect(thread.parentMessageId).toBe('msg-123');
    });

    it('adds a message to a thread', () => {
        const { addMessage, rootThreadId } = useStore.getState();
        const msgId = addMessage(rootThreadId, 'user', 'Hello!');
        const thread = useStore.getState().threads[rootThreadId];
        const msg = thread.messages.find(m => m.id === msgId);

        expect(msg?.content).toBe('Hello!');
        expect(msg?.role).toBe('user');
    });

    it('updates a message', () => {
        const { addMessage, updateMessage, rootThreadId } = useStore.getState();
        const msgId = addMessage(rootThreadId, 'assistant', 'Initial');
        updateMessage(msgId, 'Updated content');

        const thread = useStore.getState().threads[rootThreadId];
        const msg = thread.messages.find(m => m.id === msgId);
        expect(msg?.content).toBe('Updated content');
    });

    it('gets thread ancestors', () => {
        const { createThread, getThreadAncestors, rootThreadId } = useStore.getState();
        const childId = createThread(rootThreadId);
        const grandchildId = useStore.getState().createThread(childId);

        const ancestors = useStore.getState().getThreadAncestors(grandchildId);
        expect(ancestors.map(t => t.id)).toEqual([rootThreadId, childId]);
    });
});
