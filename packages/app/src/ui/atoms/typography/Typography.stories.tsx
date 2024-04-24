import type { Meta, StoryObj } from '@storybook/react'

import { Typography } from './Typography'

const meta: Meta<typeof Typography> = {
  title: 'Components/Atoms/Typography',
  component: Typography,
}

export default meta
type Story = StoryObj<typeof Typography>

export const Default: Story = {
  name: 'Default',
  args: {
    children: 'Default',
  },
}

export const Paragraph: Story = {
  name: 'Paragraph',
  args: {
    variant: 'p',
    children: 'Paragraph',
  },
}

export const Span: Story = {
  name: 'Span',
  args: {
    variant: 'span',
    children: 'Span',
  },
}

export const H1: Story = {
  name: 'H1',
  args: {
    variant: 'h1',
    children: 'H1',
  },
}

export const H2: Story = {
  name: 'H2',
  args: {
    variant: 'h2',
    children: 'H2',
  },
}

export const H3: Story = {
  name: 'H3',
  args: {
    variant: 'h3',
    children: 'H3',
  },
}

export const H4: Story = {
  name: 'H4',
  args: {
    variant: 'h4',
    children: 'H4',
  },
}

export const Prompt: Story = {
  name: 'Prompt',
  args: {
    variant: 'prompt',
    children: 'Prompt',
  },
}
