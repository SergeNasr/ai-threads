import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Breadcrumb } from './breadcrumb';
import { Thread } from '@/lib/types';

describe('Breadcrumb', () => {
  const mockNavigate = vi.fn();

  it('shows Root for root thread', () => {
    const rootThread: Thread = {
      id: 'root-1',
      parentId: null,
      parentMessageId: null,
      branchContext: null,
      status: 'idle',
      messages: [],
      createdAt: Date.now(),
    };

    render(<Breadcrumb ancestors={[]} currentThread={rootThread} onNavigate={mockNavigate} />);
    expect(screen.getByText('Root')).toBeInTheDocument();
  });

  it('shows ancestor threads with separators', () => {
    const rootThread: Thread = {
      id: 'root-1',
      parentId: null,
      parentMessageId: null,
      branchContext: null,
      status: 'idle',
      messages: [],
      createdAt: Date.now(),
    };

    const childThread: Thread = {
      id: 'child-1',
      parentId: 'root-1',
      parentMessageId: null,
      branchContext: 'test context',
      status: 'idle',
      messages: [],
      createdAt: Date.now(),
    };

    const { container } = render(
      <Breadcrumb ancestors={[rootThread]} currentThread={childThread} onNavigate={mockNavigate} />
    );

    expect(container.textContent).toContain('Root');
    expect(container.textContent).toContain('test context');
  });

  it('navigates when ancestor is clicked', () => {
    const rootThread: Thread = {
      id: 'root-1',
      parentId: null,
      parentMessageId: null,
      branchContext: null,
      status: 'idle',
      messages: [],
      createdAt: Date.now(),
    };

    const childThread: Thread = {
      id: 'child-1',
      parentId: 'root-1',
      parentMessageId: null,
      branchContext: null,
      status: 'idle',
      messages: [],
      createdAt: Date.now(),
    };

    render(
      <Breadcrumb ancestors={[rootThread]} currentThread={childThread} onNavigate={mockNavigate} />
    );

    const buttons = screen.getAllByRole('button');
    buttons[0].click();
    expect(mockNavigate).toHaveBeenCalledWith('root-1');
  });
});
