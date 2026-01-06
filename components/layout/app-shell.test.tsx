import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppShell } from './app-shell';
import { useStore } from '@/lib/store';
import { threadEngine } from '@/lib/thread-engine';

describe('AppShell', () => {
  beforeEach(() => {
    useStore.setState(useStore.getInitialState());
    threadEngine.reset();
  });

  it('renders breadcrumb and content', () => {
    render(
      <AppShell>
        <div>Test Content</div>
      </AppShell>
    );

    expect(screen.getByText('Root')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('shows parent preview when viewing child thread', () => {
    const { rootThreadId, createThread, setActiveThread } = useStore.getState();
    const childId = createThread(rootThreadId, 'test context');
    setActiveThread(childId);

    const { container } = render(
      <AppShell>
        <div>Child Content</div>
      </AppShell>
    );

    expect(container.textContent).toMatch(/Parent Thread/i);
  });

  it('hides running indicator when no threads running', () => {
    render(
      <AppShell>
        <div>Content</div>
      </AppShell>
    );

    expect(screen.queryByText(/threads running/i)).not.toBeInTheDocument();
  });
});
