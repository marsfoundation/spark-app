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
import { mainnet } from 'viem/chains'
import { mockDsrChartData, mockSsrChartData } from '../components/savings-charts/fixtures/mockSavingsRateChartData'
import { SavingsTokenDetails } from '../logic/useSavings'
import { GuestView } from './GuestView'

const myEarningsInfo = {
  queryResult: {
    data: {
      data: [],
      predictions: [],
    },
    isError: false,
    isPending: false,
    error: null,
  },
  shouldDisplayMyEarnings: false,

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

const savingsTokenDetails = {
  APY: Percentage(0.065),
  savingsTokenWithBalance: { balance: NormalizedUnitNumber(20_000), token: tokens.sUSDS },
  assetsToken: tokens.USDS,
  balanceRefreshIntervalInMs: 50,
  currentProjections: {
    thirtyDays: NormalizedUnitNumber(500),
    oneYear: NormalizedUnitNumber(2500),
  },
  calculateSavingsBalance: () => ({
    depositedAssets: NormalizedUnitNumber(20765.7654),
    depositedAssetsPrecision: 2,
  }),
} satisfies SavingsTokenDetails

const meta: Meta<typeof GuestView> = {
  title: 'Features/Savings/Views/GuestView',
  component: GuestView,
  decorators: [WithTooltipProvider()],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    originChainId: mainnet.id,
    openConnectModal: () => {},
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
    },
    savingsChartsInfo,
    savingsTokenDetails,
  },
}

export default meta
type Story = StoryObj<typeof GuestView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const WithoutChartsDesktop: Story = {
  args: {
    savingsChartsInfo: {
      ...savingsChartsInfo,
      chartsSupported: false,
    },
  },
}

export const WithoutChartsMobile = getMobileStory(WithoutChartsDesktop)
export const WithoutChartsTablet = getTabletStory(WithoutChartsDesktop)
