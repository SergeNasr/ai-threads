"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { BranchButton } from "./branch-button";

interface SelectableTextProps {
  children: ReactNode;
  onBranch: (selectedText: string) => void;
}

export const SelectableText = ({ children, onBranch }: SelectableTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<{
    text: string;
    position: { top: number; left: number };
  } | null>(null);

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        setSelection(null);
        return;
      }

      const range = selection.getRangeAt(0);
      const selectedText = range.toString().trim();

      if (!selectedText || !containerRef.current) {
        setSelection(null);
        return;
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const rangeRect = range.getBoundingClientRect();

      const position = {
        top: rangeRect.top - containerRect.top - 36,
        left: rangeRect.left - containerRect.left + rangeRect.width / 2 - 14,
      };

      setSelection({ text: selectedText, position });
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSelection(null);
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBranch = () => {
    if (selection) {
      onBranch(selection.text);
      setSelection(null);
      window.getSelection()?.removeAllRanges();
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {children}
      {selection && (
        <BranchButton onClick={handleBranch} position={selection.position} />
      )}
    </div>
  );
};
