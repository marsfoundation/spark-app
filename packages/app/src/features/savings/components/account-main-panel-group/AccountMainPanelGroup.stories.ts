import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { WithClassname, WithTooltipProvider } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import type { Meta, StoryObj } from '@storybook/react'
import { AccountMainPanelGroup } from './AccountMainPanelGroup'

const meta: Meta<typeof AccountMainPanelGroup> = {
  title: 'Features/Savings/Components/AccountMainPanelGroup',
  component: AccountMainPanelGroup,
  decorators: [WithTooltipProvider(), WithClassname('max-w-[1200px]')],
  args: {
    underlyingToken: tokens.USDS,
    savingsToken: tokens.sUSDS,
    savingsTokenBalance: NormalizedUnitNumber(22_543.2349),
    calculateUnderlyingTokenBalance: () => ({
      depositedAssets: NormalizedUnitNumber(25_000.12),
      depositedAssetsPrecision: 4,
    }),
    openDepositDialog: () => {},
    openSendDialog: () => {},
    openWithdrawDialog: () => {},
    projections: {
      thirtyDays: NormalizedUnitNumber(260.4),
      oneYear: NormalizedUnitNumber(3125.0),
    },
  },
}

export default meta
type Story = StoryObj<typeof AccountMainPanelGroup>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)

export const USDC: Story = {
  args: {
    underlyingToken: tokens.USDC,
    savingsToken: tokens.sUSDC,
  },
}

export const DAI: Story = {
  args: {
    underlyingToken: tokens.DAI,
    savingsToken: tokens.sDAI,
  },
}
