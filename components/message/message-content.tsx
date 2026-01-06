"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

interface MessageContentProps {
  content: string;
  isStreaming?: boolean;
}

const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
  h1: ({ children }) => (
    <h1 className="text-2xl font-semibold mb-4 mt-6 first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-semibold mb-3 mt-5 first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold mb-2 mt-4 first:mt-0">{children}</h3>
  ),
  ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
  li: ({ children }) => <li className="ml-4">{children}</li>,
  code: ({ children, className }) => {
    const isInline = !className;
    return isInline ? (
      <code className="bg-bg-tertiary px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
    ) : (
      <code className="block bg-bg-tertiary p-4 rounded-md text-sm font-mono overflow-x-auto mb-4">
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre className="mb-4">{children}</pre>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-accent-primary pl-4 italic my-4">
      {children}
    </blockquote>
  ),
  a: ({ children, href }) => (
    <a href={href} className="text-accent-primary hover:text-accent-hover underline">
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
};

export const MessageContent = ({ content, isStreaming = false }: MessageContentProps) => {
  const [streamedContent, setStreamedContent] = useState("");

  useEffect(() => {
    if (!isStreaming) {
      setStreamedContent(content);
      return;
    }

    const words = content.split(" ");
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        setStreamedContent(words.slice(0, currentIndex + 1).join(" "));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [content, isStreaming]);

  const displayContent = isStreaming ? streamedContent : content;

  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown components={markdownComponents}>{displayContent}</ReactMarkdown>
      {isStreaming && streamedContent.length < content.length && (
        <span className="inline-block w-0.5 h-4 bg-accent-primary ml-1 animate-pulse" />
      )}
    </div>
  );
};
