import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { MY_EARNINGS_TIMEFRAMES } from '@/domain/savings-charts/useMyEarningsInfo/common'
import { SAVINGS_RATE_TIMEFRAMES } from '@/domain/savings-charts/useSavingsRateInfo/common'
import { WithClassname, WithFixedDate } from '@sb/decorators'
import { UsdsSavingsCharts } from './UsdsSavingsCharts'
import { mockEarningsChartData, mockEarningsPredictionsChartData } from './fixtures/mockEarningsChartData'
import { mockDsrChartData, mockSsrChartData } from './fixtures/mockSavingsRateChartData'

const meta: Meta<typeof UsdsSavingsCharts> = {
  title: 'Features/Savings/Components/SavingsCharts/UsdsSavingsCharts',
  component: UsdsSavingsCharts,
  decorators: [WithClassname('max-w-lg'), WithFixedDate()],
  args: {
    myEarningsInfo: {
      queryResult: {
        isError: false,
        isPending: false,
        error: null,
        data: {
          data: mockEarningsChartData,
          predictions: mockEarningsPredictionsChartData,
        },
      },
      shouldDisplayMyEarnings: true,
      selectedTimeframe: '1M' as const,
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
      selectedTimeframe: '1M' as const,
      setSelectedTimeframe: () => {},
      availableTimeframes: SAVINGS_RATE_TIMEFRAMES,
    },
  },
}

export default meta
type Story = StoryObj<typeof UsdsSavingsCharts>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const NoEarningsHistoryDesktop: Story = {
  args: {
    ...Desktop.args,
    myEarningsInfo: {
      queryResult: {
        data: { data: [], predictions: [] },
        isError: false,
        isPending: false,
        error: null,
      },
      shouldDisplayMyEarnings: false,
      selectedTimeframe: '1M' as const,
      setSelectedTimeframe: () => {},
      availableTimeframes: MY_EARNINGS_TIMEFRAMES,
    },
  },
}
export const NoEarningsHistoryMobile = getMobileStory(NoEarningsHistoryDesktop)
export const NoEarningsHistoryTablet = getTabletStory(NoEarningsHistoryDesktop)
