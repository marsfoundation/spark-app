import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getHoveredStory } from '@storybook/utils'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

import { tokens } from '@storybook/tokens'
import { RewardsBadge } from './RewardsBadge'

const meta: Meta<typeof RewardsBadge> = {
  title: 'Features/Navbar/Components/RewardsBadge',
  decorators: [WithTooltipProvider(), WithClassname('flex')],
  component: RewardsBadge,
  args: {
    rewards: [
      {
        token: tokens.wstETH,
        amount: NormalizedUnitNumber(0.00157),
      },
      {
        token: tokens.WBTC,
        amount: NormalizedUnitNumber(0.0003498),
      },
    ],
    isLoading: false,
  },
}

export default meta
type Story = StoryObj<typeof RewardsBadge>

export const Desktop = getHoveredStory<Story>({}, 'button')
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
export const Loading: Story = {
  ...Desktop,
  args: {
    isLoading: true,
    rewards: [],
  },
}
