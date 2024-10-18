import { UseMyEarningsInfoResult } from '@/domain/savings-charts/useMyEarningsInfo/useMyEarningsInfo'
import { UseSavingsRateInfoResult } from '@/domain/savings-charts/useSavingsRateInfo/useSavingsRateInfo'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { mainnet } from 'viem/chains'
import {
  mockEarningsChartData,
  mockEarningsPredictionsChartData,
} from '../components/savings-charts/fixtures/mockEarningsChartData'
import { mockDsrChartData, mockSsrChartData } from '../components/savings-charts/fixtures/mockSavingsRateChartData'
import { SavingsTokenDetails } from '../logic/useSavings'
import { SavingsUsdsView } from './SavingsUSDSView'

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
} satisfies UseMyEarningsInfoResult

const savingsRateInfo = {
  data: {
    ssr: mockSsrChartData,
    dsr: mockDsrChartData,
  },
  isError: false,
  isPending: false,
  error: null,
} satisfies UseSavingsRateInfoResult

const savingsChartsInfo = {
  selectedTimeframe: '1M' as const,
  setSelectedTimeframe: () => {},
  myEarningsInfo,
  savingsRateInfo,
  chartsSupported: true,
}

const savingsViewBaseArgs = {
  chainId: mainnet.id,
  assetsInWallet: [
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
  totalEligibleCashUSD: NormalizedUnitNumber(45454),
  openDialog: () => {},
  savingsMeta: {
    primary: {
      savingsToken: TokenSymbol('sUSDS'),
      stablecoin: TokenSymbol('USDS'),
      rateAcronym: 'SSR',
      rateName: 'Sky Savings Rate',
    },
  } as const,
  savingsChartsInfo,
}

const savingsTokenDetails = {
  APY: Percentage(0.05),
  savingsTokenWithBalance: { balance: NormalizedUnitNumber(10_000), token: tokens.sUSDS },
  assetsToken: tokens.USDS,
  balanceRefreshIntervalInMs: 50,
  currentProjections: {
    thirtyDays: NormalizedUnitNumber(250),
    oneYear: NormalizedUnitNumber(1250),
  },
  calculateSavingsBalance: () => ({ depositedAssets: NormalizedUnitNumber(10365.7654), depositedAssetsPrecision: 2 }),
} satisfies SavingsTokenDetails

const meta: Meta<typeof SavingsUsdsView> = {
  title: 'Features/Savings/Views/SavingsUsdsView',
  component: SavingsUsdsView,
  decorators: [WithTooltipProvider()],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof SavingsUsdsView>

export const Desktop: Story = {
  args: { ...savingsViewBaseArgs, savingsTokenDetails },
}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const AllIn: Story = {
  args: {
    ...savingsViewBaseArgs,
    totalEligibleCashUSD: NormalizedUnitNumber(0),
    savingsTokenDetails,
    assetsInWallet: [
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
    savingsTokenDetails: {
      ...savingsTokenDetails,
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
    savingsTokenDetails: {
      ...savingsTokenDetails,
      savingsTokenWithBalance: { balance: NormalizedUnitNumber(0), token: tokens.sUSDS },
      currentProjections: {
        thirtyDays: NormalizedUnitNumber(0),
        oneYear: NormalizedUnitNumber(0),
      },
      calculateSavingsBalance: () => ({ depositedAssets: NormalizedUnitNumber(0), depositedAssetsPrecision: 2 }),
    },

    assetsInWallet: [
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
    savingsTokenDetails: {
      APY: Percentage(0.05),
      savingsTokenWithBalance: { balance: NormalizedUnitNumber(134000000.0), token: tokens.sUSDS },
      assetsToken: tokens.USDS,
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

    assetsInWallet: [
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

export const DepositChartsUnsupported: Story = {
  args: {
    ...savingsViewBaseArgs,
    totalEligibleCashUSD: NormalizedUnitNumber(12345),
    savingsChartsInfo: {
      ...savingsChartsInfo,
      chartsSupported: false,
    },
    savingsTokenDetails,
  },
}

export const DepositChartsUnsupportedMobile = getMobileStory(DepositChartsUnsupported)
export const DepositChartsUnsupportedTablet = getTabletStory(DepositChartsUnsupported)
