import { tokens } from '@sb/tokens'
import { Meta, StoryObj } from '@storybook/react'

import { TokenSymbol } from '@/domain/types/TokenSymbol'

import { TokenPill } from './TokenPill'

const meta: Meta<typeof TokenPill> = {
  title: 'Features/Markets/Components/TokenPill',
  component: TokenPill,
}

export default meta
type Story = StoryObj<typeof TokenPill>

export const Default: Story = {
  name: 'Default',
  args: {
    tokenSymbol: tokens.wstETH.symbol,
  },
}
export const UnknownToken: Story = {
  name: 'UnknownToken',
  args: {
    tokenSymbol: TokenSymbol('SOME'),
  },
}
