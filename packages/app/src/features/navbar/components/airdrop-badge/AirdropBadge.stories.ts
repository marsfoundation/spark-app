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
      tokenRatePerInterval: NormalizedUnitNumber(128.248),
      tokenRatePrecision: 4,
      refreshIntervalInMs: 100,
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
      airdrop: undefined,
      isLoading: false,
      isError: false,
    },
  },
  'button',
)
export const ZeroMobile = getMobileStory(Zero)
export const ZeroTablet = getTabletStory(Zero)
