import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { MY_EARNINGS_TIMEFRAMES } from '@/domain/savings-charts/useMyEarningsInfo/common'
import { SAVINGS_RATE_TIMEFRAMES } from '@/domain/savings-charts/useSavingsRateInfo/common'
import { WithClassname, WithFixedDate } from '@sb/decorators'
import { DaiSavingsCharts } from './DaiSavingsCharts'
import { mockEarningsChartData, mockEarningsPredictionsChartData } from './fixtures/mockEarningsChartData'
import { mockDsrChartData, mockSsrChartData } from './fixtures/mockSavingsRateChartData'

const meta: Meta<typeof DaiSavingsCharts> = {
  title: 'Features/Savings/Components/SavingsCharts/DaiSavingsCharts',
  component: DaiSavingsCharts,
  decorators: [WithClassname('max-w-lg'), WithFixedDate()],
  args: {
    myEarningsInfo: {
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
    },
    savingsRateInfo: {
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
    },
  },
}

export default meta
type Story = StoryObj<typeof DaiSavingsCharts>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const NoEarningsHistoryDesktop: Story = {
  args: {
    ...Desktop.args,
    myEarningsInfo: {
      queryResult: {
        isPending: false,
        isError: false,
        error: null,
        data: { data: [], predictions: [] },
      },
      shouldDisplayMyEarnings: false,
      selectedTimeframe: 'All',
      setSelectedTimeframe: () => {},
      availableTimeframes: MY_EARNINGS_TIMEFRAMES,
    },
  },
}
export const NoEarningsHistoryMobile = getMobileStory(NoEarningsHistoryDesktop)
export const NoEarningsHistoryTablet = getTabletStory(NoEarningsHistoryDesktop)
