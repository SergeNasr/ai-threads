# Task: Set Up Storybook for Component Development

Read SPEC.md for project context. You are setting up Storybook for visual component testing.

## Step 1: Install Storybook

Run these commands:

pnpm dlx storybook@latest init --builder vite --skip-install --no-dev
pnpm install

## Step 2: Configure for Tailwind

Update `.storybook/preview.ts` to import global styles and set dark background:

import type { Preview } from '@storybook/react'
import '../app/globals.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#1a1f1a' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview

## Step 3: Add Scripts to package.json

Add these scripts:
- "storybook": "storybook dev -p 6006"
- "build-storybook": "storybook build"

## Step 4: Update Global Rules

Append to `.cursor/rules/global.md` under the "## Self-Verification" section:

### For UI Components (components/ui/*)
4. Create a Storybook story file (e.g., button.stories.tsx)
5. Run pnpm storybook and visually verify the component renders correctly
6. Test all variants and states in Storybook

## Step 5: Create Example Story Template

Create `components/ui/button.stories.tsx` as a reference template for future component authors:

import type { Meta, StoryObj } from '@storybook/react'
// import { Button } from './button' // uncomment when Button exists

const meta: Meta = {
  title: 'UI/Button',
  // component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
    },
  },
}

export default meta
type Story = StoryObj

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Button',
  },
}

## Step 6: Verify Setup

1. Run pnpm storybook
2. Confirm it opens at http://localhost:6006
3. Confirm the dark background (#1a1f1a) is applied
4. Run pnpm typecheck and pnpm lint - fix any errors

Do not finish until Storybook runs without errors.
