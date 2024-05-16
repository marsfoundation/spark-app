import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { mainnet } from 'viem/chains'

import { Percentage } from '@/domain/types/NumericValues'

import { SavingsOpportunityNoCash } from './SavingsOpportunityNoCash'

const meta: Meta<typeof SavingsOpportunityNoCash> = {
  title: 'Features/Savings/Components/SavingsOpportunityNoCash',
  component: SavingsOpportunityNoCash,
  decorators: [WithTooltipProvider(), WithClassname('max-w-5xl')],
  args: {
    APY: Percentage(0.05),
    chainId: mainnet.id,
  },
}

export default meta
type Story = StoryObj<typeof SavingsOpportunityNoCash>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
