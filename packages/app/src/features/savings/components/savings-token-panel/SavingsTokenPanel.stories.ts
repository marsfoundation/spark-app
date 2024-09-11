import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import type { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { mainnet } from 'viem/chains'

import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'

import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { SavingsTokenPanel } from './SavingsTokenPanel'

const meta: Meta<typeof SavingsTokenPanel> = {
  title: 'Features/Savings/Components/SavingsTokenPanel',
  component: SavingsTokenPanel,
  decorators: [WithTooltipProvider(), WithClassname('max-w-2xl')],
  args: {
    variant: 'dai',
    depositedUSD: NormalizedUnitNumber(20765.7654),
    depositedUSDPrecision: 4,
    tokenWithBalance: { balance: NormalizedUnitNumber(20000.0), token: tokens.sDAI },
    APY: Percentage(0.05),
    originChainId: mainnet.id,
    savingsMetaItem: {
      savingsToken: TokenSymbol('sDAI'),
      stablecoin: TokenSymbol('DAI'),
      rateAcronym: 'DSR',
      rateName: 'DAI Savings Rate',
    },
    currentProjections: {
      thirtyDays: NormalizedUnitNumber(500),
      oneYear: NormalizedUnitNumber(2500),
    },
  },
}

export default meta
type Story = StoryObj<typeof SavingsTokenPanel>

export const Dai: Story = {}
export const DaiMobile: Story = getMobileStory(Dai)
export const DaiTablet: Story = getTabletStory(Dai)

export const USDS: Story = {
  args: {
    variant: 'usds',
    tokenWithBalance: { balance: NormalizedUnitNumber(20000.0), token: tokens.sUSDS },
  },
}
