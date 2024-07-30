import { WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { mainnet } from 'viem/chains'

import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { SavingsView } from './SavingsView'

const savingsViewBaseArgs = {
  chainId: mainnet.id,
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
}

const sNSTDetails = {
  APY: Percentage(0.05),
  tokenWithBalance: { balance: NormalizedUnitNumber(10_000), token: tokens.sNST },
  currentProjections: {
    thirtyDays: NormalizedUnitNumber(250),
    oneYear: NormalizedUnitNumber(1250),
  },
  opportunityProjections: {
    thirtyDays: NormalizedUnitNumber(100),
    oneYear: NormalizedUnitNumber(3000),
  },
  depositedUSD: NormalizedUnitNumber(10365.7654),
  depositedUSDPrecision: 2,
}

const sDaiDetails = {
  APY: Percentage(0.05),
  tokenWithBalance: { balance: NormalizedUnitNumber(20_000), token: tokens.sDAI },
  currentProjections: {
    thirtyDays: NormalizedUnitNumber(500),
    oneYear: NormalizedUnitNumber(2500),
  },
  opportunityProjections: {
    thirtyDays: NormalizedUnitNumber(100),
    oneYear: NormalizedUnitNumber(3000),
  },
  depositedUSD: NormalizedUnitNumber(20765.7654),
  depositedUSDPrecision: 2,
}

const meta: Meta<typeof SavingsView> = {
  title: 'Features/SavingsWithNst/Views/SavingsView',
  component: SavingsView,
  decorators: [WithTooltipProvider()],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof SavingsView>

export const Desktop: Story = { args: { ...savingsViewBaseArgs, sDai: sDaiDetails, sNST: sNSTDetails } }
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const OnlyDai: Story = {
  args: {
    ...savingsViewBaseArgs,
    sDai: sDaiDetails,
  },
}
export const OnlyDaiMobile = {
  name: 'Only Dai (Mobile)',
  ...getMobileStory(OnlyDai),
}
export const OnlyDaiTablet = {
  name: 'Only Dai (Tablet)',
  ...getTabletStory(OnlyDai),
}

export const OnlyNST: Story = {
  args: { ...savingsViewBaseArgs, sNST: sNSTDetails },
}
export const OnlyNSTMobile = {
  name: 'Only NST (Mobile)',
  ...getMobileStory(OnlyNST),
}
export const OnlyNSTTablet = {
  name: 'Only NST (Tablet)',
  ...getTabletStory(OnlyNST),
}

export const NoDeposit: Story = {
  name: 'No deposit',
  args: {
    ...savingsViewBaseArgs,
    sDai: {
      ...sDaiDetails,
      tokenWithBalance: { balance: NormalizedUnitNumber(0), token: tokens.sDAI },
      currentProjections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
      depositedUSD: NormalizedUnitNumber(0),
    },
    sNST: {
      ...sNSTDetails,
      tokenWithBalance: { balance: NormalizedUnitNumber(0), token: tokens.sNST },
      currentProjections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
      depositedUSD: NormalizedUnitNumber(0),
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
    ...savingsViewBaseArgs,
    totalEligibleCashUSD: NormalizedUnitNumber(0),
    sDai: {
      ...sDaiDetails,
      opportunityProjections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
    },
    sNST: {
      ...sNSTDetails,
      opportunityProjections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
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
    ...savingsViewBaseArgs,
    totalEligibleCashUSD: NormalizedUnitNumber(0),
    sDai: {
      ...sDaiDetails,
      opportunityProjections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
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
export const AllInOnlyDaiMobile = {
  name: 'All in only Dai (Mobile)',
  ...getMobileStory(AllInOnlyDai),
}
export const AllInOnlyDaiTablet = {
  name: 'All in only Dai (Tablet)',
  ...getTabletStory(AllInOnlyDai),
}

export const AllInOnlyNST: Story = {
  args: {
    ...savingsViewBaseArgs,
    totalEligibleCashUSD: NormalizedUnitNumber(0),
    sNST: {
      ...sNSTDetails,
      opportunityProjections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
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
export const AllInOnlyNSTMobile = {
  name: 'All in only NST (Mobile)',
  ...getMobileStory(AllInOnlyNST),
}
export const AllInOnlyNSTTablet = {
  name: 'All in only NST (Tablet)',
  ...getTabletStory(AllInOnlyNST),
}

export const NoDepositNoCash: Story = {
  name: 'No deposit, no cash',
  args: {
    ...savingsViewBaseArgs,
    sDai: {
      ...sDaiDetails,
      tokenWithBalance: { balance: NormalizedUnitNumber(0), token: tokens.sDAI },
      currentProjections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
      depositedUSD: NormalizedUnitNumber(0),
      opportunityProjections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
    },
    sNST: {
      ...sNSTDetails,
      tokenWithBalance: { balance: NormalizedUnitNumber(0), token: tokens.sNST },
      currentProjections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
      depositedUSD: NormalizedUnitNumber(0),
      opportunityProjections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
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
    ...savingsViewBaseArgs,
    sDai: {
      APY: Percentage(0.05),
      tokenWithBalance: { balance: NormalizedUnitNumber(134000000.0), token: tokens.sDAI },
      currentProjections: {
        thirtyDays: NormalizedUnitNumber(1224300.923423423),
        oneYear: NormalizedUnitNumber(6345543.32945601),
      },
      opportunityProjections: {
        thirtyDays: NormalizedUnitNumber(1224300.923423423),
        oneYear: NormalizedUnitNumber(6345543.32945601),
      },
      depositedUSD: NormalizedUnitNumber('134395765.123482934245'),
      depositedUSDPrecision: 0,
    },
    sNST: {
      APY: Percentage(0.05),
      tokenWithBalance: { balance: NormalizedUnitNumber(134000000.0), token: tokens.sNST },
      currentProjections: {
        thirtyDays: NormalizedUnitNumber(1224300.923423423),
        oneYear: NormalizedUnitNumber(6345543.32945601),
      },
      depositedUSD: NormalizedUnitNumber('134395765.123482934245'),
      depositedUSDPrecision: 0,
      opportunityProjections: {
        thirtyDays: NormalizedUnitNumber(1224300.923423423),
        oneYear: NormalizedUnitNumber(6345543.32945601),
      },
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
export const BigNumbersMobile = {
  ...getMobileStory(BigNumbersDesktop),
  name: 'Big numbers (Mobile)',
}
export const BigNumbersTablet = {
  ...getTabletStory(BigNumbersDesktop),
  name: 'Big numbers (Tablet)',
}
