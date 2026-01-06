import { describe, it, expect } from 'vitest';
import { parse, execute, getSuggestions } from './command-parser';
import { MVP_COMMANDS } from './commands';
import { SlashCommand, Message } from '@/lib/types';

describe('command-parser', () => {
  describe('parse', () => {
    it('returns null for non-slash input', () => {
      expect(parse('hello world')).toBeNull();
      expect(parse('  hello')).toBeNull();
    });

    it('returns null for empty slash', () => {
      expect(parse('/')).toBeNull();
      expect(parse('/   ')).toBeNull();
    });

    it('parses command without parameters', () => {
      const result = parse('/summarize');
      expect(result).not.toBeNull();
      expect(result?.command.trigger).toBe('summarize');
      expect(result?.params).toEqual({});
    });

    it('parses command with parameters', () => {
      const result = parse('/tone formal');
      expect(result).not.toBeNull();
      expect(result?.command.trigger).toBe('tone');
      expect(result?.params).toEqual({ tone: 'formal' });
    });

    it('handles case-insensitive triggers', () => {
      const result = parse('/SUMMARIZE');
      expect(result).not.toBeNull();
      expect(result?.command.trigger).toBe('summarize');
    });

    it('handles extra whitespace', () => {
      const result = parse('  /tone   casual  ');
      expect(result).not.toBeNull();
      expect(result?.command.trigger).toBe('tone');
      expect(result?.params).toEqual({ tone: 'casual' });
    });

    it('returns null for unknown command', () => {
      expect(parse('/unknown')).toBeNull();
    });

    it('returns null for required parameter missing', () => {
      expect(parse('/tone')).toBeNull();
    });

    it('handles multiple word parameters', () => {
      const result = parse('/tone very formal');
      expect(result).not.toBeNull();
      expect(result?.params).toEqual({ tone: 'very' });
    });

    it('uses custom command list', () => {
      const customCommands: SlashCommand[] = [
        {
          id: 'test',
          trigger: 'test',
          description: 'Test command',
          parameters: [],
          promptTemplate: 'Test',
        },
      ];
      const result = parse('/test', customCommands);
      expect(result).not.toBeNull();
      expect(result?.command.trigger).toBe('test');
    });
  });

  describe('execute', () => {
    const mockMessages: Message[] = [
      {
        id: '1',
        threadId: 'thread-1',
        role: 'user',
        content: 'Hello',
        createdAt: Date.now(),
      },
      {
        id: '2',
        threadId: 'thread-1',
        role: 'assistant',
        content: 'Hi there!',
        createdAt: Date.now(),
      },
    ];

    it('interpolates template with parameters', () => {
      const command = MVP_COMMANDS.find((c) => c.trigger === 'tone')!;
      const prompt = execute(command, { tone: 'formal' }, mockMessages);
      expect(prompt).toBe('Rewrite your last response in a formal tone.');
    });

    it('handles template without parameters', () => {
      const command = MVP_COMMANDS.find((c) => c.trigger === 'summarize')!;
      const prompt = execute(command, {}, mockMessages);
      expect(prompt).toBe('Summarize the key points of our conversation so far.');
    });

    it('handles multiple occurrences of same parameter', () => {
      const command: SlashCommand = {
        id: 'test',
        trigger: 'test',
        description: 'Test',
        parameters: [{ name: 'word', required: true, description: 'Word' }],
        promptTemplate: 'Say {{word}} and {{word}} again',
      };
      const prompt = execute(command, { word: 'hello' }, mockMessages);
      expect(prompt).toBe('Say hello and hello again');
    });

    it('handles empty thread context', () => {
      const command = MVP_COMMANDS.find((c) => c.trigger === 'explain')!;
      const prompt = execute(command, {}, []);
      expect(prompt).toBe(
        'Explain the last topic we discussed in simple terms, as if explaining to a beginner.'
      );
    });
  });

  describe('getSuggestions', () => {
    it('returns empty array for non-slash input', () => {
      expect(getSuggestions('hello')).toEqual([]);
    });

    it('returns all commands for empty query', () => {
      const results = getSuggestions('/');
      expect(results.length).toBe(MVP_COMMANDS.length);
    });

    it('returns all commands for whitespace-only query', () => {
      const results = getSuggestions('/   ');
      expect(results.length).toBe(MVP_COMMANDS.length);
    });

    it('filters commands by prefix', () => {
      const results = getSuggestions('/sum');
      expect(results.length).toBe(1);
      expect(results[0].trigger).toBe('summarize');
    });

    it('handles case-insensitive matching', () => {
      const results = getSuggestions('/SUM');
      expect(results.length).toBe(1);
      expect(results[0].trigger).toBe('summarize');
    });

    it('returns multiple matches', () => {
      const results = getSuggestions('/e');
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((cmd) => cmd.trigger.startsWith('e'))).toBe(true);
    });

    it('returns empty array for no matches', () => {
      const results = getSuggestions('/xyz');
      expect(results).toEqual([]);
    });

    it('uses custom command list', () => {
      const customCommands: SlashCommand[] = [
        {
          id: 'test',
          trigger: 'test',
          description: 'Test',
          parameters: [],
          promptTemplate: 'Test',
        },
      ];
      const results = getSuggestions('/t', customCommands);
      expect(results.length).toBe(1);
      expect(results[0].trigger).toBe('test');
    });
  });
});
