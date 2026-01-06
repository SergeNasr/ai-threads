import { SlashCommand, Message } from '@/lib/types';
import { MVP_COMMANDS } from './commands';

export interface ParsedCommand {
  command: SlashCommand;
  params: Record<string, string>;
}

export function parse(input: string, commands: SlashCommand[] = MVP_COMMANDS): ParsedCommand | null {
  const trimmed = input.trim();
  if (!trimmed.startsWith('/')) {
    return null;
  }

  const parts = trimmed.slice(1).split(/\s+/);
  const trigger = parts[0]?.toLowerCase();
  if (!trigger) {
    return null;
  }

  const command = commands.find((cmd) => cmd.trigger.toLowerCase() === trigger);
  if (!command) {
    return null;
  }

  const params: Record<string, string> = {};
  const paramValues = parts.slice(1);

  for (let i = 0; i < command.parameters.length; i++) {
    const param = command.parameters[i];
    const value = paramValues[i];

    if (param.required && !value) {
      return null;
    }

    if (value) {
      params[param.name] = value;
    }
  }

  return { command, params };
}

export function execute(
  command: SlashCommand,
  params: Record<string, string>,
  threadContext: Message[]
): string {
  let prompt = command.promptTemplate;

  for (const [key, value] of Object.entries(params)) {
    prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }

  return prompt;
}

export function getSuggestions(
  partial: string,
  commands: SlashCommand[] = MVP_COMMANDS
): SlashCommand[] {
  if (!partial.startsWith('/')) {
    return [];
  }

  const query = partial.slice(1).toLowerCase().trim();
  if (!query) {
    return commands;
  }

  return commands.filter((cmd) =>
    cmd.trigger.toLowerCase().startsWith(query)
  );
}
