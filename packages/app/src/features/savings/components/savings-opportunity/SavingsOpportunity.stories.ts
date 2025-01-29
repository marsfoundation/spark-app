import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { NormalizedUnitNumber, Percentage } from '@marsfoundation/common-universal'
import { WithClassname, WithTooltipProvider } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import type { Meta, StoryObj } from '@storybook/react'
import { mainnet } from 'viem/chains'
import { SavingsOpportunity } from './SavingsOpportunity'

const meta: Meta<typeof SavingsOpportunity> = {
  title: 'Features/Savings/Components/SavingsOpportunity',
  component: SavingsOpportunity,
  decorators: [WithTooltipProvider(), WithClassname('max-w-5xl flex flex-col gap-6 sm:grid sm:grid-cols-2')],
  args: {
    APY: Percentage(0.065),
    originChainId: mainnet.id,
    savingsMeta: {
      primary: {
        savingsToken: TokenSymbol('sUSDS'),
        stablecoin: TokenSymbol('USDS'),
        rateAcronym: 'SSR',
        rateName: 'Sky Savings Rate',
      },
    },
    savingsToken: tokens.sUSDS,
  },
}

export default meta
type Story = StoryObj<typeof SavingsOpportunity>

export const NoCashDesktop: Story = {
  args: {
    totalEligibleCashUSD: NormalizedUnitNumber(0),
  },
}

export const NoCashMobile: Story = getMobileStory(NoCashDesktop)
export const NoCashTablet: Story = getTabletStory(NoCashDesktop)

export const WithCashDesktop: Story = {
  args: {
    totalEligibleCashUSD: NormalizedUnitNumber(1_000_000),
  },
}

export const WithCashMobile: Story = getMobileStory(WithCashDesktop)
export const WithCashTablet: Story = getTabletStory(WithCashDesktop)
