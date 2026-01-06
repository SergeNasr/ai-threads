"use client";

import { useState, useEffect, useRef } from 'react';
import { Dropdown, type DropdownItem } from '@/components/ui';
import { SlashCommand } from '@/lib/types';
import { getSuggestions } from './command-parser';

interface CommandAutocompleteProps {
  query: string;
  onSelect: (command: SlashCommand) => void;
  onClose?: () => void;
  commands?: SlashCommand[];
  className?: string;
}

export function CommandAutocomplete({
  query,
  onSelect,
  onClose,
  commands,
  className = '',
}: CommandAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<SlashCommand[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const results = getSuggestions(query, commands);
    setSuggestions(results);
  }, [query, commands]);

  if (suggestions.length === 0) {
    return null;
  }

  const items: DropdownItem<SlashCommand>[] = suggestions.map((cmd) => ({
    id: cmd,
    label: `/${cmd.trigger}`,
    description: cmd.description,
  }));

  return (
    <div ref={containerRef} className={className}>
      <Dropdown
        items={items}
        onSelect={(item) => onSelect(item.id)}
        onClose={onClose}
      />
    </div>
  );
}
