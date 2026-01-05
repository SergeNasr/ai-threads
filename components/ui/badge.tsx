"use client";

import { forwardRef, type HTMLAttributes } from "react";

type BadgeVariant = "streaming" | "queued" | "error" | "default";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  streaming: "bg-status-streaming/20 text-status-streaming border-status-streaming/30",
  queued: "bg-status-queued/20 text-status-queued border-status-queued/30",
  error: "bg-status-error/20 text-status-error border-status-error/30",
  default: "bg-bg-tertiary text-text-secondary border-border-subtle",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", className = "", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center
          px-2 py-0.5
          text-xs font-medium
          border
          rounded-full
          ${variantStyles[variant]}
          ${className}
        `}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
