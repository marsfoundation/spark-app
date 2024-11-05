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
    <StoryGrid className="grid-cols-4">
      <div />
      <StoryGrid.Label>S</StoryGrid.Label>
      <StoryGrid.Label>M</StoryGrid.Label>
      <StoryGrid.Label>L</StoryGrid.Label>

      <StoryGrid.Label>Primary</StoryGrid.Label>
      <IconButton {...args} variant="primary" size="l" />
      <IconButton {...args} variant="primary" size="m" />
      <IconButton {...args} variant="primary" size="s" />

      <StoryGrid.Label>Secondary</StoryGrid.Label>
      <IconButton {...args} variant="secondary" size="l" />
      <IconButton {...args} variant="secondary" size="m" />
      <IconButton {...args} variant="secondary" size="s" />

      <StoryGrid.Label>Tertiary</StoryGrid.Label>
      <IconButton {...args} variant="tertiary" size="l" />
      <IconButton {...args} variant="tertiary" size="m" />
      <IconButton {...args} variant="tertiary" size="s" />

      <StoryGrid.Label>Transparent</StoryGrid.Label>
      <IconButton {...args} variant="transparent" size="l" />
      <IconButton {...args} variant="transparent" size="m" />
      <IconButton {...args} variant="transparent" size="s" />
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
