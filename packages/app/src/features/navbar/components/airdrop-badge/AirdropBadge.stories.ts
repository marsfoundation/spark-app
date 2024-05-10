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
}

export default meta
type Story = StoryObj<typeof AirdropBadge>

export const Desktop = getHoveredStory<Story>(
  { args: { amount: NormalizedUnitNumber(1_200_345.568), isLoading: false, isError: false } },
  'button',
)
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const Loading = getHoveredStory<Story>(
  { args: { amount: NormalizedUnitNumber(0), isLoading: true, isError: false } },
  'button',
)
export const LoadingMobile = getMobileStory(Loading)
export const LoadingTablet = getTabletStory(Loading)

export const Zero = getHoveredStory<Story>(
  { args: { amount: NormalizedUnitNumber(0), isLoading: false, isError: false } },
  'button',
)
export const ZeroMobile = getMobileStory(Zero)
export const ZeroTablet = getTabletStory(Zero)
