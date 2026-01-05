"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type KeyboardEvent,
} from "react";

export interface DropdownItem<T = string> {
  id: T;
  label: string;
  description?: string;
  icon?: ReactNode;
}

interface DropdownProps<T = string> {
  items: DropdownItem<T>[];
  onSelect: (item: DropdownItem<T>) => void;
  onClose?: () => void;
  selectedIndex?: number;
  className?: string;
}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ items, onSelect, onClose, selectedIndex: controlledIndex, className = "" }, ref) => {
    const [internalIndex, setInternalIndex] = useState(0);
    const listRef = useRef<HTMLUListElement>(null);
    const selectedIndex = controlledIndex ?? internalIndex;

    useEffect(() => {
      const handleKeyDown = (e: globalThis.KeyboardEvent) => {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setInternalIndex((i) => Math.min(i + 1, items.length - 1));
            break;
          case "ArrowUp":
            e.preventDefault();
            setInternalIndex((i) => Math.max(i - 1, 0));
            break;
          case "Enter":
            e.preventDefault();
            if (items[selectedIndex]) {
              onSelect(items[selectedIndex]);
            }
            break;
          case "Escape":
            e.preventDefault();
            onClose?.();
            break;
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [items, selectedIndex, onSelect, onClose]);

    useEffect(() => {
      const list = listRef.current;
      const selected = list?.children[selectedIndex] as HTMLElement;
      if (selected) {
        selected.scrollIntoView({ block: "nearest" });
      }
    }, [selectedIndex]);

    if (items.length === 0) return null;

    return (
      <div
        ref={ref}
        className={`
          bg-bg-secondary
          border border-border-subtle
          rounded-md
          shadow-lg
          overflow-hidden
          max-h-64
          overflow-y-auto
          ${className}
        `}
      >
        <ul ref={listRef} role="listbox" className="py-1">
          {items.map((item, index) => (
            <li
              key={String(item.id)}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => onSelect(item)}
              className={`
                px-3 py-2
                cursor-pointer
                transition-colors duration-100
                ${
                  index === selectedIndex
                    ? "bg-bg-tertiary text-text-primary"
                    : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                }
              `}
            >
              <div className="flex items-center gap-2">
                {item.icon && (
                  <span className="text-text-tertiary flex-shrink-0">{item.icon}</span>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.label}</div>
                  {item.description && (
                    <div className="text-xs text-text-tertiary truncate">
                      {item.description}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";
