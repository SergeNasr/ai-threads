import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RunningThreadsPanel } from './running-threads-panel';
import { Thread, ThreadStatus } from '@/lib/types';

describe('RunningThreadsPanel', () => {
  const mockSelect = vi.fn();
  const mockClose = vi.fn();

  it('hides when no threads', () => {
    const { container } = render(
      <RunningThreadsPanel threads={[]} onSelect={mockSelect} onClose={mockClose} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('shows running threads with status', () => {
    const thread: Thread = {
      id: 'thread-1',
      parentId: null,
      parentMessageId: null,
      branchContext: null,
      status: 'streaming',
      messages: [{ id: 'msg-1', threadId: 'thread-1', role: 'user', content: 'Test', createdAt: Date.now() }],
      createdAt: Date.now(),
    };

    render(
      <RunningThreadsPanel
        threads={[{ thread, status: 'streaming' as ThreadStatus }]}
        onSelect={mockSelect}
        onClose={mockClose}
      />
    );

    expect(screen.getByText('Running Threads')).toBeInTheDocument();
    expect(screen.getByText('Streaming')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('navigates and closes when thread is clicked', () => {
    const thread: Thread = {
      id: 'thread-1',
      parentId: null,
      parentMessageId: null,
      branchContext: null,
      status: 'queued',
      messages: [],
      createdAt: Date.now(),
    };

    render(
      <RunningThreadsPanel
        threads={[{ thread, status: 'queued' as ThreadStatus }]}
        onSelect={mockSelect}
        onClose={mockClose}
      />
    );

    screen.getByText('New thread').click();
    expect(mockSelect).toHaveBeenCalledWith('thread-1');
    expect(mockClose).toHaveBeenCalled();
  });

  it('closes when close button is clicked', () => {
    const thread: Thread = {
      id: 'thread-1',
      parentId: null,
      parentMessageId: null,
      branchContext: null,
      status: 'streaming',
      messages: [],
      createdAt: Date.now(),
    };

    const { container } = render(
      <RunningThreadsPanel
        threads={[{ thread, status: 'streaming' as ThreadStatus }]}
        onSelect={mockSelect}
        onClose={mockClose}
      />
    );

    const closeButtons = screen.getAllByRole('button', { name: 'Close' });
    closeButtons[0].click();
    expect(mockClose).toHaveBeenCalled();
  });
});
