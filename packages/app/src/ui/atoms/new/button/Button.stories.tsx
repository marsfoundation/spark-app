import { StoryGrid } from '@sb/components/StoryGrid'
import type { Meta, StoryObj } from '@storybook/react'
import { ChevronRightIcon, PlusIcon } from 'lucide-react'
import { Button, ButtonIcon, ButtonProps } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Atoms/New/Button',
  component: (args) => (
    <div className="flex flex-col gap-4">
      <ButtonStoryGrid {...args} />
      <IconButtonStoryGrid {...args} />
    </div>
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

function ButtonStoryGrid(args: ButtonProps) {
  return (
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
  )
}

function IconButtonStoryGrid(args: ButtonProps) {
  return (
    <StoryGrid className="grid-cols-3">
      <StoryGrid.Label>Primary</StoryGrid.Label>
      <StoryGrid.Label>Secondary</StoryGrid.Label>
      <StoryGrid.Label>Tertiary</StoryGrid.Label>

      <Button {...args} variant="primary" size="l">
        <ButtonIcon icon={PlusIcon} />
      </Button>
      <Button {...args} variant="secondary" size="l">
        <ButtonIcon icon={PlusIcon} />
      </Button>
      <Button {...args} variant="tertiary" size="l">
        <ButtonIcon icon={PlusIcon} />
      </Button>

      <Button {...args} variant="primary" size="m">
        <ButtonIcon icon={PlusIcon} />
      </Button>
      <Button {...args} variant="secondary" size="m">
        <ButtonIcon icon={PlusIcon} />
      </Button>
      <Button {...args} variant="tertiary" size="m">
        <ButtonIcon icon={PlusIcon} />
      </Button>

      <Button {...args} variant="primary" size="s">
        <ButtonIcon icon={PlusIcon} />
      </Button>
      <Button {...args} variant="secondary" size="s">
        <ButtonIcon icon={PlusIcon} />
      </Button>
      <Button {...args} variant="tertiary" size="s">
        <ButtonIcon icon={PlusIcon} />
      </Button>
    </StoryGrid>
  )
}
