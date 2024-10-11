import { UseMyEarningsInfoResult } from '@/domain/savings-charts/useMyEarningsInfo/useMyEarningsInfo'
import { UseSavingsRateInfoResult } from '@/domain/savings-charts/useSavingsRateInfo/useSavingsRateInfo'
import { Percentage } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { mainnet } from 'viem/chains'
import { mockDsrChartData, mockSsrChartData } from '../components/savings-charts/fixtures/mockSavingsRateChartData'
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

const meta: Meta<typeof GuestView> = {
  title: 'Features/Savings/Views/GuestView',
  component: GuestView,
  decorators: [WithTooltipProvider()],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    APY: Percentage(0.05),
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
