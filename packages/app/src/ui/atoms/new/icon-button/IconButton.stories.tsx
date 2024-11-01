import { StoryGrid } from '@sb/components/StoryGrid'
import type { Meta, StoryObj } from '@storybook/react'
import { PlusIcon } from 'lucide-react'
import { IconButton } from './IconButton'

const meta: Meta<typeof IconButton> = {
  title: 'Components/Atoms/New/IconButton',
  args: {
    icon: PlusIcon,
  },
  component: (args) => (
    <StoryGrid className="grid-cols-3">
      <StoryGrid.Label>Primary</StoryGrid.Label>
      <StoryGrid.Label>Secondary</StoryGrid.Label>
      <StoryGrid.Label>Tertiary</StoryGrid.Label>

      <IconButton {...args} variant="primary" size="l" />
      <IconButton {...args} variant="secondary" size="l" />
      <IconButton {...args} variant="tertiary" size="l" />

      <IconButton {...args} variant="primary" size="m" />
      <IconButton {...args} variant="secondary" size="m" />
      <IconButton {...args} variant="tertiary" size="m" />

      <IconButton {...args} variant="primary" size="s" />
      <IconButton {...args} variant="secondary" size="s" />
      <IconButton {...args} variant="tertiary" size="s" />
    </StoryGrid>
  ),
}

export default meta
type Story = StoryObj<typeof IconButton>

export const Default: Story = {}

export const Hovered: Story = {
  parameters: {
    pseudo: {
      hover: true,
    },
  },
}

export const Focused: Story = {
  parameters: {
    pseudo: {
      focusVisible: true,
    },
  },
}

export const Pressed: Story = {
  parameters: {
    pseudo: {
      active: true,
    },
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const Loading: Story = {
  args: {
    loading: true,
  },
}
