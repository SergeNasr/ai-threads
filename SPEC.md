# AI Threads - Product Specification

## Overview

**AI Threads** is an advanced chat interface for knowledge workers that enhances AI interaction through hierarchical threading, slash commands, and parallel execution.

### Problem Statement
Current chat interfaces (ChatGPT, Claude) are linear and basic, leading to:
- Repetitive prompt writing
- Context derailment when exploring tangents
- Sequential workflows that interrupt flow

### Target Users
Knowledge workers who read and synthesize data:
- Students & academics
- Analysts & consultants  
- Product managers & product marketing managers

### Core Value Proposition
A chat interface that feels familiar but offers:
1. **Slash commands** - Reusable prompt shortcuts
2. **Sub-threads** - Branch conversations without losing context
3. **Parallel execution** - Multiple threads process in background

---

## Technical Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict mode) |
| State | Zustand |
| Styling | Tailwind CSS |
| Package Manager | pnpm |
| Runtime | Node.js 20+ |

### Key Principles
- **Mock-first**: All data and AI responses are mocked for rapid prototyping
- **Swappable abstractions**: Interfaces designed for easy replacement with real implementations
- **Type-safe**: Full TypeScript coverage with strict mode
- **Component-driven**: Isolated, testable UI components

---

## Data Model

### Core Types

```typescript
type ThreadId = string;
type MessageId = string;
type CommandId = string;

interface Thread {
  id: ThreadId;
  parentId: ThreadId | null;
  parentMessageId: MessageId | null; // Message where branch originated
  branchContext: string | null;       // Highlighted text that spawned this thread
  status: ThreadStatus;
  messages: Message[];
  createdAt: number;
}

type ThreadStatus = 'idle' | 'streaming' | 'queued' | 'error';

interface Message {
  id: MessageId;
  threadId: ThreadId;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}

interface SlashCommand {
  id: CommandId;
  trigger: string;        // e.g., "summarize"
  description: string;
  parameters: CommandParam[];
  promptTemplate: string; // Template with {{param}} placeholders
}

interface CommandParam {
  name: string;
  required: boolean;
  description: string;
}

interface AppState {
  threads: Record<ThreadId, Thread>;
  activeThreadId: ThreadId;
  rootThreadId: ThreadId;
  commands: SlashCommand[];
}
```

### Thread Hierarchy

```
Root Thread
├── Message (user)
├── Message (assistant)
├── Message (user)
│   └── [text selection] → Sub-Thread A
│       ├── Message (user): "> {selected text}\n{user question}"
│       └── Message (assistant)
│           └── [text selection] → Sub-Thread B (infinite nesting)
└── Message (assistant)
```

- Threads branch from **any highlighted text** in any message
- Child threads inherit awareness of parent context
- Branching is infinitely recursive

---

## Slash Commands (MVP)

| Command | Trigger | Parameters | Prompt Template |
|---------|---------|------------|-----------------|
| Summarize | `/summarize` | none | "Summarize the key points of our conversation so far." |
| Explain | `/explain` | none | "Explain the last topic we discussed in simple terms, as if explaining to a beginner." |
| Expand | `/expand` | none | "Go deeper on the last topic. Provide more detail, examples, and nuance." |
| Tone | `/tone` | `{tone}` | "Rewrite your last response in a {{tone}} tone." |

### Command Behavior
- Commands operate on **entire thread context**
- Autocomplete dropdown appears when user types `/`
- Parameters are space-separated: `/tone formal`

---

