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
      tokenRatePerInterval: NormalizedUnitNumber(0.1),
      tokenRatePrecision: 1,
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

export const LargeAirdrop = getHoveredStory<Story>(
  {
    args: {
      airdrop: {
        tokenReward: NormalizedUnitNumber('7835102.158890800802961891'),
        tokenRatePerInterval: NormalizedUnitNumber('0.0262135690260185551'),
        tokenRatePrecision: 2,
        refreshIntervalInMs: 100,
      },
    },
  },
  'button',
)

export const SmallAirdrop = getHoveredStory<Story>(
  {
    args: {
      airdrop: {
        tokenReward: NormalizedUnitNumber('0.005822830257558254'),
        tokenRatePerInterval: NormalizedUnitNumber('2.37304339E-10'),
        tokenRatePrecision: 10,
        refreshIntervalInMs: 100,
      },
    },
  },
  'button',
)
export const AlmostZero = getHoveredStory<Story>(
  {
    args: {
      airdrop: {
        tokenReward: NormalizedUnitNumber('8.73949580999E-7'),
        tokenRatePerInterval: NormalizedUnitNumber('2.8442E-14'),
        tokenRatePrecision: 14,
        refreshIntervalInMs: 100,
      },
    },
  },
  'button',
)

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
