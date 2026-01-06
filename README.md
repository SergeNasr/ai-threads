# AI Threads

[![CI](https://github.com/SergeNasr/ai-threads/actions/workflows/ci.yml/badge.svg)](https://github.com/SergeNasr/ai-threads/actions/workflows/ci.yml)

Advanced chat interface for AI interactions with hierarchical threading, slash commands, and parallel execution.

## Features

- **Sub-threads**: Branch conversations from any selected text without losing context
- **Slash commands**: `/summarize`, `/explain`, `/expand`, `/tone {style}`
- **Parallel execution**: Multiple threads process in background
- **Streaming responses**: Token-by-token display (mocked)

## Quick Start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm typecheck` | TypeScript check |
| `pnpm lint` | ESLint |
| `pnpm test` | Run tests |
| `pnpm verify` | typecheck + lint + test |
| `pnpm storybook` | Component playground |

## Architecture

```
components/
├── ui/          # Design system (Button, Input, Dropdown, etc.)
├── message/     # Chat messages, markdown, streaming, text selection
├── command/     # Slash command parser + autocomplete
├── layout/      # App shell, breadcrumbs, running threads panel
└── thread/      # Thread view, message list, chat input

lib/
├── types.ts         # TypeScript interfaces
├── store.ts         # Zustand state
├── thread-engine.ts # Threading logic, parallel queue
└── utils.ts         # Utilities (cn)

mocks/
├── ai-service.ts    # Streaming response simulator
├── responses.ts     # Response templates
└── data.ts          # Initial state
```

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Zustand
- Vitest + Testing Library

## Status

MVP prototype with mocked AI responses. No persistence — state resets on refresh.

See [SPEC.md](./SPEC.md) for full specification.
