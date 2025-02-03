import { MY_EARNINGS_TIMEFRAMES } from '@/domain/savings-charts/useMyEarningsInfo/common'
import { UseMyEarningsInfoResult } from '@/domain/savings-charts/useMyEarningsInfo/useMyEarningsInfo'
import { SAVINGS_RATE_TIMEFRAMES } from '@/domain/savings-charts/useSavingsRateInfo/common'
import { UseSavingsRateInfoResult } from '@/domain/savings-charts/useSavingsRateInfo/useSavingsRateInfo'
import { NormalizedUnitNumber, Percentage } from '@marsfoundation/common-universal'
import { WithTooltipProvider } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-remix-react-router'
import {
  mockEarningsChartData,
  mockEarningsPredictionsChartData,
} from '../components/savings-charts/fixtures/mockEarningsChartData'
import { mockDsrChartData, mockSsrChartData } from '../components/savings-charts/fixtures/mockSavingsRateChartData'
import { AccountDefinition, InterestData, ShortAccountDefinition } from '../logic/useSavings'
import { SavingsView, SavingsViewProps } from './SavingsView'

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
  selectedTimeframe: '1M',
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
  selectedTimeframe: '1M',
  setSelectedTimeframe: () => {},
  availableTimeframes: SAVINGS_RATE_TIMEFRAMES,
} satisfies UseSavingsRateInfoResult

const chartsData = {
  selectedTimeframe: '1M' as const,
  setSelectedTimeframe: () => {},
  myEarningsInfo,
  savingsRateInfo,
  chartsSupported: true,
}

const migrationInfo = {
  daiSymbol: tokens.DAI.symbol,
  usdsSymbol: tokens.USDS.symbol,
  daiToUsdsUpgradeAvailable: true,
  sdaiToSusdsUpgradeAvailable: true,
  apyImprovement: Percentage(0.01),
  openDaiToUsdsUpgradeDialog: () => {},
  openUsdsToDaiDowngradeDialog: () => {},
  openSDaiToSUsdsUpgradeDialog: () => {},
}

const interestData = {
  APY: Percentage(0.12),
  balanceRefreshIntervalInMs: 50,
  currentProjections: {
    thirtyDays: NormalizedUnitNumber(250),
    oneYear: NormalizedUnitNumber(1250),
  },
  calculateUnderlyingTokenBalance: () => ({
    depositedAssets: NormalizedUnitNumber(10365.7654),
    depositedAssetsPrecision: 2,
  }),
} satisfies InterestData

const savingsUsdsAccountDefinition = {
  savingsToken: tokens.sUSDS,
  savingsTokenBalance: NormalizedUnitNumber(10_000),
  underlyingToken: tokens.USDS,
  supportedStablecoins: [
    {
      token: tokens.DAI,
      balance: NormalizedUnitNumber(2245.43),
      blockExplorerLink: '/',
    },
    {
      token: tokens.USDC,
      balance: NormalizedUnitNumber(1002.01),
      blockExplorerLink: '/',
    },
    {
      token: tokens.USDS,
      balance: NormalizedUnitNumber(10_000),
      blockExplorerLink: '/',
    },
  ],
  mostValuableAsset: { token: tokens.USDS, balance: NormalizedUnitNumber(10_000) },
  chartsData,
  showConvertDialogButton: true,
  interestData,
  liquidity: Number.POSITIVE_INFINITY,
} satisfies AccountDefinition

const shortSavingsUsdsAccountDefinition = {
  savingsToken: tokens.sUSDS,
  underlyingToken: tokens.USDS,
  underlyingTokenDeposit: NormalizedUnitNumber(10_365.7654),
} satisfies ShortAccountDefinition

const savingsUsdcAccountDefinition = {
  savingsToken: tokens.sUSDC,
  savingsTokenBalance: NormalizedUnitNumber(10_000),
  underlyingToken: tokens.USDC,
  supportedStablecoins: [
    {
      token: tokens.USDC,
      balance: NormalizedUnitNumber(10_000),
      blockExplorerLink: '/',
    },
  ],
  mostValuableAsset: { token: tokens.USDC, balance: NormalizedUnitNumber(10_000) },
  chartsData,
  showConvertDialogButton: true,
  interestData,
  liquidity: 2_014_589_629,
} satisfies AccountDefinition

const shortSavingsUsdcAccountDefinition = {
  savingsToken: tokens.sUSDC,
  underlyingToken: tokens.USDC,
  underlyingTokenDeposit: NormalizedUnitNumber(10_365.7654),
} satisfies ShortAccountDefinition

const savingsDaiAccountDefinition = {
  savingsToken: tokens.sDAI,
  savingsTokenBalance: NormalizedUnitNumber(20_000),
  underlyingToken: tokens.DAI,
  supportedStablecoins: [
    {
      token: tokens.DAI,
      balance: NormalizedUnitNumber(12_000),
      blockExplorerLink: '/',
    },
    {
      token: tokens.USDS,
      balance: NormalizedUnitNumber(10_000),
      blockExplorerLink: '/',
    },
    {
      token: tokens.USDC,
      balance: NormalizedUnitNumber(1002.01),
      blockExplorerLink: '/',
    },
  ],
  mostValuableAsset: { token: tokens.DAI, balance: NormalizedUnitNumber(12_000) },
  chartsData,
  showConvertDialogButton: true,
  migrationInfo,
  interestData,
  liquidity: Number.POSITIVE_INFINITY,
} satisfies AccountDefinition

