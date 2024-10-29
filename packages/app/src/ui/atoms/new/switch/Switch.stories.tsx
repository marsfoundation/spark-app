import { StoryGrid } from '@sb/components/StoryGrid'
import { Meta, StoryObj } from '@storybook/react'
import { Switch } from './Switch'

const meta: Meta<typeof Switch> = {
  title: 'Components/Atoms/New/Switch',
  component: ({ disabled }: { disabled?: boolean }) => (
    <StoryGrid className="grid-cols-2">
      <StoryGrid.Label>ON</StoryGrid.Label>
      <StoryGrid.Label>OFF</StoryGrid.Label>
      <Switch checked disabled={disabled} />
      <Switch disabled={disabled} />
    </StoryGrid>
  ),
}

export default meta
type Story = StoryObj<typeof Switch>

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
