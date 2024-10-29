import { WithClassname, WithTooltipProvider } from '@storybook-config/decorators'
import { tokens } from '@storybook-config/tokens'
import { getHoveredStory } from '@storybook-config/utils'
import { Meta, StoryObj } from '@storybook/react'

import { Percentage } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

import { RewardBadge } from './RewardBadge'

const meta: Meta<typeof RewardBadge> = {
  title: 'Features/Markets/Components/RewardBadge',
  component: RewardBadge,
  decorators: [WithTooltipProvider(), WithClassname('bg-white flex justify-center p-8 items-end w-96 h-56')],
}

export default meta
type Story = StoryObj<typeof RewardBadge>

export const Default: Story = {
  name: 'Default',
  args: {
    incentivizedReserve: tokens.DAI.symbol,
    rewardApr: Percentage(0.011),
    rewardToken: tokens.wstETH.symbol,
  },
}

export const Hovered = getHoveredStory(Default, 'button')

export const UnknownToken: Story = {
  name: 'UnknownToken',
  args: {
    incentivizedReserve: tokens.DAI.symbol,
    rewardApr: Percentage(0.011),
    rewardToken: TokenSymbol('SOME'),
  },
}
