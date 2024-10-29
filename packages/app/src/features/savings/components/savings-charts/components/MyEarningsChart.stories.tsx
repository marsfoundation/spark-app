import { getMobileStory, getTabletStory } from '@storybook-config/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { WithClassname, WithFixedDate } from '@storybook-config/decorators'
import { mockEarningsChartData, mockEarningsPredictionsChartData } from '../fixtures/mockEarningsChartData'
import { MyEarningsChart } from './MyEarningsChart'

const meta: Meta<typeof MyEarningsChart> = {
  title: 'Features/Savings/Components/SavingsCharts/Components/MyEarningsChart',
  component: MyEarningsChart,
  decorators: [WithClassname('max-w-lg'), WithFixedDate()],
  args: {
    height: 320,
    width: 512,
    data: mockEarningsChartData,
    predictions: mockEarningsPredictionsChartData,
  },
}

export default meta
type Story = StoryObj<typeof MyEarningsChart>

export const Desktop: Story = {}
export const Tablet = getTabletStory(Desktop)

const MobileStory: Story = {
  args: {
    width: 340,
  },
}
export const Mobile = getMobileStory(MobileStory)
