import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta } from '@storybook/react'
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

export const Desktop = getHoveredStory({ args: { amount: NormalizedUnitNumber(1_200_345.568) } }, 'button')

export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
