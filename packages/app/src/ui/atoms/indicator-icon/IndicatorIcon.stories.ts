import { Meta, StoryObj } from '@storybook/react'
import { BananaIcon } from 'lucide-react'
import { IndicatorIcon } from './IndicatorIcon'

const meta: Meta<typeof IndicatorIcon> = {
  title: 'Components/Atoms/IndicatorIcon',
  component: IndicatorIcon,
  args: {
    icon: BananaIcon,
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Success: Story = {
  args: {
    variant: 'success',
  },
}

export const Neutral: Story = {
  args: {
    variant: 'neutral',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
  },
}

export const ErrorVariant: Story = {
  name: 'Error',
  args: {
    variant: 'error',
  },
}
