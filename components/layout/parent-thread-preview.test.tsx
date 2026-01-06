import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ParentThreadPreview } from './parent-thread-preview';
import { Thread } from '@/lib/types';

describe('ParentThreadPreview', () => {
  it('hides when no parent thread', () => {
    const { container } = render(<ParentThreadPreview thread={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows parent thread messages', () => {
    const parentThread: Thread = {
      id: 'parent-1',
      parentId: null,
      parentMessageId: null,
      branchContext: null,
      status: 'idle',
      messages: [
        {
          id: 'msg-1',
          threadId: 'parent-1',
          role: 'user',
          content: 'Hello',
          createdAt: Date.now(),
        },
        {
          id: 'msg-2',
          threadId: 'parent-1',
          role: 'assistant',
          content: 'Hi there',
          createdAt: Date.now(),
        },
      ],
      createdAt: Date.now(),
    };

    render(<ParentThreadPreview thread={parentThread} />);

    expect(screen.getByText(/Parent Thread/i)).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there')).toBeInTheDocument();
  });
});
