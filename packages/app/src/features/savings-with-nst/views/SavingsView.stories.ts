import { WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { mainnet } from 'viem/chains'

import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { SavingsView } from './SavingsView'

const meta: Meta<typeof SavingsView> = {
  title: 'Features/SavingsWithNst/Views/SavingsView',
  component: SavingsView,
  decorators: [WithTooltipProvider()],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    chainId: mainnet.id,
    opportunityProjections: {
      thirtyDays: NormalizedUnitNumber(50),
      oneYear: NormalizedUnitNumber(1500),
    },
    assetsInWallet: [
      {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(22727),
      },
      {
        token: tokens.NST,
        balance: NormalizedUnitNumber(12345),
      },
      {
        token: tokens.USDC,
        balance: NormalizedUnitNumber(0),
      },
    ],
    maxBalanceToken: {
      token: tokens.DAI,
      balance: NormalizedUnitNumber(22727),
    },
    totalEligibleCashUSD: NormalizedUnitNumber(45454),
    openDialog: () => {},
    sDai: {
      APY: Percentage(0.05),
      tokenWithBalance: { balance: NormalizedUnitNumber(20_000), token: tokens.sDAI },
      projections: {
        thirtyDays: NormalizedUnitNumber(500),
        oneYear: NormalizedUnitNumber(2500),
      },
      depositedUSD: NormalizedUnitNumber(20765.7654),
      depositedUSDPrecision: 2,
    },
    sNst: {
      APY: Percentage(0.05),
      tokenWithBalance: { balance: NormalizedUnitNumber(10_000), token: tokens.sNST },
      projections: {
        thirtyDays: NormalizedUnitNumber(250),
        oneYear: NormalizedUnitNumber(1250),
      },
      depositedUSD: NormalizedUnitNumber(10365.7654),
      depositedUSDPrecision: 2,
    },
  },
}

export default meta
type Story = StoryObj<typeof SavingsView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const OnlyDai: Story = {
  args: {
    sNst: undefined,
  },
}
export const OnlyDaiMobile: Story = {
  name: 'Only Dai (Mobile)',
  ...getMobileStory(OnlyDai),
}
export const OnlyDaiTablet: Story = {
  name: 'Only Dai (Tablet)',
  ...getTabletStory(OnlyDai),
}

export const OnlyNST: Story = {
  args: {
    sDai: {
      APY: Percentage(0.05),
      tokenWithBalance: { balance: NormalizedUnitNumber(0), token: tokens.sDAI },
      projections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
      depositedUSD: NormalizedUnitNumber(0),
      depositedUSDPrecision: 2,
    },
  },
}
export const OnlyNSTMobile: Story = {
  name: 'Only NST (Mobile)',
  ...getMobileStory(OnlyNST),
}
export const OnlyNSTTablet: Story = {
  name: 'Only NST (Tablet)',
  ...getTabletStory(OnlyNST),
}

