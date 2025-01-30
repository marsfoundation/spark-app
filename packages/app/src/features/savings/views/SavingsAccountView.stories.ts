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
import { SavingsTokenDetails } from '../logic/useSavings'
import { SavingsAccountView, SavingsAccountViewProps } from './SavingsAccountView'

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

const savingsChartsInfo = {
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

const savingsUsdsTokenDetails = {
  APY: Percentage(0.12),
  savingsTokenWithBalance: { balance: NormalizedUnitNumber(10_000), token: tokens.sUSDS },
  underlyingToken: tokens.USDS,
  balanceRefreshIntervalInMs: 50,
  currentProjections: {
    thirtyDays: NormalizedUnitNumber(250),
    oneYear: NormalizedUnitNumber(1250),
  },
  calculateSavingsBalance: () => ({ depositedAssets: NormalizedUnitNumber(10365.7654), depositedAssetsPrecision: 2 }),
} satisfies SavingsTokenDetails
const savingsUsdsViewArgs = {
  openDialog: () => {},
  openConnectModal: () => {},
  openSandboxModal: () => {},
  savingsChartsInfo,
  assetsConvertSupported: true,
  guestMode: false,
  migrationInfo,
  entryAssets: [
    {
      token: tokens.DAI,
      balance: NormalizedUnitNumber(2245.43),
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
  mostValuableAsset: {
    token: tokens.USDS,
    balance: NormalizedUnitNumber(10_000),
  },
  savingsTokenDetails: savingsUsdsTokenDetails,
} satisfies SavingsAccountViewProps

const sdaiTokenDetails = {
  APY: Percentage(0.11),
  savingsTokenWithBalance: { balance: NormalizedUnitNumber(10_000), token: tokens.sDAI },
  underlyingToken: tokens.DAI,
  balanceRefreshIntervalInMs: 50,
  currentProjections: {
    thirtyDays: NormalizedUnitNumber(250),
    oneYear: NormalizedUnitNumber(1250),
  },
  calculateSavingsBalance: () => ({ depositedAssets: NormalizedUnitNumber(10365.7654), depositedAssetsPrecision: 2 }),
} satisfies SavingsTokenDetails

const susdcTokenDetails = {
  APY: Percentage(0.12),
  savingsTokenWithBalance: { balance: NormalizedUnitNumber(10_000), token: tokens.sUSDC },
  underlyingToken: tokens.USDC,
  balanceRefreshIntervalInMs: 50,
  currentProjections: {
    thirtyDays: NormalizedUnitNumber(250),
    oneYear: NormalizedUnitNumber(1250),
  },
  calculateSavingsBalance: () => ({ depositedAssets: NormalizedUnitNumber(10365.7654), depositedAssetsPrecision: 2 }),
} satisfies SavingsTokenDetails

const meta: Meta<typeof SavingsAccountView> = {
  title: 'Features/Savings/Views/SavingsAccountView',
  component: SavingsAccountView,
  decorators: [WithTooltipProvider(), withRouter()],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof SavingsAccountView>

export const Usds: Story = { args: savingsUsdsViewArgs }
export const UsdsMobile = getMobileStory(Usds)
export const UsdsTablet = getTabletStory(Usds)

export const Dai: Story = {
  args: {
    ...savingsUsdsViewArgs,
    savingsTokenDetails: sdaiTokenDetails,
    entryAssets: [
      {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(22_245.43),
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
    mostValuableAsset: { token: tokens.DAI, balance: NormalizedUnitNumber(22_245.43) },
  } satisfies SavingsAccountViewProps,
}
export const DaiMobile = getMobileStory(Dai)
export const DaiTablet = getTabletStory(Dai)

export const Usdc: Story = {
  args: {
    ...savingsUsdsViewArgs,
    savingsTokenDetails: susdcTokenDetails,
    entryAssets: [
      {
        token: tokens.USDC,
        balance: NormalizedUnitNumber(22_245.43),
        blockExplorerLink: '/',
      },
    ],
    mostValuableAsset: { token: tokens.DAI, balance: NormalizedUnitNumber(22_245.43) },
  } satisfies SavingsAccountViewProps,
}
export const UsdcMobile = getMobileStory(Usdc)
export const UsdcTablet = getTabletStory(Usdc)

export const NoDeposit: Story = {
  args: {
    ...savingsUsdsViewArgs,
    savingsTokenDetails: {
      ...savingsUsdsTokenDetails,
      savingsTokenWithBalance: { balance: NormalizedUnitNumber(0), token: tokens.sUSDS },
    },
  } satisfies SavingsAccountViewProps,
}
export const NoDepositMobile = getMobileStory(NoDeposit)
export const NoDepositTablet = getTabletStory(NoDeposit)

export const AllIn: Story = {
  args: {
    ...savingsUsdsViewArgs,
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
    mostValuableAsset: { token: tokens.USDS, balance: NormalizedUnitNumber(0) },
  } satisfies SavingsAccountViewProps,
}
export const AllInMobile = getMobileStory(AllIn)
export const AllInTablet = getTabletStory(AllIn)

export const BigNumbers: Story = {
  args: {
    ...savingsUsdsViewArgs,
    migrationInfo,
    savingsTokenDetails: {
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
    mostValuableAsset: { token: tokens.USDS, balance: NormalizedUnitNumber(601234014.134234) },
  } satisfies SavingsAccountViewProps,
}
export const BigNumbersMobile = getMobileStory(BigNumbers)
export const BigNumbersTablet = getTabletStory(BigNumbers)

export const ChartsNotSupported: Story = {
  args: {
    ...savingsUsdsViewArgs,
    savingsChartsInfo: {
      ...savingsChartsInfo,
      chartsSupported: false,
    },
  },
}
export const ChartsNotSupportedMobile = getMobileStory(ChartsNotSupported)
export const ChartsNotSupportedTablet = getTabletStory(ChartsNotSupported)

export const NoMigrationInfo: Story = {
  args: {
    ...savingsUsdsViewArgs,
    migrationInfo: undefined,
  },
}
export const NoMigrationInfoMobile = getMobileStory(NoMigrationInfo)
export const NoMigrationInfoTablet = getTabletStory(NoMigrationInfo)
