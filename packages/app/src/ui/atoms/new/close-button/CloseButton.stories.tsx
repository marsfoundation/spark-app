import { cn } from '@/ui/utils/style'
import { WithClassname } from '@sb/decorators'
import type { Meta, StoryObj } from '@storybook/react'
import { CloseButton } from './CloseButton'

const meta: Meta<typeof CloseButton> = {
  title: 'Components/Atoms/New/CloseButton',
  decorators: [WithClassname(cn('flex h-12 w-12 items-center justify-center bg-white'))],
  component: CloseButton,
  args: {
    onClose: () => {},
  },
}

export default meta
type Story = StoryObj<typeof CloseButton>

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