export const NoDeposit: Story = {
  name: 'No deposit',
  args: {
    sDai: {
      APY: Percentage(0.05),
      tokenWithBalance: { balance: NormalizedUnitNumber(0), token: tokens.sDAI },
      projections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
      depositedUSD: NormalizedUnitNumber(0),
      depositedUSDPrecision: 2,
    },
    sNst: {
      APY: Percentage(0.05),
      tokenWithBalance: { balance: NormalizedUnitNumber(0), token: tokens.sNST },
      projections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
      depositedUSD: NormalizedUnitNumber(0),
      depositedUSDPrecision: 2,
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
    assetsInWallet: [
      {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(0),
      },
      {
        token: tokens.NST,
        balance: NormalizedUnitNumber(0),
      },
      {
        token: tokens.USDC,
        balance: NormalizedUnitNumber(0),
      },
    ],
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

export const AllInOnlyDai: Story = {
  args: {
    sNst: undefined,
    opportunityProjections: {
      thirtyDays: NormalizedUnitNumber(0),
      oneYear: NormalizedUnitNumber(0),
    },
    assetsInWallet: [
      {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(0),
      },
      {
        token: tokens.NST,
        balance: NormalizedUnitNumber(0),
      },
      {
        token: tokens.USDC,
        balance: NormalizedUnitNumber(0),
      },
    ],
  },
}
export const AllInOnlyDaiMobile: Story = {
  name: 'All in only Dai (Mobile)',
  ...getMobileStory(AllInOnlyDai),
}
export const AllInOnlyDaiTablet: Story = {
  name: 'All in only Dai (Tablet)',
  ...getTabletStory(AllInOnlyDai),
}

export const AllInOnlyNST: Story = {
  args: {
    sDai: {
      APY: Percentage(0.05),
      tokenWithBalance: { balance: NormalizedUnitNumber(0), token: tokens.sDAI },
      projections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
      depositedUSD: NormalizedUnitNumber(10365.7654),
      depositedUSDPrecision: 2,
    },
    opportunityProjections: {
      thirtyDays: NormalizedUnitNumber(0),
      oneYear: NormalizedUnitNumber(0),
    },
    assetsInWallet: [
      {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(0),
      },
      {
        token: tokens.NST,
        balance: NormalizedUnitNumber(0),
      },
      {
        token: tokens.USDC,
        balance: NormalizedUnitNumber(0),
      },
    ],
  },
}
export const AllInOnlyNSTMobile: Story = {
  name: 'All in only NST (Mobile)',
  ...getMobileStory(AllInOnlyNST),
}
export const AllInOnlyNSTTablet: Story = {
  name: 'All in only NST (Tablet)',
  ...getTabletStory(AllInOnlyNST),
}

export const NoDepositNoCash: Story = {
  name: 'No deposit, no cash',
  args: {
    sDai: {
      APY: Percentage(0.05),
      tokenWithBalance: { balance: NormalizedUnitNumber(0), token: tokens.sDAI },
      projections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
      depositedUSD: NormalizedUnitNumber(0),
      depositedUSDPrecision: 2,
    },
    sNst: {
      APY: Percentage(0.05),
      tokenWithBalance: { balance: NormalizedUnitNumber(0), token: tokens.sNST },
      projections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
      depositedUSD: NormalizedUnitNumber(0),
      depositedUSDPrecision: 2,
    },
    opportunityProjections: {
      thirtyDays: NormalizedUnitNumber(0),
      oneYear: NormalizedUnitNumber(0),
    },
    assetsInWallet: [
      {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(0),
      },
      {
        token: tokens.USDT,
        balance: NormalizedUnitNumber(0),
      },
      {
        token: tokens.USDC,
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
    sDai: {
      APY: Percentage(0.05),
      tokenWithBalance: { balance: NormalizedUnitNumber(134000000.0), token: tokens.sDAI },
      projections: {
        thirtyDays: NormalizedUnitNumber(1224300.923423423),
        oneYear: NormalizedUnitNumber(6345543.32945601),
      },
      depositedUSD: NormalizedUnitNumber('134395765.123482934245'),
      depositedUSDPrecision: 0,
    },
    sNst: {
      APY: Percentage(0.05),
      tokenWithBalance: { balance: NormalizedUnitNumber(134000000.0), token: tokens.sNST },
      projections: {
        thirtyDays: NormalizedUnitNumber(1224300.923423423),
        oneYear: NormalizedUnitNumber(6345543.32945601),
      },
      depositedUSD: NormalizedUnitNumber('134395765.123482934245'),
      depositedUSDPrecision: 0,
    },
    opportunityProjections: {
      thirtyDays: NormalizedUnitNumber(1224300.923423423),
      oneYear: NormalizedUnitNumber(6345543.32945601),
    },
    assetsInWallet: [
      {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(232134925.90911123),
      },
      {
        token: tokens.USDT,
        balance: NormalizedUnitNumber(601234014.134234),
      },
      {
        token: tokens.USDC,
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
