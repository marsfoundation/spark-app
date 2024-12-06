import { WithTooltipProvider } from '@sb/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { CopyButton } from './CopyButton'

const meta: Meta<typeof CopyButton> = {
  title: 'Components/Molecules/CopyButton',
  component: CopyButton,
  decorators: [WithTooltipProvider()],
  args: {
    text: 'Hello, world!',
  },
}

export default meta
type Story = StoryObj<typeof CopyButton>

export const Default: Story = {}