const shortSavingsDaiAccountDefinition = {
  savingsToken: tokens.sDAI,
  underlyingToken: tokens.DAI,
  underlyingTokenDeposit: NormalizedUnitNumber(22_245.43),
} satisfies ShortAccountDefinition

const savingsViewSusdsArgs = {
  selectedAccount: savingsUsdsAccountDefinition,
  setSelectedAccount: () => {},
  openDialog: () => {},
  openConnectModal: () => {},
  openSandboxModal: () => {},
  guestMode: false,
  allAccounts: [shortSavingsUsdcAccountDefinition, shortSavingsUsdsAccountDefinition, shortSavingsDaiAccountDefinition],
  users: 4_967,
  tvl: 2_320_691_847,
} satisfies SavingsViewProps

const meta: Meta<typeof SavingsView> = {
  title: 'Features/Savings/Views/SavingsView',
  component: SavingsView,
  decorators: [WithTooltipProvider(), withRouter()],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof SavingsView>

export const Usds: Story = { args: savingsViewSusdsArgs }
export const UsdsMobile = getMobileStory(Usds)
export const UsdsTablet = getTabletStory(Usds)

export const Dai: Story = {
  args: {
    ...savingsViewSusdsArgs,
    selectedAccount: {
      ...savingsDaiAccountDefinition,
      interestData: {
        ...interestData,
        currentProjections: {
          thirtyDays: NormalizedUnitNumber(509.7654),
          oneYear: NormalizedUnitNumber(2548.827),
        },
        calculateUnderlyingTokenBalance: () => ({
          depositedAssets: NormalizedUnitNumber(22_249.7654),
          depositedAssetsPrecision: 2,
        }),
      },
    },
  } satisfies SavingsViewProps,
}
export const DaiMobile = getMobileStory(Dai)
export const DaiTablet = getTabletStory(Dai)

export const Usdc: Story = {
  args: {
    ...savingsViewSusdsArgs,
    selectedAccount: savingsUsdcAccountDefinition,
  } satisfies SavingsViewProps,
}
export const UsdcMobile = getMobileStory(Usdc)
export const UsdcTablet = getTabletStory(Usdc)

export const NoDeposit: Story = {
  args: {
    ...savingsViewSusdsArgs,
    allAccounts: [
      shortSavingsUsdcAccountDefinition,
      { ...shortSavingsUsdsAccountDefinition, underlyingTokenDeposit: NormalizedUnitNumber(0) },
      shortSavingsDaiAccountDefinition,
    ],
    selectedAccount: {
      ...savingsUsdsAccountDefinition,
      savingsTokenBalance: NormalizedUnitNumber(0),
    },
  } satisfies SavingsViewProps,
}
export const NoDepositMobile = getMobileStory(NoDeposit)
export const NoDepositTablet = getTabletStory(NoDeposit)

export const AllIn: Story = {
  args: {
    ...savingsViewSusdsArgs,
    selectedAccount: {
      ...savingsUsdsAccountDefinition,
      supportedStablecoins: [
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
      mostValuableAsset: { token: tokens.USDS, balance: NormalizedUnitNumber(0) },
    },
  } satisfies SavingsViewProps,
}
export const AllInMobile = getMobileStory(AllIn)
export const AllInTablet = getTabletStory(AllIn)

export const BigNumbers: Story = {
  args: {
    ...savingsViewSusdsArgs,
    allAccounts: [
      { ...shortSavingsUsdcAccountDefinition, underlyingTokenDeposit: NormalizedUnitNumber(134_395_765) },
      shortSavingsUsdsAccountDefinition,
      shortSavingsDaiAccountDefinition,
    ],
    selectedAccount: {
      ...savingsUsdcAccountDefinition,
      savingsTokenBalance: NormalizedUnitNumber(110_000_000),
      interestData: {
        ...interestData,
        currentProjections: {
          thirtyDays: NormalizedUnitNumber(1224300.923423423),
          oneYear: NormalizedUnitNumber(6345543.32945601),
        },
        calculateUnderlyingTokenBalance: () => ({
          depositedAssets: NormalizedUnitNumber('134395765.123482934245'),
          depositedAssetsPrecision: 0,
        }),
      },
      supportedStablecoins: [
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
      mostValuableAsset: { token: tokens.USDS, balance: NormalizedUnitNumber(601234014.134234) },
    },
  } satisfies SavingsViewProps,
}
export const BigNumbersMobile = getMobileStory(BigNumbers)
export const BigNumbersTablet = getTabletStory(BigNumbers)

export const ChartsNotSupported: Story = {
  args: {
    ...savingsViewSusdsArgs,
    selectedAccount: {
      ...savingsUsdsAccountDefinition,
      chartsData: {
        ...chartsData,
        chartsSupported: false,
      },
    },
  } satisfies SavingsViewProps,
}
export const ChartsNotSupportedMobile = getMobileStory(ChartsNotSupported)
export const ChartsNotSupportedTablet = getTabletStory(ChartsNotSupported)
