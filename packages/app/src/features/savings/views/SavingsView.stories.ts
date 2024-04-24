import { WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'

import { SavingsView } from './SavingsView'

const meta: Meta<typeof SavingsView> = {
  title: 'Features/Savings/Views/SavingsView',
  component: SavingsView,
  decorators: [WithTooltipProvider()],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    DSR: Percentage(0.05),
    depositedUSD: NormalizedUnitNumber(20765.7654),
    sDAIBalance: { balance: NormalizedUnitNumber(20000.0), token: tokens['sDAI'] },
    currentProjections: {
      thirtyDays: NormalizedUnitNumber(500),
      oneYear: NormalizedUnitNumber(2500),
    },
    opportunityProjections: {
      thirtyDays: NormalizedUnitNumber(50),
      oneYear: NormalizedUnitNumber(1500),
    },
    assetsInWallet: [
      {
        token: tokens['DAI'],
        balance: NormalizedUnitNumber(22727),
      },
      {
        token: tokens['USDT'],
        balance: NormalizedUnitNumber(22727),
      },
      {
        token: tokens['USDC'],
        balance: NormalizedUnitNumber(0),
      },
    ],
    maxBalanceToken: {
      token: tokens['DAI'],
      balance: NormalizedUnitNumber(22727),
    },
    totalEligibleCashUSD: NormalizedUnitNumber(45454),
    depositedUSDPrecision: 2,
    openDialog: () => {},
  },
}

export default meta
type Story = StoryObj<typeof SavingsView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const NoDeposit: Story = {
  name: 'No deposit',
  args: {
    depositedUSD: NormalizedUnitNumber(0),
    sDAIBalance: { balance: NormalizedUnitNumber(0), token: tokens['sDAI'] },
    currentProjections: {
      thirtyDays: NormalizedUnitNumber(0),
      oneYear: NormalizedUnitNumber(0),
    },
  },
}
export const NoDepositMobile = {
  ...getMobileStory(NoDeposit),
  name: 'No deposit (Mobile)',
}
export const NoDepositTablet = {
  ...getTabletStory(NoDeposit),
  name: 'No deposit (Tablet)',
}

export const AllIn: Story = {
  name: 'All in',
  args: {
    opportunityProjections: {
      thirtyDays: NormalizedUnitNumber(0),
      oneYear: NormalizedUnitNumber(0),
    },
  },
}
export const AllInMobile = {
  ...getMobileStory(AllIn),
  name: 'All in (Mobile)',
}
export const AllInTablet = {
  ...getTabletStory(AllIn),
  name: 'All in (Tablet)',
}

export const NoDepositNoCash: Story = {
  name: 'No deposit, no cash',
  args: {
    depositedUSD: NormalizedUnitNumber(0),
    sDAIBalance: { balance: NormalizedUnitNumber(0), token: tokens['sDAI'] },
    currentProjections: {
      thirtyDays: NormalizedUnitNumber(0),
      oneYear: NormalizedUnitNumber(0),
    },
    opportunityProjections: {
      thirtyDays: NormalizedUnitNumber(0),
      oneYear: NormalizedUnitNumber(0),
    },
    assetsInWallet: [
      {
        token: tokens['DAI'],
        balance: NormalizedUnitNumber(0),
      },
      {
        token: tokens['USDT'],
        balance: NormalizedUnitNumber(0),
      },
      {
        token: tokens['USDC'],
        balance: NormalizedUnitNumber(0),
      },
    ],
  },
}
export const NoDepositNoCashMobile = {
  ...getMobileStory(NoDepositNoCash),
  name: 'No deposit, no cash (Mobile)',
}
export const NoDepositNoCashTablet = {
  ...getTabletStory(NoDepositNoCash),
  name: 'No deposit, no cash (Tablet)',
}

export const BigNumbersDesktop: Story = {
  name: 'Big numbers',
  args: {
    depositedUSD: NormalizedUnitNumber(134395765.123482934245),
    depositedUSDPrecision: 0,
    sDAIBalance: { balance: NormalizedUnitNumber(134000000.0), token: tokens['sDAI'] },
    DSR: Percentage(0.05),
    currentProjections: {
      thirtyDays: NormalizedUnitNumber(1224300.923423423),
      oneYear: NormalizedUnitNumber(6345543.32945601),
    },
    opportunityProjections: {
      thirtyDays: NormalizedUnitNumber(1224300.923423423),
      oneYear: NormalizedUnitNumber(6345543.32945601),
    },
    assetsInWallet: [
      {
        token: tokens['DAI'],
        balance: NormalizedUnitNumber(232134925.90911123),
      },
      {
        token: tokens['USDT'],
        balance: NormalizedUnitNumber(601234014.134234),
      },
      {
        token: tokens['USDC'],
        balance: NormalizedUnitNumber(12312.90345),
      },
    ],
  },
}
export const BigNumbersMobile: Story = {
  ...getMobileStory(BigNumbersDesktop),
  name: 'Big numbers (Mobile)',
}
export const BigNumbersTablet: Story = {
  ...getTabletStory(BigNumbersDesktop),
  name: 'Big numbers (Tablet)',
}
