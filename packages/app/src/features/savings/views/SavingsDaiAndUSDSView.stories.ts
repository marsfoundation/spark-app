import { MY_EARNINGS_TIMEFRAMES } from '@/domain/savings-charts/useMyEarningsInfo/common'
import { UseMyEarningsInfoResult } from '@/domain/savings-charts/useMyEarningsInfo/useMyEarningsInfo'
import { SAVINGS_RATE_TIMEFRAMES } from '@/domain/savings-charts/useSavingsRateInfo/common'
import { UseSavingsRateInfoResult } from '@/domain/savings-charts/useSavingsRateInfo/useSavingsRateInfo'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { NormalizedUnitNumber, Percentage } from '@marsfoundation/common-universal'
import { WithTooltipProvider } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-remix-react-router'
import { mainnet } from 'viem/chains'
import {
  mockEarningsChartData,
  mockEarningsPredictionsChartData,
} from '../components/savings-charts/fixtures/mockEarningsChartData'
import { mockDsrChartData, mockSsrChartData } from '../components/savings-charts/fixtures/mockSavingsRateChartData'
import { SavingsTokenDetails } from '../logic/useSavings'
import { SavingsDaiAndUsdsView } from './SavingsDaiAndUSDSView'

const myEarningsInfo = {
  queryResult: {
    data: {
      data: mockEarningsChartData,
      predictions: mockEarningsPredictionsChartData,
    },
    isError: false,
    isPending: false,
    error: null,
  },
  shouldDisplayMyEarnings: true,
  selectedTimeframe: 'All',
  setSelectedTimeframe: () => {},
  availableTimeframes: MY_EARNINGS_TIMEFRAMES,
} satisfies UseMyEarningsInfoResult

const savingsRateInfo = {
  queryResult: {
    data: {
      ssr: mockSsrChartData,
      dsr: mockDsrChartData,
    },
    isError: false,
    isPending: false,
    error: null,
  },

  selectedTimeframe: '3M',
  setSelectedTimeframe: () => {},
  availableTimeframes: SAVINGS_RATE_TIMEFRAMES,
} satisfies UseSavingsRateInfoResult

const savingsChartsInfo = {
  selectedTimeframe: '1M' as const,
  setSelectedTimeframe: () => {},
  myEarningsInfo,
  savingsRateInfo,
  chartsSupported: true,
}

const savingsViewBaseArgs = {
  originChainId: mainnet.id,
  entryAssets: [
    {
      token: tokens.DAI,
      balance: NormalizedUnitNumber(22727),
      blockExplorerLink: '/',
    },
    {
      token: tokens.USDS,
      balance: NormalizedUnitNumber(12345),
      blockExplorerLink: '/',
    },
    {
      token: tokens.USDC,
      balance: NormalizedUnitNumber(0),
      blockExplorerLink: '/',
    },
  ],
  maxBalanceToken: {
    token: tokens.DAI,
    balance: NormalizedUnitNumber(22727),
  },
  migrationInfo: {
    daiSymbol: tokens.DAI.symbol,
    usdsSymbol: tokens.USDS.symbol,
    daiToUsdsUpgradeAvailable: true,
    sdaiToSusdsUpgradeAvailable: true,
    apyImprovement: Percentage(0.01),
    openDaiToUsdsUpgradeDialog: () => {},
    openUsdsToDaiDowngradeDialog: () => {},
    openSDaiToSUsdsUpgradeDialog: () => {},
  },
  savingsMeta: {
    primary: {
      savingsToken: TokenSymbol('sUSDS'),
      stablecoin: TokenSymbol('USDS'),
      rateAcronym: 'SSR',
      rateName: 'Sky Savings Rate',
    },
    secondary: {
      savingsToken: TokenSymbol('sDAI'),
      stablecoin: TokenSymbol('DAI'),
      rateAcronym: 'DSR',
      rateName: 'DAI Savings Rate',
    },
  } as const,
  totalEligibleCashUSD: NormalizedUnitNumber(45454),
  openDialog: () => {},
  savingsChartsInfo,
}

const sUSDSDetails = {
  APY: Percentage(0.05),
  savingsTokenWithBalance: { balance: NormalizedUnitNumber(10_000), token: tokens.sUSDS },
  underlyingToken: tokens.USDS,
  balanceRefreshIntervalInMs: 50,
  currentProjections: {
    thirtyDays: NormalizedUnitNumber(250),
    oneYear: NormalizedUnitNumber(1250),
  },
  calculateSavingsBalance: () => ({
    depositedAssets: NormalizedUnitNumber(10365.7654),
    depositedAssetsPrecision: 2,
  }),
} satisfies SavingsTokenDetails

