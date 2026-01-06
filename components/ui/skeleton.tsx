"use client";

import { forwardRef, type HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ width, height, className = "", style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          bg-bg-tertiary
          rounded-sm
          animate-pulse
          ${className}
        `}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
          ...style,
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";
