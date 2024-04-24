import { Meta, StoryObj } from '@storybook/react'

import { assets } from '@/ui/assets'

import { ColorFilter } from './ColorFilter'

const meta: Meta<typeof ColorFilter> = {
  title: 'Components/Atoms/ColorFilter',
  component: ColorFilter,
}

const children = (
  <div className="inline-flex max-w-[100px] gap-2">
    <img src={assets.token.wsteth} />
    <img src={assets.token.gno} />
    <img src={assets.token.usdt} />
    <img src={assets.token.usdc} />
  </div>
)

export default meta
type Story = StoryObj<typeof meta>

export const Red: Story = {
  args: {
    variant: 'red',
    children,
  },
}

export const Green: Story = {
  args: {
    variant: 'green',
    children,
  },
}

export const Blue: Story = {
  args: {
    variant: 'blue',
    children,
  },
}

export const None: Story = {
  args: {
    variant: 'none',
    children,
  },
}
