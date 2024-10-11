import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import type { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
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
  },
}

export default meta
type Story = StoryObj<typeof SavingsOpportunity>

export const NoCashDesktopDefault: Story = {
  args: {
    totalEligibleCashUSD: NormalizedUnitNumber(0),
  },
}

export const NoCashMobileDefault: Story = getMobileStory(NoCashDesktopDefault)
export const NoCashTabletDefault: Story = getTabletStory(NoCashDesktopDefault)

export const NoCashDesktopCompact: Story = {
  args: {
    totalEligibleCashUSD: NormalizedUnitNumber(0),
    compact: true,
  },
}

export const NoCashMobileCompact: Story = getMobileStory(NoCashDesktopCompact)
export const NoCashTabletCompact: Story = getTabletStory(NoCashDesktopCompact)

export const WithCashDesktopDefault: Story = {
  args: {
    totalEligibleCashUSD: NormalizedUnitNumber(1_000_000),
  },
}

export const WithCashMobileDefault: Story = getMobileStory(WithCashDesktopDefault)
export const WithCashTabletDefault: Story = getTabletStory(WithCashDesktopDefault)

export const WithCashDesktopCompact: Story = {
  args: {
    totalEligibleCashUSD: NormalizedUnitNumber(1_000_000),
    compact: true,
  },
}

export const WithCashMobileCompact: Story = getMobileStory(WithCashDesktopCompact)
export const WithCashTabletCompact: Story = getTabletStory(WithCashDesktopCompact)