## UI/UX Specification

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Breadcrumb: Root > Thread A > Thread B                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────────────────────────────┐  │
│  │             │  │                                     │  │
│  │   Parent    │  │          Active Thread              │  │
│  │   Thread    │  │                                     │  │
│  │  (dimmed)   │  │   [Message bubbles]                 │  │
│  │             │  │                                     │  │
│  │             │  │                                     │  │
│  │             │  ├─────────────────────────────────────┤  │
│  │             │  │  [Input area]                       │  │
│  └─────────────┘  └─────────────────────────────────────┘  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                    [⟳ 3 threads running]   │
└─────────────────────────────────────────────────────────────┘
```

### Navigation
- **Breadcrumb trail** at top for thread hierarchy
- Click any breadcrumb to navigate to that thread
- Parent thread visible as **dimmed/collapsed panel on left** when viewing child

### Thread Status Indicator
- **Bottom-right corner**: Shows count of running threads
- Click to expand **Running Threads Panel**:
  - List of active threads with status (streaming/queued)
  - Thread title/preview
  - Click to navigate to thread

### Text Selection → Sub-Thread Flow
1. User highlights any text in any message
2. Subtle button appears near selection (small icon, e.g., branch/fork icon)
3. Click button → New thread creation modal/inline
4. Input pre-filled with: `> {highlighted text}` as quoted block
5. User adds their question below the quote
6. Submit creates child thread, view transitions to it

### Message Input
- ChatGPT-style expanding textarea
- `Cmd/Ctrl + Enter` to send
- `/` triggers slash command autocomplete
- Autocomplete: filterable dropdown, arrow keys to navigate, Enter to select

### Message Display
- User messages: right-aligned, muted background
- Assistant messages: left-aligned, distinct background
- **Markdown rendering**: headings, lists, code blocks, inline code, bold, italic, links
- **Streaming**: tokens appear incrementally with subtle cursor/caret

---

## Visual Design

### Theme
Single dark theme. Professional, modern, confident.

### Color Palette

```css
:root {
  /* Backgrounds */
  --bg-primary: #1a1f1a;        /* Main background - dark green-grey */
  --bg-secondary: #232823;      /* Cards, panels */
  --bg-tertiary: #2d332d;       /* Hover states, elevated surfaces */
  
  /* Surfaces */
  --surface-user: #2a3a2a;      /* User message bubble */
  --surface-assistant: #232823; /* Assistant message bubble */
  --surface-dimmed: #1a1f1a80;  /* Dimmed parent thread (50% opacity) */
  
  /* Text */
  --text-primary: #e8ece8;      /* Primary text - off-white */
  --text-secondary: #a8b0a8;    /* Secondary text - muted */
  --text-tertiary: #6a726a;     /* Tertiary text - very muted */
  
  /* Accent */
  --accent-primary: #7a9f7a;    /* Primary accent - sage green */
  --accent-hover: #8ab08a;      /* Accent hover state */
  
  /* Semantic */
  --status-streaming: #7a9f7a;  /* Green - active */
  --status-queued: #9f9a7a;     /* Yellow-ish - waiting */
  --status-error: #9f7a7a;      /* Red-ish - error */
  
  /* Borders */
  --border-subtle: #2d332d;
  --border-emphasis: #3d433d;
}
```

### Typography

```css
:root {
  --font-sans: 'IBM Plex Sans', system-ui, sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
  
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
}
```

### Spacing
8px base unit. Use multiples: 4, 8, 12, 16, 24, 32, 48, 64.

### Border Radius
- Small elements (buttons, inputs): 6px
- Medium elements (cards, panels): 8px
- Large containers: 12px

---

## Module Breakdown

For parallel development by AI agents. Each module has clear boundaries and interfaces.

### Module 1: Design System
**Owner**: Agent 1  
**Dependencies**: None  
**Deliverables**:
- Tailwind config with custom theme
- CSS variables setup
- Base components:
  - `Button` (variants: primary, secondary, ghost)
  - `Input` (single-line)
  - `Textarea` (auto-expanding)
  - `IconButton`
  - `Tooltip`
  - `Dropdown` (for autocomplete)
  - `Badge` (for status indicators)
  - `Skeleton` (loading states)

**Interface Contract**:
```typescript
// All components export from @/components/ui
// All use className prop for extension
// All forward refs appropriately
```

---

### Module 2: Data Layer
**Owner**: Agent 2  
**Dependencies**: None (types only)  
**Deliverables**:
- Type definitions (`@/types`)
- Zustand store (`@/store`)
- Mock data generators (`@/mocks`)
- Mock response templates (10 realistic AI responses)

**Interface Contract**:
```typescript
// Store actions
interface ThreadActions {
  createThread(parentId?: ThreadId, branchContext?: string): ThreadId;
  addMessage(threadId: ThreadId, role: 'user' | 'assistant', content: string): MessageId;
  updateMessage(messageId: MessageId, content: string): void;
  setThreadStatus(threadId: ThreadId, status: ThreadStatus): void;
  setActiveThread(threadId: ThreadId): void;
  getThreadAncestors(threadId: ThreadId): Thread[];
}

