import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { mainnet } from 'viem/chains'
import { SavingsDaiAndUSDSView } from './SavingsDaiAndUSDSView'

const savingsViewBaseArgs = {
  chainId: mainnet.id,
  assetsInWallet: [
    {
      token: tokens.DAI,
      balance: NormalizedUnitNumber(22727),
    },
    {
      token: tokens.USDS,
      balance: NormalizedUnitNumber(12345),
    },
    {
      token: tokens.USDC,
      balance: NormalizedUnitNumber(0),
    },
  ],
  opportunityProjections: {
    thirtyDays: NormalizedUnitNumber(100),
    oneYear: NormalizedUnitNumber(3000),
  },
  maxBalanceToken: {
    token: tokens.DAI,
    balance: NormalizedUnitNumber(22727),
  },
  migrationInfo: {
    daiSymbol: tokens.DAI.symbol,
    usdsSymbol: tokens.USDS.symbol,
    daiToUsdsUpgradeAvailable: true,
    dsr: Percentage(0.05),
    ssr: Percentage(0.06),
    openDaiToUsdsUpgradeDialog: () => {},
    openUsdsToDaiDowngradeDialog: () => {},
    openSDaiToSUsdsUpgradeDialog: () => {},
  },
  totalEligibleCashUSD: NormalizedUnitNumber(45454),
  openDialog: () => {},
}

const sUSDSDetails = {
  APY: Percentage(0.05),
  tokenWithBalance: { balance: NormalizedUnitNumber(10_000), token: tokens.sUSDS },
  currentProjections: {
    thirtyDays: NormalizedUnitNumber(250),
    oneYear: NormalizedUnitNumber(1250),
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
  depositedUSD: NormalizedUnitNumber(20765.7654),
  depositedUSDPrecision: 2,
}

const meta: Meta<typeof SavingsDaiAndUSDSView> = {
  title: 'Features/SavingsWithUsds/Views/SavingsDaiAndUSDSView',
  component: SavingsDaiAndUSDSView,
  decorators: [WithTooltipProvider()],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof SavingsDaiAndUSDSView>

export const Desktop: Story = { args: { ...savingsViewBaseArgs, sDaiDetails, sUSDSDetails } }
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const NoDeposit: Story = {
  name: 'No deposit',
  args: {
    ...savingsViewBaseArgs,
    sDaiDetails: {
      ...sDaiDetails,
      tokenWithBalance: { balance: NormalizedUnitNumber(0), token: tokens.sDAI },
      currentProjections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
      depositedUSD: NormalizedUnitNumber(0),
    },
    sUSDSDetails: {
      ...sUSDSDetails,
      tokenWithBalance: { balance: NormalizedUnitNumber(0), token: tokens.sUSDS },
      currentProjections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
      depositedUSD: NormalizedUnitNumber(0),
    },
  },
}
export const NoDepositMobile = getMobileStory(NoDeposit)
export const NoDepositTablet = getTabletStory(NoDeposit)

export const AllIn: Story = {
  name: 'All in',
  args: {
    ...savingsViewBaseArgs,
    totalEligibleCashUSD: NormalizedUnitNumber(0),
    opportunityProjections: {
      thirtyDays: NormalizedUnitNumber(0),
      oneYear: NormalizedUnitNumber(0),
    },
    sUSDSDetails,
    sDaiDetails,
    assetsInWallet: [
      {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(0),
      },
      {
        token: tokens.USDS,
        balance: NormalizedUnitNumber(0),
      },
      {
        token: tokens.USDC,
        balance: NormalizedUnitNumber(0),
      },
    ],
  },
}
export const AllInMobile = getMobileStory(AllIn)
export const AllInTablet = getTabletStory(AllIn)

export const NoDepositNoCash: Story = {
  name: 'No deposit, no cash',
  args: {
    ...savingsViewBaseArgs,
    totalEligibleCashUSD: NormalizedUnitNumber(0),
    opportunityProjections: {
      thirtyDays: NormalizedUnitNumber(0),
      oneYear: NormalizedUnitNumber(0),
    },
    sDaiDetails: {
      ...sDaiDetails,
      tokenWithBalance: { balance: NormalizedUnitNumber(0), token: tokens.sDAI },
      currentProjections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
      depositedUSD: NormalizedUnitNumber(0),
    },
    sUSDSDetails: {
      ...sUSDSDetails,
      tokenWithBalance: { balance: NormalizedUnitNumber(0), token: tokens.sUSDS },
      currentProjections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
      depositedUSD: NormalizedUnitNumber(0),
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
export const NoDepositNoCashMobile = getMobileStory(NoDepositNoCash)
export const NoDepositNoCashTablet = getTabletStory(NoDepositNoCash)

export const BigNumbersDesktop: Story = {
  name: 'Big numbers',
  args: {
    ...savingsViewBaseArgs,
    opportunityProjections: {
      thirtyDays: NormalizedUnitNumber(1224300.923423423),
      oneYear: NormalizedUnitNumber(6345543.32945601),
    },
    sDaiDetails: {
      APY: Percentage(0.05),
      tokenWithBalance: { balance: NormalizedUnitNumber(134000000.0), token: tokens.sDAI },
      currentProjections: {
        thirtyDays: NormalizedUnitNumber(1224300.923423423),
        oneYear: NormalizedUnitNumber(6345543.32945601),
      },
      depositedUSD: NormalizedUnitNumber('134395765.123482934245'),
      depositedUSDPrecision: 0,
    },
    sUSDSDetails: {
      APY: Percentage(0.05),
      tokenWithBalance: { balance: NormalizedUnitNumber(134000000.0), token: tokens.sUSDS },
      currentProjections: {
        thirtyDays: NormalizedUnitNumber(1224300.923423423),
        oneYear: NormalizedUnitNumber(6345543.32945601),
      },
      depositedUSD: NormalizedUnitNumber('134395765.123482934245'),
      depositedUSDPrecision: 0,
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
export const BigNumbersMobile = getMobileStory(BigNumbersDesktop)
export const BigNumbersTablet = getTabletStory(BigNumbersDesktop)
