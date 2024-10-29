import type { Meta, StoryObj } from '@storybook/react'
import { CloseButton } from './CloseButton'

const meta: Meta<typeof CloseButton> = {
  title: 'Components/Atoms/New/CloseButton',
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
