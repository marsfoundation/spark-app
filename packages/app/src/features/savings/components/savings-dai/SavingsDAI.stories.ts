import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import type { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { mainnet } from 'viem/chains'

import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'

import { SavingsDAI } from './SavingsDAI'

const meta: Meta<typeof SavingsDAI> = {
  title: 'Features/Savings/Components/SavingsDAI',
  component: SavingsDAI,
  decorators: [WithTooltipProvider(), WithClassname('max-w-2xl')],
}

export default meta
type Story = StoryObj<typeof SavingsDAI>

export const Desktop: Story = {
  name: 'Savings DAI',
  args: {
    depositedUSD: NormalizedUnitNumber(20765.7654),
    depositedUSDPrecision: 4,
    sDAIBalance: { balance: NormalizedUnitNumber(20000.0), token: tokens.sDAI },
    APY: Percentage(0.05),
    chainId: mainnet.id,
    projections: {
      thirtyDays: NormalizedUnitNumber(500),
      oneYear: NormalizedUnitNumber(2500),
    },
  },
}

export const Mobile: Story = {
  ...getMobileStory(Desktop),
  name: 'Savings DAI (Mobile)',
}
export const Tablet: Story = {
  ...getTabletStory(Desktop),
  name: 'Savings DAI (Tablet)',
}