const sDaiDetails = {
  APY: Percentage(0.05),
  savingsTokenWithBalance: { balance: NormalizedUnitNumber(20_000), token: tokens.sDAI },
  underlyingToken: tokens.DAI,
  balanceRefreshIntervalInMs: 50,
  currentProjections: {
    thirtyDays: NormalizedUnitNumber(500),
    oneYear: NormalizedUnitNumber(2500),
  },
  calculateSavingsBalance: () => ({ depositedAssets: NormalizedUnitNumber(20765.7654), depositedAssetsPrecision: 2 }),
} satisfies SavingsTokenDetails

const meta: Meta<typeof SavingsDaiAndUsdsView> = {
  title: 'Features/Savings/Views/SavingsDaiAndUsdsView',
  component: SavingsDaiAndUsdsView,
  decorators: [WithTooltipProvider(), withRouter()],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof SavingsDaiAndUsdsView>

export const Desktop: Story = { args: { ...savingsViewBaseArgs, sDaiDetails, sUSDSDetails } }
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const NoDeposit: Story = {
  name: 'No deposit',
  args: {
    ...savingsViewBaseArgs,
    savingsChartsInfo: {
      ...savingsChartsInfo,
      myEarningsInfo: {
        ...myEarningsInfo,
        shouldDisplayMyEarnings: false,
      },
    },
    sDaiDetails: {
      ...sDaiDetails,
      savingsTokenWithBalance: { balance: NormalizedUnitNumber(0), token: tokens.sDAI },
      currentProjections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
      calculateSavingsBalance: () => ({ depositedAssets: NormalizedUnitNumber(0), depositedAssetsPrecision: 2 }),
    },
    sUSDSDetails: {
      ...sUSDSDetails,
      savingsTokenWithBalance: { balance: NormalizedUnitNumber(0), token: tokens.sUSDS },
      currentProjections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
      calculateSavingsBalance: () => ({ depositedAssets: NormalizedUnitNumber(0), depositedAssetsPrecision: 2 }),
    },
  },
}
export const NoDepositMobile = getMobileStory(NoDeposit)
export const NoDepositTablet = getTabletStory(NoDeposit)

export const OnlySavingsDaiBalance: Story = {
  args: {
    ...savingsViewBaseArgs,
    totalEligibleCashUSD: NormalizedUnitNumber(0),
    sUSDSDetails: {
      ...sUSDSDetails,
      savingsTokenWithBalance: { balance: NormalizedUnitNumber(0), token: tokens.sUSDS },
      currentProjections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
      calculateSavingsBalance: () => ({ depositedAssets: NormalizedUnitNumber(0), depositedAssetsPrecision: 2 }),
    },
    sDaiDetails,
    entryAssets: [
      {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(0),
        blockExplorerLink: '/',
      },
      {
        token: tokens.USDS,
        balance: NormalizedUnitNumber(0),
        blockExplorerLink: '/',
      },
      {
        token: tokens.USDC,
        balance: NormalizedUnitNumber(0),
        blockExplorerLink: '/',
      },
    ],
  },
}
export const OnlySavingsDaiBalanceMobile = getMobileStory(OnlySavingsDaiBalance)
export const OnlySavingsDaiBalanceTablet = getTabletStory(OnlySavingsDaiBalance)

export const OnlySavingsUsdsBalance: Story = {
  args: {
    ...savingsViewBaseArgs,
    totalEligibleCashUSD: NormalizedUnitNumber(0),
    sUSDSDetails,
    sDaiDetails: {
      ...sDaiDetails,
      savingsTokenWithBalance: { balance: NormalizedUnitNumber(0), token: tokens.sDAI },
      currentProjections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
      calculateSavingsBalance: () => ({ depositedAssets: NormalizedUnitNumber(0), depositedAssetsPrecision: 2 }),
    },
    entryAssets: [
      {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(0),
        blockExplorerLink: '/',
      },
      {
        token: tokens.USDS,
        balance: NormalizedUnitNumber(0),
        blockExplorerLink: '/',
      },
      {
        token: tokens.USDC,
        balance: NormalizedUnitNumber(0),
        blockExplorerLink: '/',
      },
    ],
  },
}
export const OnlySavingsUsdsBalanceMobile = getMobileStory(OnlySavingsDaiBalance)
export const OnlySavingsUsdsBalanceTablet = getTabletStory(OnlySavingsDaiBalance)

export const AllIn: Story = {
  name: 'All in',
  args: {
    ...savingsViewBaseArgs,
    totalEligibleCashUSD: NormalizedUnitNumber(0),
    sUSDSDetails,
    sDaiDetails,
    entryAssets: [
      {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(0),
        blockExplorerLink: '/',
      },
      {
        token: tokens.USDS,
        balance: NormalizedUnitNumber(0),
        blockExplorerLink: '/',
      },
      {
        token: tokens.USDC,
        balance: NormalizedUnitNumber(0),
        blockExplorerLink: '/',
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
    savingsChartsInfo: {
      ...savingsChartsInfo,
      myEarningsInfo: {
        ...myEarningsInfo,
        shouldDisplayMyEarnings: false,
      },
    },
    totalEligibleCashUSD: NormalizedUnitNumber(0),
    sDaiDetails: {
      ...sDaiDetails,
      savingsTokenWithBalance: { balance: NormalizedUnitNumber(0), token: tokens.sDAI },
      currentProjections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
      calculateSavingsBalance: () => ({ depositedAssets: NormalizedUnitNumber(0), depositedAssetsPrecision: 2 }),
    },
    sUSDSDetails: {
      ...sUSDSDetails,
      savingsTokenWithBalance: { balance: NormalizedUnitNumber(0), token: tokens.sUSDS },
      currentProjections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
      calculateSavingsBalance: () => ({ depositedAssets: NormalizedUnitNumber(0), depositedAssetsPrecision: 2 }),
    },
    entryAssets: [
      {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(0),
        blockExplorerLink: '/',
      },
      {
        token: tokens.USDT,
        balance: NormalizedUnitNumber(0),
        blockExplorerLink: '/',
      },
      {
        token: tokens.USDC,
        balance: NormalizedUnitNumber(0),
        blockExplorerLink: '/',
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
    sDaiDetails: {
      APY: Percentage(0.05),
      underlyingToken: tokens.DAI,
      balanceRefreshIntervalInMs: 50,
      savingsTokenWithBalance: { balance: NormalizedUnitNumber(134000000.0), token: tokens.sDAI },
      currentProjections: {
        thirtyDays: NormalizedUnitNumber(1224300.923423423),
        oneYear: NormalizedUnitNumber(6345543.32945601),
      },
      calculateSavingsBalance: () => ({
        depositedAssets: NormalizedUnitNumber('134395765.123482934245'),
        depositedAssetsPrecision: 0,
      }),
    },
    sUSDSDetails: {
      APY: Percentage(0.05),
      savingsTokenWithBalance: { balance: NormalizedUnitNumber(134000000.0), token: tokens.sUSDS },
      underlyingToken: tokens.USDS,
      balanceRefreshIntervalInMs: 50,
      currentProjections: {
        thirtyDays: NormalizedUnitNumber(1224300.923423423),
        oneYear: NormalizedUnitNumber(6345543.32945601),
      },
      calculateSavingsBalance: () => ({
        depositedAssets: NormalizedUnitNumber('134395765.123482934245'),
        depositedAssetsPrecision: 0,
      }),
    },

    entryAssets: [
      {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(232134925.90911123),
        blockExplorerLink: '/',
      },
      {
        token: tokens.USDT,
        balance: NormalizedUnitNumber(601234014.134234),
        blockExplorerLink: '/',
      },
      {
        token: tokens.USDC,
        balance: NormalizedUnitNumber(12312.90345),
        blockExplorerLink: '/',
      },
    ],
  },
}
export const BigNumbersMobile = getMobileStory(BigNumbersDesktop)
export const BigNumbersTablet = getTabletStory(BigNumbersDesktop)

export const DepositSavingDaiOnlyChartsUnsupported: Story = {
  args: {
    ...savingsViewBaseArgs,
    totalEligibleCashUSD: NormalizedUnitNumber(12345),
    sUSDSDetails: {
      ...sUSDSDetails,
      savingsTokenWithBalance: { balance: NormalizedUnitNumber(0), token: tokens.sUSDS },
      currentProjections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
      calculateSavingsBalance: () => ({ depositedAssets: NormalizedUnitNumber(0), depositedAssetsPrecision: 2 }),
    },
    sDaiDetails,
    entryAssets: [
      {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(12345),
        blockExplorerLink: '/',
      },
      {
        token: tokens.USDS,
        balance: NormalizedUnitNumber(0),
        blockExplorerLink: '/',
      },
      {
        token: tokens.USDC,
        balance: NormalizedUnitNumber(0),
        blockExplorerLink: '/',
      },
    ],
    savingsChartsInfo: {
      ...savingsChartsInfo,
      chartsSupported: false,
    },
  },
}

export const DepositSavingDaiOnlyChartsUnsupportedMobile = getMobileStory(DepositSavingDaiOnlyChartsUnsupported)
export const DepositSavingDaiOnlyChartsUnsupportedTablet = getTabletStory(DepositSavingDaiOnlyChartsUnsupported)
