import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { Percentage } from '@/domain/types/NumericValues'

import { SavingsOpportunityNoCash } from './SavingsOpportunityNoCash'

const meta: Meta<typeof SavingsOpportunityNoCash> = {
  title: 'Features/Savings/Components/SavingsOpportunityNoCash',
  component: SavingsOpportunityNoCash,
  decorators: [WithTooltipProvider(), WithClassname('max-w-5xl')],
  args: {
    DSR: Percentage(0.05),
  },
}

export default meta
type Story = StoryObj<typeof SavingsOpportunityNoCash>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
