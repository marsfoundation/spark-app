import { StoryGrid } from '@sb/components/StoryGrid'
import type { Meta, StoryObj } from '@storybook/react'
import { XIcon } from 'lucide-react'
import { IconButton } from './IconButton'

const meta: Meta<typeof IconButton> = {
  title: 'Components/Atoms/New/IconButton',
  args: {
    onClick: () => {},
    icon: XIcon,
  },
  component: (args) => (
    <StoryGrid className="grid-cols-3">
      <StoryGrid.Label>spacing none</StoryGrid.Label>
      <StoryGrid.Label>spacing xs</StoryGrid.Label>
      <StoryGrid.Label>spacing s</StoryGrid.Label>
      <IconButton {...args} spacing="none" />
      <IconButton {...args} spacing="xs" />
      <IconButton {...args} spacing="s" />
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
