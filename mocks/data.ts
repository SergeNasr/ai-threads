import { AppState, SlashCommand } from '@/lib/types';

const ROOT_THREAD_ID = 'root-thread';
const WELCOME_MESSAGE_ID = 'welcome-message';

const defaultCommands: SlashCommand[] = [
  {
    id: 'cmd-summarize',
    trigger: 'summarize',
    description: 'Summarize the conversation',
    parameters: [],
    promptTemplate: 'Summarize the key points of our conversation so far.',
  },
  {
    id: 'cmd-explain',
    trigger: 'explain',
    description: 'Explain in simple terms',
    parameters: [],
    promptTemplate:
      'Explain the last topic we discussed in simple terms, as if explaining to a beginner.',
  },
  {
    id: 'cmd-expand',
    trigger: 'expand',
    description: 'Go deeper on the topic',
    parameters: [],
    promptTemplate:
      'Go deeper on the last topic. Provide more detail, examples, and nuance.',
  },
  {
    id: 'cmd-tone',
    trigger: 'tone',
    description: 'Rewrite in a specific tone',
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

export const initialData: AppState = {
  threads: {
    [ROOT_THREAD_ID]: {
      id: ROOT_THREAD_ID,
      parentId: null,
      parentMessageId: null,
      branchContext: null,
      status: 'idle',
      messages: [
        {
          id: WELCOME_MESSAGE_ID,
          threadId: ROOT_THREAD_ID,
          role: 'assistant',
          content: `Welcome to **AI Threads**! 👋

I'm here to help you explore ideas through conversation. Here's what makes this experience unique:

- **Branch conversations**: Highlight any text and create a sub-thread to explore tangents without losing context
- **Slash commands**: Type \`/\` to access shortcuts like \`/summarize\`, \`/explain\`, and more
- **Parallel threads**: Multiple conversations can run simultaneously in the background

Try asking me something, or use a slash command to get started!`,
          createdAt: Date.now(),
        },
      ],
      createdAt: Date.now(),
    },
  },
  activeThreadId: ROOT_THREAD_ID,
  rootThreadId: ROOT_THREAD_ID,
  commands: defaultCommands,
};
