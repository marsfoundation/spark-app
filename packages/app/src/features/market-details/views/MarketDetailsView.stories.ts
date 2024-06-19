import { WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { withRouter } from 'storybook-addon-remix-react-router'

import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { bigNumberify } from '@/utils/bigNumber'

import { MarketDetailsView } from './MarketDetailsView'
import { MarketDetailsViewProps } from './types'

const meta: Meta<typeof MarketDetailsView> = {
  title: 'Features/MarketDetails/Views/MarketDetailsView',
  component: MarketDetailsView,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [WithTooltipProvider(), withRouter],
}

export default meta
type Story = StoryObj<typeof MarketDetailsView>

const args: MarketDetailsViewProps = {
  token: tokens.rETH,
  chainName: 'Ethereum Mainnet',
  chainId: 1,
  chainMismatch: false,
  walletOverview: {
    guestMode: false,
    token: tokens.rETH,
    tokenBalance: NormalizedUnitNumber(10),
    deposit: {
      token: tokens.rETH,
      available: NormalizedUnitNumber(10),
    },
    borrow: {
      token: tokens.rETH,
      eligibility: 'yes',
      available: NormalizedUnitNumber(10),
    },
  },
  marketOverview: {
    supply: {
      hasSparkAirdrop: true,
      status: 'yes',
      totalSupplied: NormalizedUnitNumber(72_000),
      supplyCap: NormalizedUnitNumber(112_000),
      apy: Percentage(0.05),
    },
    collateral: {
      status: 'yes',
      token: tokens.rETH,
      maxLtv: Percentage(0.8),
      liquidationThreshold: Percentage(0.825),
      liquidationPenalty: Percentage(0.05),
    },
    borrow: {
      hasSparkAirdrop: true,
      status: 'yes',
      totalBorrowed: NormalizedUnitNumber(1244),
      apy: Percentage(0.01),
      borrowCap: NormalizedUnitNumber(2244),
      reserveFactor: Percentage(0.05),
      chartProps: {
        optimalUtilizationRate: Percentage('0.45'),
        utilizationRate: Percentage('0.08'),
        variableRateSlope1: bigNumberify('45000000000000000000000000'),
        variableRateSlope2: bigNumberify('800000000000000000000000000'),
        baseVariableBorrowRate: bigNumberify('2500000000000000000000000'),
      },
    },
    summary: {
      type: 'default',
      marketSize: NormalizedUnitNumber(1_243_000_000),
      borrowed: NormalizedUnitNumber(823_000_000),
      available: NormalizedUnitNumber(420_000_000),
      utilizationRate: Percentage(0.66),
    },
  },
  openConnectModal: () => {},
  openDialog: () => {},
}

export const Desktop: Story = {
  args,
}

export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const DesktopChainMismatch: Story = {
  args: {
    ...args,
    chainMismatch: true,
  },
}

export const MobileChainMismatch = getMobileStory(DesktopChainMismatch)
export const TabletChainMismatch = getTabletStory(DesktopChainMismatch)
