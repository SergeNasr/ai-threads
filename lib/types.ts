export type ThreadId = string;
export type MessageId = string;
export type CommandId = string;

export type ThreadStatus = 'idle' | 'streaming' | 'queued' | 'error';

export interface Thread {
  id: ThreadId;
  parentId: ThreadId | null;
  parentMessageId: MessageId | null;
  branchContext: string | null;
  status: ThreadStatus;
  messages: Message[];
  createdAt: number;
}

export interface Message {
  id: MessageId;
  threadId: ThreadId;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}

export interface SlashCommand {
  id: CommandId;
  trigger: string;
  description: string;
  parameters: CommandParam[];
  promptTemplate: string;
}

export interface CommandParam {
  name: string;
  required: boolean;
  description: string;
}

export interface AppState {
  threads: Record<ThreadId, Thread>;
  activeThreadId: ThreadId;
  rootThreadId: ThreadId;
  commands: SlashCommand[];
}
