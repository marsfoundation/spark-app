import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { WithClassname, WithFixedDate } from '@storybook/decorators'
import { mockEarningsChartData, mockEarningsPredictionsChartData } from '../fixtures/mockEarningsChartData'
import { MyEarningsChart } from './MyEarningsChart'

const meta: Meta<typeof MyEarningsChart> = {
  title: 'Features/Savings/Components/SavingsCharts/Components/MyEarningsChart',
  component: MyEarningsChart,
  decorators: [WithClassname('max-w-lg'), WithFixedDate()],
  args: {
    height: 320,
    data: mockEarningsChartData,
    predictions: mockEarningsPredictionsChartData,
  },
}

export default meta
type Story = StoryObj<typeof MyEarningsChart>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
