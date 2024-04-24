import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { Percentage } from '@/domain/types/NumericValues'

import { SavingsOpportunityGuestMode } from './SavingsOpportunityGuestMode'

const meta: Meta<typeof SavingsOpportunityGuestMode> = {
  title: 'Features/Savings/Components/SavingsOpportunityGuestMode',
  component: SavingsOpportunityGuestMode,
  decorators: [WithTooltipProvider(), WithClassname('max-w-5xl')],
  args: {
    DSR: Percentage(0.05),
    openConnectModal: () => {},
  },
}

export default meta
type Story = StoryObj<typeof SavingsOpportunityGuestMode>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
