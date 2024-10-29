import { getMobileStory, getTabletStory } from '@storybook-config/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { WithClassname, WithFixedDate } from '@storybook-config/decorators'
import { UsdsSavingsCharts } from './UsdsSavingsCharts'
import { mockEarningsChartData, mockEarningsPredictionsChartData } from './fixtures/mockEarningsChartData'
import { mockDsrChartData, mockSsrChartData } from './fixtures/mockSavingsRateChartData'

const meta: Meta<typeof UsdsSavingsCharts> = {
  title: 'Features/Savings/Components/SavingsCharts/UsdsSavingsCharts',
  component: UsdsSavingsCharts,
  decorators: [WithClassname('max-w-lg'), WithFixedDate()],
  args: {
    selectedTimeframe: '1M' as const,
    setSelectedTimeframe: () => {},
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
    },
  },
}
export const NoEarningsHistoryMobile = getMobileStory(NoEarningsHistoryDesktop)
export const NoEarningsHistoryTablet = getTabletStory(NoEarningsHistoryDesktop)
