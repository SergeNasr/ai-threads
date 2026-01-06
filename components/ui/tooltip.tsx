"use client";

import {
  forwardRef,
  useState,
  useRef,
  type ReactNode,
} from "react";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
}

const positionStyles = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const arrowStyles = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-bg-tertiary border-x-transparent border-b-transparent",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-bg-tertiary border-x-transparent border-t-transparent",
  left: "left-full top-1/2 -translate-y-1/2 border-l-bg-tertiary border-y-transparent border-r-transparent",
  right: "right-full top-1/2 -translate-y-1/2 border-r-bg-tertiary border-y-transparent border-l-transparent",
};

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ content, children, position = "top", delay = 200, className = "" }, ref) => {
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const show = () => {
      timeoutRef.current = setTimeout(() => setVisible(true), delay);
    };

    const hide = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setVisible(false);
    };

    return (
      <div
        ref={ref}
        className={`relative inline-block ${className}`}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
        {visible && (
          <div
            role="tooltip"
            className={`
              absolute z-50
              px-2 py-1
              bg-bg-tertiary
              text-text-primary text-xs
              rounded-sm
              whitespace-nowrap
              shadow-lg
              pointer-events-none
              animate-in fade-in duration-150
              ${positionStyles[position]}
            `}
          >
            {content}
            <div
              className={`
                absolute
                border-4
                ${arrowStyles[position]}
              `}
            />
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = "Tooltip";