// Mock service interface (swappable with real API)
interface AIService {
  streamResponse(threadId: ThreadId, prompt: string): AsyncGenerator<string>;
}
```

---

### Module 3: Thread Engine
**Owner**: Agent 3  
**Dependencies**: Module 2 (Data Layer)  
**Deliverables**:
- Thread creation/branching logic
- Parallel execution queue
- Thread navigation utilities
- Ancestor/descendant traversal

**Interface Contract**:
```typescript
interface ThreadEngine {
  // Creates root or child thread
  branch(parentMessageId: MessageId | null, selectedText: string | null): ThreadId;
  
  // Queue management for parallel execution
  enqueue(threadId: ThreadId): void;
  processQueue(): void;
  getQueueStatus(): { threadId: ThreadId; status: ThreadStatus }[];
  
  // Navigation
  getAncestorChain(threadId: ThreadId): Thread[];
  getParentThread(threadId: ThreadId): Thread | null;
}
```

---

### Module 4: Message Components
**Owner**: Agent 4  
**Dependencies**: Module 1 (Design System)  
**Deliverables**:
- `MessageBubble` - container with role-based styling
- `MessageContent` - markdown renderer
- `StreamingText` - token-by-token reveal animation
- `SelectableText` - text selection with branch button
- `BranchButton` - appears on text selection

**Interface Contract**:
```typescript
interface MessageBubbleProps {
  message: Message;
  onBranch: (selectedText: string) => void;
}

interface StreamingTextProps {
  content: string;
  isStreaming: boolean;
}
```

---

### Module 5: Slash Command System
**Owner**: Agent 5  
**Dependencies**: Module 1 (Design System), Module 2 (Data Layer)  
**Deliverables**:
- Command parser (extract command + params from input)
- `CommandAutocomplete` - dropdown UI
- Command execution (template interpolation)
- Command definitions (4 MVP commands)

**Interface Contract**:
```typescript
interface CommandSystem {
  parse(input: string): { command: SlashCommand; params: Record<string, string> } | null;
  execute(command: SlashCommand, params: Record<string, string>, threadContext: Message[]): string;
  getSuggestions(partial: string): SlashCommand[];
}
```

---

### Module 6: Layout Shell
**Owner**: Agent 6  
**Dependencies**: Module 1, 2, 3  
**Deliverables**:
- `AppShell` - main layout container
- `Breadcrumb` - thread hierarchy navigation
- `RunningThreadsIndicator` - bottom-right badge
- `RunningThreadsPanel` - expandable list of active threads
- `ParentThreadPreview` - dimmed left panel

**Interface Contract**:
```typescript
interface BreadcrumbProps {
  ancestors: Thread[];
  onNavigate: (threadId: ThreadId) => void;
}

interface RunningThreadsPanelProps {
  threads: { thread: Thread; status: ThreadStatus }[];
  onSelect: (threadId: ThreadId) => void;
}
```

---

### Module 7: Thread View
**Owner**: Agent 7  
**Dependencies**: All above  
**Deliverables**:
- `ThreadView` - main chat container
- `MessageList` - scrollable message area
- `ChatInput` - textarea with slash command integration
- Integration of all components
- Scroll management (auto-scroll on new messages)

**Interface Contract**:
```typescript
interface ThreadViewProps {
  threadId: ThreadId;
}

