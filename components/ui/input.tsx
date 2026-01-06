"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          w-full
          px-3 py-2
          bg-bg-secondary
          text-text-primary text-sm
          placeholder:text-text-tertiary
          border border-border-subtle
          rounded-sm
          transition-colors duration-150
          hover:border-border-emphasis
          focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
