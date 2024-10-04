import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { WithClassname, WithFixedDate } from '@storybook/decorators'
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
      data: {
        data: mockEarningsChartData,
        predictions: mockEarningsPredictionsChartData,
      },
      isError: false,
      isLoading: false,
      shouldDisplayMyEarnings: true,
    },
    savingsRateInfo: {
      data: {
        ssr: mockSsrChartData,
        dsr: mockDsrChartData,
      },
      isError: false,
      isLoading: false,
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
      data: { data: [], predictions: [] },
      isError: false,
      isLoading: false,
      shouldDisplayMyEarnings: false,
    },
  },
}
export const NoEarningsHistoryMobile = getMobileStory(NoEarningsHistoryDesktop)
export const NoEarningsHistoryTablet = getTabletStory(NoEarningsHistoryDesktop)
