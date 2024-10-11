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
  decorators: [WithTooltipProvider(), WithClassname('max-w-5xl flex flex-col gap-6 sm:grid sm:grid-cols-2')],
  args: {
    APY: Percentage(0.065),
    originChainId: mainnet.id,
    openConnectModal: () => {},
    savingsMeta: {
      primary: {
        savingsToken: TokenSymbol('sUSDS'),
        stablecoin: TokenSymbol('USDS'),
        rateAcronym: 'SSR',
        rateName: 'Sky Savings Rate',
      },
    },
    compact: false,
  },
}

export default meta
type Story = StoryObj<typeof SavingsOpportunityGuestMode>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const CompactDesktop: Story = {
  args: {
    compact: true,
  },
}

export const CompactMobile = getMobileStory(CompactDesktop)
export const CompactTablet = getTabletStory(CompactDesktop)
