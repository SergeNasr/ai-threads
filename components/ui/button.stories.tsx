import type { Meta, StoryObj } from '@storybook/nextjs-vite'
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
