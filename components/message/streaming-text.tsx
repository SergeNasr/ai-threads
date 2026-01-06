"use client";

import { useEffect, useState } from "react";

interface StreamingTextProps {
  content: string;
  isStreaming: boolean;
}

export const StreamingText = ({ content, isStreaming }: StreamingTextProps) => {
  const [displayedContent, setDisplayedContent] = useState("");

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedContent(content);
      return;
    }

    const words = content.split(" ");
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        setDisplayedContent(words.slice(0, currentIndex + 1).join(" "));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [content, isStreaming]);

  const finalContent = isStreaming ? displayedContent : content;
  const showCursor = isStreaming && displayedContent.length < content.length;

  return (
    <span>
      {finalContent}
      {showCursor && (
        <span className="inline-block w-0.5 h-4 bg-accent-primary ml-1 animate-pulse" />
      )}
    </span>
  );
};
