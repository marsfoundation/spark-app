import { StoryGrid } from '@sb/components/StoryGrid'
import type { Meta, StoryObj } from '@storybook/react'
import { PlusIcon } from 'lucide-react'
import { ButtonWithIcon } from './ButtonWithIcon'

const meta: Meta<typeof ButtonWithIcon> = {
  title: 'Components/Atoms/New/ButtonWithIcon',
  args: {
    icon: PlusIcon,
  },
  component: (args) => (
    <StoryGrid className="grid-cols-3">
      <StoryGrid.Label>Primary</StoryGrid.Label>
      <StoryGrid.Label>Secondary</StoryGrid.Label>
      <StoryGrid.Label>Tertiary</StoryGrid.Label>

      <ButtonWithIcon {...args} variant="primary" size="l" />
      <ButtonWithIcon {...args} variant="secondary" size="l" />
      <ButtonWithIcon {...args} variant="tertiary" size="l" />

      <ButtonWithIcon {...args} variant="primary" size="m" />
      <ButtonWithIcon {...args} variant="secondary" size="m" />
      <ButtonWithIcon {...args} variant="tertiary" size="m" />

      <ButtonWithIcon {...args} variant="primary" size="s" />
      <ButtonWithIcon {...args} variant="secondary" size="s" />
      <ButtonWithIcon {...args} variant="tertiary" size="s" />
    </StoryGrid>
  ),
}

export default meta
type Story = StoryObj<typeof ButtonWithIcon>

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
