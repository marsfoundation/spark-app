import { StoryGrid } from '@sb/components/StoryGrid'
import type { Meta, StoryObj } from '@storybook/react'
import { XButton } from './XButton'

const meta: Meta<typeof XButton> = {
  title: 'Components/Atoms/New/XButton',
  args: {
    onClick: () => {},
  },
  component: (args) => (
    <StoryGrid className="grid-cols-3">
      <StoryGrid.Label>spacing none</StoryGrid.Label>
      <StoryGrid.Label>spacing xs</StoryGrid.Label>
      <StoryGrid.Label>spacing s</StoryGrid.Label>
      <XButton {...args} spacing="none" />
      <XButton {...args} spacing="xs" />
      <XButton {...args} spacing="s" />
    </StoryGrid>
  ),
}

export default meta
type Story = StoryObj<typeof XButton>

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
