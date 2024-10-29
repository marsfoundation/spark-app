import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { WithClassname, WithFixedDate } from '@sb/decorators'
import { DaiSavingsCharts } from './DaiSavingsCharts'
import { mockEarningsChartData, mockEarningsPredictionsChartData } from './fixtures/mockEarningsChartData'
import { mockDsrChartData, mockSsrChartData } from './fixtures/mockSavingsRateChartData'

const meta: Meta<typeof DaiSavingsCharts> = {
  title: 'Features/Savings/Components/SavingsCharts/DaiSavingsCharts',
  component: DaiSavingsCharts,
  decorators: [WithClassname('max-w-lg'), WithFixedDate()],
  args: {
    selectedTimeframe: '1M' as const,
    setSelectedTimeframe: () => {},
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
    },
    savingsRateInfo: {
      data: {
        ssr: mockSsrChartData,
        dsr: mockDsrChartData,
      },
      isError: false,
      isPending: false,
      error: null,
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
    },
  },
}
export const NoEarningsHistoryMobile = getMobileStory(NoEarningsHistoryDesktop)
export const NoEarningsHistoryTablet = getTabletStory(NoEarningsHistoryDesktop)
