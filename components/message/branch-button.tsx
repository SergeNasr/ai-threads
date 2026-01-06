"use client";

import { IconButton } from "@/components/ui";

const BranchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M5 2.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM5 13.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM14 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
    <path d="M3.5 3.5h2.5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H3.5M12.5 8h-2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

interface BranchButtonProps {
  onClick: () => void;
  position: { top: number; left: number };
}

export const BranchButton = ({ onClick, position }: BranchButtonProps) => {
  return (
    <div
      className="absolute z-10"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <IconButton
        variant="primary"
        size="sm"
        icon={<BranchIcon />}
        label="Branch thread"
        onClick={onClick}
        className="shadow-lg"
      />
    </div>
  );
};
