import { StoryGrid } from '@sb/components/StoryGrid'
import type { Meta, StoryObj } from '@storybook/react'
import { PlusIcon } from 'lucide-react'
import { IconButton, IconButtonProps } from './IconButton'

const meta: Meta<typeof IconButton> = {
  title: 'Components/Atoms/New/IconButton',
  args: {
    children: <PlusIcon />,
  },
  component: (props: IconButtonProps) => (
    <StoryGrid className="grid-cols-3">
      <StoryGrid.Label>Primary</StoryGrid.Label>
      <StoryGrid.Label>Secondary</StoryGrid.Label>
      <StoryGrid.Label>Tertiary</StoryGrid.Label>

      <IconButton variant="primary" size="l" {...props} />
      <IconButton variant="secondary" size="l" {...props} />
      <IconButton variant="tertiary" size="l" {...props} />

      <IconButton variant="primary" size="m" {...props} />
      <IconButton variant="secondary" size="m" {...props} />
      <IconButton variant="tertiary" size="m" {...props} />

      <IconButton variant="primary" size="s" {...props} />
      <IconButton variant="secondary" size="s" {...props} />
      <IconButton variant="tertiary" size="s" {...props} />
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
