import { WithClassname, WithTooltipProvider } from '@sb/decorators'
import { getHoveredStory } from '@sb/utils'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

import { tokens } from '@sb/tokens'
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
  },
}

export default meta
type Story = StoryObj<typeof RewardsBadge>

export const Desktop = getHoveredStory<Story>({}, 'button')
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
