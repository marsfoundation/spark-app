import { StoryGrid } from '@sb/components/StoryGrid'
import type { Meta, StoryObj } from '@storybook/react'
import { ChevronRightIcon, PlusIcon } from 'lucide-react'
import { Button, ButtonIcon } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Atoms/Button',
  component: (args) => (
    <StoryGrid className="grid-cols-3">
      <StoryGrid.Label>Primary</StoryGrid.Label>
      <StoryGrid.Label>Secondary</StoryGrid.Label>
      <StoryGrid.Label>Tertiary</StoryGrid.Label>

      <Button {...args} variant="primary" size="l">
        <ButtonIcon icon={PlusIcon} />
        Button
        <ButtonIcon icon={ChevronRightIcon} />
      </Button>
      <Button {...args} variant="secondary" size="l">
        <ButtonIcon icon={PlusIcon} />
        Button
        <ButtonIcon icon={ChevronRightIcon} />
      </Button>
      <Button {...args} variant="tertiary" size="l">
        <ButtonIcon icon={PlusIcon} />
        Button
        <ButtonIcon icon={ChevronRightIcon} />
      </Button>

      <Button {...args} variant="primary" size="m">
        <ButtonIcon icon={PlusIcon} />
        Button
        <ButtonIcon icon={ChevronRightIcon} />
      </Button>
      <Button {...args} variant="secondary" size="m">
        <ButtonIcon icon={PlusIcon} />
        Button
        <ButtonIcon icon={ChevronRightIcon} />
      </Button>
      <Button {...args} variant="tertiary" size="m">
        <ButtonIcon icon={PlusIcon} />
        Button
        <ButtonIcon icon={ChevronRightIcon} />
      </Button>

      <Button {...args} variant="primary" size="s">
        <ButtonIcon icon={PlusIcon} />
        Button
        <ButtonIcon icon={ChevronRightIcon} />
      </Button>
      <Button {...args} variant="secondary" size="s">
        <ButtonIcon icon={PlusIcon} />
        Button
        <ButtonIcon icon={ChevronRightIcon} />
      </Button>
      <Button {...args} variant="tertiary" size="s">
        <ButtonIcon icon={PlusIcon} />
        Button
        <ButtonIcon icon={ChevronRightIcon} />
      </Button>
    </StoryGrid>
  ),
}

export default meta
type Story = StoryObj<typeof Button>

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
