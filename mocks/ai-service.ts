import { ThreadId } from '@/lib/types';
import { getRandomResponse } from './responses';

export interface AIService {
  streamResponse(threadId: ThreadId, prompt: string): AsyncGenerator<string>;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function* streamResponse(
  _threadId: ThreadId,
  _prompt: string
): AsyncGenerator<string> {
  // Random delay before starting (1-4 seconds)
  const initialDelay = randomBetween(1000, 4000);
  await sleep(initialDelay);

  const response = getRandomResponse();
  const tokens = response.split(/(\s+)/); // Split by whitespace, keeping delimiters

  for (const token of tokens) {
    yield token;
    // ~40ms per token with some variance (30-50ms)
    await sleep(randomBetween(30, 50));
  }
}

export const aiService: AIService = {
  streamResponse,
};