interface ChatInputProps {
  onSubmit: (content: string) => void;
  onCommandSelect: (command: SlashCommand) => void;
}
```

---

## File Structure

```
ai-threads/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/                    # Module 1: Design System
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── dropdown.tsx
│   │   ├── badge.tsx
│   │   ├── tooltip.tsx
│   │   ├── skeleton.tsx
│   │   └── index.ts
│   ├── message/               # Module 4: Message Components
│   │   ├── message-bubble.tsx
│   │   ├── message-content.tsx
│   │   ├── streaming-text.tsx
│   │   ├── selectable-text.tsx
│   │   ├── branch-button.tsx
│   │   └── index.ts
│   ├── command/               # Module 5: Slash Commands
│   │   ├── command-autocomplete.tsx
│   │   ├── command-parser.ts
│   │   └── index.ts
│   ├── layout/                # Module 6: Layout Shell
│   │   ├── app-shell.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── running-threads-indicator.tsx
│   │   ├── running-threads-panel.tsx
│   │   ├── parent-thread-preview.tsx
│   │   └── index.ts
│   └── thread/                # Module 7: Thread View
│       ├── thread-view.tsx
│       ├── message-list.tsx
│       ├── chat-input.tsx
│       └── index.ts
├── lib/
│   ├── types.ts               # Module 2: Types
│   ├── store.ts               # Module 2: Zustand store
│   ├── thread-engine.ts       # Module 3: Thread Engine
│   └── utils.ts               # Shared utilities
├── mocks/
│   ├── responses.ts           # Module 2: Mock AI responses
│   ├── ai-service.ts          # Module 2: Mock streaming service
│   └── data.ts                # Initial mock data
├── tailwind.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## Mock Behavior

### Response Generation
- **Delay**: Random 1-4 seconds before streaming starts
- **Streaming**: ~30-50ms per token (word)
- **Content**: Randomly selected from 10 realistic response templates
- **Context-aware**: Responses reference user input where possible

### Sample Response Templates
1. Analytical breakdown with bullet points
2. Step-by-step explanation
3. Comparison/contrast format
4. Summary with key takeaways
5. Elaboration with examples
6. Clarifying questions response
7. Code explanation (with markdown code blocks)
8. Pros/cons analysis
9. Historical/background context
10. Action items / next steps

---

## Development Phases

### Phase 1: Foundation (Modules 1-2)
- Design system components
- Type definitions
- Store setup
- Mock infrastructure

### Phase 2: Core Logic (Modules 3, 5)
- Thread engine
- Slash command system

### Phase 3: UI Components (Modules 4, 6)
- Message rendering
- Layout shell

### Phase 4: Integration (Module 7)
- Thread view
- Full app assembly
- Polish and edge cases

---

## Out of Scope (MVP)

- User authentication
- Data persistence (refresh loses state)
- Real LLM integration
- File uploads
- Export/share functionality
- Mobile responsive design
- Light theme
- Custom slash command creation
- Thread deletion
- Message editing

---

## Success Criteria

MVP is complete when:
1. User can send messages and receive streamed mock responses
2. User can highlight text and create branching sub-threads
3. User can navigate thread hierarchy via breadcrumbs
4. User can use 4 slash commands with autocomplete
5. User can see running threads indicator and panel
6. Parent thread dims when viewing child thread
7. Multiple threads can process in parallel (visible in running panel)

---

## Appendix: Component API Quick Reference

```typescript
// Design System
<Button variant="primary" | "secondary" | "ghost" />
<Input placeholder="" value="" onChange={} />
<Textarea value="" onChange={} onSubmit={} />
<Dropdown items={} onSelect={} />
<Badge variant="streaming" | "queued" | "error" />
<Tooltip content="">children</Tooltip>
<Skeleton width="" height="" />

// Message
<MessageBubble message={} onBranch={} />
<StreamingText content="" isStreaming={} />

// Command
<CommandAutocomplete query="" onSelect={} />

// Layout
<AppShell>children</AppShell>
<Breadcrumb ancestors={} onNavigate={} />
<RunningThreadsIndicator count={} onClick={} />
<RunningThreadsPanel threads={} onSelect={} />
<ParentThreadPreview thread={} />

// Thread
<ThreadView threadId="" />
<ChatInput onSubmit={} />
```
