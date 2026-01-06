"use client";

import { useMemo, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(
    () => getSuggestions(query, commands),
    [query, commands]
  );

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
      <Dropdown<SlashCommand>
        items={items}
        onSelect={(item) => onSelect(item.id)}
        onClose={onClose}
      />
    </div>
  );
}
