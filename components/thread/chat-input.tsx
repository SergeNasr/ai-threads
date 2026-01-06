"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui";
import { CommandAutocomplete } from "@/components/command";
import { type SlashCommand } from "@/lib/types";
import { parse, execute } from "@/components/command/command-parser";
import { useStore } from "@/lib/store";

interface ChatInputProps {
  threadId: string;
  onSubmit: (content: string) => void;
  disabled?: boolean;
  commands?: SlashCommand[];
  initialValue?: string;
}

export function ChatInput({
  threadId,
  onSubmit,
  disabled = false,
  commands,
  initialValue = "",
}: ChatInputProps) {
  const [value, setValue] = useState(initialValue);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);
  const { threads, commands: storeCommands } = useStore();

  const availableCommands = commands ?? storeCommands;
  const thread = threads[threadId];

  useEffect(() => {
    if (initialValue) {
      setValue(initialValue);
      setTimeout(() => {
        textareaRef.current?.focus();
        if (textareaRef.current) {
          const len = initialValue.length;
          textareaRef.current.setSelectionRange(len, len);
        }
      }, 0);
    } else if (!initialValue && value) {
      setValue("");
    }
  }, [threadId, initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;
    setValue(newValue);
    setCursorPosition(cursorPos);

    const textBeforeCursor = newValue.slice(0, cursorPos);
    const lastSlashIndex = textBeforeCursor.lastIndexOf("/");
    const hasSlash = lastSlashIndex !== -1;
    const textAfterSlash = textBeforeCursor.slice(lastSlashIndex + 1);
    const hasSpaceAfterSlash = textAfterSlash.includes(" ");

    if (hasSlash && !hasSpaceAfterSlash) {
      const query = textBeforeCursor.slice(lastSlashIndex);
      setCommandQuery(query);
      setShowAutocomplete(true);
    } else {
      setShowAutocomplete(false);
      setCommandQuery("");
    }
  };

  const handleCommandSelect = useCallback(
    (command: SlashCommand) => {
      if (!textareaRef.current) return;

      const textBeforeCursor = value.slice(0, cursorPosition);
      const lastSlashIndex = textBeforeCursor.lastIndexOf("/");
      const textAfterCursor = value.slice(cursorPosition);

      if (lastSlashIndex === -1) {
        return;
      }

      const commandText = `/${command.trigger}`;
      const newValue =
        value.slice(0, lastSlashIndex) + commandText + " " + textAfterCursor;

      setValue(newValue);
      setShowAutocomplete(false);
      setCommandQuery("");

      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPos = lastSlashIndex + commandText.length + 1;
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
          textareaRef.current.focus();
        }
      }, 0);
    },
    [value, cursorPosition]
  );

  const handleSubmit = useCallback(() => {
    if (!value.trim() || disabled) return;

    const trimmed = value.trim();

    const parsed = parse(trimmed, availableCommands);
    if (parsed) {
      const prompt = execute(parsed.command, parsed.params, thread?.messages ?? []);
      onSubmit(prompt);
    } else {
      onSubmit(trimmed);
    }

    setValue("");
    setShowAutocomplete(false);
    setCommandQuery("");
  }, [value, disabled, onSubmit, availableCommands, thread]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(e.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(e.target as Node)
      ) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative border-t border-border-subtle bg-bg-secondary">
      <div className="relative px-6 py-4">
        {showAutocomplete && commandQuery && (
          <div
            ref={autocompleteRef}
            className="absolute bottom-full left-6 right-6 mb-2 z-10"
          >
            <CommandAutocomplete
              query={commandQuery}
              onSelect={handleCommandSelect}
              onClose={() => setShowAutocomplete(false)}
              commands={availableCommands}
            />
          </div>
        )}
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onSubmit={handleSubmit}
          placeholder="Type a message... (use / for commands)"
          disabled={disabled}
          minRows={1}
          maxRows={8}
          className="resize-none"
        />
      </div>
    </div>
  );
}
