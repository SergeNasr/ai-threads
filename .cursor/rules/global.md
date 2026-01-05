---
description: Global project rules for AI Threads
globs: ["**/*"]
alwaysApply: true
---

# AI Threads - Global Rules

## Project Context

This is a Next.js 14+ TypeScript prototype for an advanced AI chat interface. Read `SPEC.md` for full specification.

**Key features**: hierarchical threads, slash commands, parallel execution.

## Tech Stack

- Next.js (App Router)
- TypeScript (strict)
- Zustand (state)
- Tailwind CSS (styling)
- pnpm (package manager)

## Self-Verification (REQUIRED)

Before completing ANY task, you MUST run these checks and fix all errors:

```bash
pnpm typecheck    # TypeScript errors
pnpm lint         # ESLint errors
pnpm test         # Unit tests (if applicable)
```

**Do not finish until all checks pass.**

### For UI Components (components/ui/*)
4. Create a Storybook story file (e.g., button.stories.tsx)
5. Run pnpm storybook and visually verify the component renders correctly
6. Test all variants and states in Storybook

## Code Style

### TypeScript
- Use strict mode
- Explicit return types on exported functions
- Prefer `interface` over `type` for object shapes
- No `any` - use `unknown` if truly needed

### React Components
- All components accept `className` prop for extension
- All components forward refs using `React.forwardRef`
- Include `displayName` for debugging
- Use named exports, not default exports

```typescript
// ✅ Correct
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return <button ref={ref} className={cn("...", className)} {...props} />
  }
)
Button.displayName = "Button"

// ❌ Wrong
export default function Button(props) { ... }
```

### Imports
- Use `@/` alias for all internal imports
- Import from barrel files: `@/components/ui` not `@/components/ui/button`
- Group imports: React, external libs, internal modules, types

```typescript
import { useState } from 'react'

import { clsx } from 'clsx'

import { Button } from '@/components/ui'
import { useStore } from '@/lib/store'

import type { ThreadId } from '@/lib/types'
```

### File Organization
- One component per file (except small helpers)
- Colocate tests: `button.tsx` → `button.test.tsx`
- Export from `index.ts` barrel files

### Styling
- Use Tailwind classes
- Use CSS variables from `globals.css` for theme colors
- Use `cn()` utility for conditional classes

```typescript
import { cn } from '@/lib/utils'

className={cn(
  "base-classes",
  variant === "primary" && "primary-classes",
  className
)}
```

## Mock-First Architecture

All data and AI responses are mocked. Design interfaces that can be swapped with real implementations:

```typescript
// ✅ Good - interface-based
interface AIService {
  streamResponse(threadId: string, prompt: string): AsyncGenerator<string>
}

// Implementation can be swapped
const mockService: AIService = { ... }
const realService: AIService = { ... }
```

## Testing

Write tests for:
- Utility functions
- Store actions
- Component rendering (basic smoke tests)

Use Vitest + Testing Library conventions.
