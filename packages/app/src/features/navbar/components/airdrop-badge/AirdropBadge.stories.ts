import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
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

export const Desktop: Story = { args: { amount: NormalizedUnitNumber(1_200_345.568) } }

export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
