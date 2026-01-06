import { SlashCommand } from '@/lib/types';

export const MVP_COMMANDS: SlashCommand[] = [
  {
    id: 'cmd-summarize',
    trigger: 'summarize',
    description: 'Summarize the key points of our conversation so far',
    parameters: [],
    promptTemplate: 'Summarize the key points of our conversation so far.',
  },
  {
    id: 'cmd-explain',
    trigger: 'explain',
    description: 'Explain the last topic in simple terms',
    parameters: [],
    promptTemplate:
      'Explain the last topic we discussed in simple terms, as if explaining to a beginner.',
  },
  {
    id: 'cmd-expand',
    trigger: 'expand',
    description: 'Go deeper on the last topic with more detail',
    parameters: [],
    promptTemplate:
      'Go deeper on the last topic. Provide more detail, examples, and nuance.',
  },
  {
    id: 'cmd-tone',
    trigger: 'tone',
    description: 'Rewrite the last response in a specific tone',
    parameters: [
      {
        name: 'tone',
        required: true,
        description: 'The tone to use (e.g., formal, casual, technical)',
      },
    ],
    promptTemplate: 'Rewrite your last response in a {{tone}} tone.',
  },
];
