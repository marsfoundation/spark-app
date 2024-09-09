import { Percentage } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { mainnet } from 'viem/chains'
import { SavingsOpportunityGuestMode } from './SavingsOpportunityGuestMode'

const meta: Meta<typeof SavingsOpportunityGuestMode> = {
  title: 'Features/Savings/Components/SavingsOpportunityGuestMode',
  component: SavingsOpportunityGuestMode,
  decorators: [WithTooltipProvider(), WithClassname('max-w-5xl')],
  args: {
    APY: Percentage(0.05),
    originChainId: mainnet.id,
    openConnectModal: () => {},
    savingsMeta: {
      primary: {
        savingsToken: TokenSymbol('sUSDS'),
        stablecoin: TokenSymbol('USDS'),
        savingsRateAcronym: 'SSR',
        savingsRateName: 'Sky Savings Rate',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof SavingsOpportunityGuestMode>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
