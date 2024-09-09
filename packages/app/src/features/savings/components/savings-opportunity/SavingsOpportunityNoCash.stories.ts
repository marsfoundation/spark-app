import { Percentage } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { mainnet } from 'viem/chains'
import { SavingsOpportunityNoCash } from './SavingsOpportunityNoCash'

const meta: Meta<typeof SavingsOpportunityNoCash> = {
  title: 'Features/Savings/Components/SavingsOpportunityNoCash',
  component: SavingsOpportunityNoCash,
  decorators: [WithTooltipProvider(), WithClassname('max-w-5xl')],
  args: {
    APY: Percentage(0.05),
    originChainId: mainnet.id,
    savingsMeta: {
      primary: {
        savingsToken: TokenSymbol('sUSDS'),
        stablecoin: TokenSymbol('USDS'),
        rateAcronym: 'SSR',
        rateName: 'Sky Savings Rate',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof SavingsOpportunityNoCash>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
