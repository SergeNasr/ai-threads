import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RunningThreadsIndicator } from './running-threads-indicator';

describe('RunningThreadsIndicator', () => {
  const mockClick = vi.fn();

  it('hides when count is zero', () => {
    const { container } = render(<RunningThreadsIndicator count={0} onClick={mockClick} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows count when threads are running', () => {
    render(<RunningThreadsIndicator count={3} onClick={mockClick} />);
    expect(screen.getByText(/3 threads running/)).toBeInTheDocument();
  });

  it('shows singular form for one thread', () => {
    render(<RunningThreadsIndicator count={1} onClick={mockClick} />);
    expect(screen.getByText(/1 thread running/)).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<RunningThreadsIndicator count={2} onClick={mockClick} />);
    screen.getByText(/2 threads running/).click();
    expect(mockClick).toHaveBeenCalled();
  });
});
