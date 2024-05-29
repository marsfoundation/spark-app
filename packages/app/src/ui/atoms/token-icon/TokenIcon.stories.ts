import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'

import { TokenIcon } from './TokenIcon'

const meta: Meta<typeof TokenIcon> = {
  title: 'Components/Atoms/TokenIcon',
  component: TokenIcon,
  args: {
    className: 'h-12 w-12',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const DAI: Story = {
  args: {
    token: tokens.DAI,
  },
}
export const aDAI: Story = {
  name: 'aDAI',
  args: {
    token: tokens.DAI.createAToken(tokens.DAI.address),
  },
}
export const WETH: Story = {
  args: {
    token: tokens.WETH,
  },
}
export const aWETH: Story = {
  name: 'aWETH',
  args: {
    token: tokens.WETH.createAToken(tokens.WETH.address),
  },
}
