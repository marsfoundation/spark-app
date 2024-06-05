import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getHoveredStory } from '@storybook/utils'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

import { AirdropBadge } from './AirdropBadge'

const meta: Meta<typeof AirdropBadge> = {
  title: 'Features/Navbar/Components/AirdropBadge',
  decorators: [WithTooltipProvider(), WithClassname('flex')],
  component: AirdropBadge,
  args: {
    airdrop: {
      tokenReward: NormalizedUnitNumber(1_200_345.568),
      tokenRatePerSecond: NormalizedUnitNumber(128.248),
      timestamp: Math.floor(Date.now() / 1000) - 30, // Airdrop snapshot is ofter few seconds behind
    },
    isLoading: false,
    isError: false,
  },
}

export default meta
type Story = StoryObj<typeof AirdropBadge>

export const Desktop = getHoveredStory<Story>({}, 'button')
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const Loading = getHoveredStory<Story>({ args: { ...meta.args, isLoading: true, isError: false } }, 'button')
export const LoadingMobile = getMobileStory(Loading)
export const LoadingTablet = getTabletStory(Loading)

export const Zero = getHoveredStory<Story>(
  {
    args: {
      airdrop: {
        tokenReward: NormalizedUnitNumber(0),
        tokenRatePerSecond: NormalizedUnitNumber(0),
        timestamp: meta.args?.airdrop?.timestamp!,
      },
      isLoading: false,
      isError: false,
    },
  },
  'button',
)
export const ZeroMobile = getMobileStory(Zero)
export const ZeroTablet = getTabletStory(Zero)
