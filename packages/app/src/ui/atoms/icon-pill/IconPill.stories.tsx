import { Meta, StoryObj } from '@storybook/react'

import { assets } from '@/ui/assets'

import { IconPill } from './IconPill'

const meta: Meta<typeof IconPill> = {
  title: 'Components/Atoms/IconPill',
  component: IconPill,
}

export default meta
type Story = StoryObj<typeof IconPill>

export const Default: Story = {
  name: 'Default',
  args: {
    icon: assets.sparkIcon,
  },
}
