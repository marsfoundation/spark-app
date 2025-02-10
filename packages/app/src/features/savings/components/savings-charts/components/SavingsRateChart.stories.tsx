import { WithClassname } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { mockSsrChartData } from '../fixtures/mockSavingsRateChartData'
import { SavingsRateChart } from './SavingsRateChart'

const meta: Meta<typeof SavingsRateChart> = {
  title: 'Features/Savings/Components/SavingsCharts/Components/SavingsRateChart',
  component: SavingsRateChart,
  decorators: [WithClassname('max-w-lg')],
  args: {
    tooltipLabel: 'Savings Rate',
    height: 320,
    width: 512,
    data: mockSsrChartData,
    savingsToken: tokens.sUSDS,
  },
}

export default meta
type Story = StoryObj<typeof SavingsRateChart>

export const Desktop: Story = {}
export const Tablet = getTabletStory(Desktop)

const MobileStory: Story = {
  args: {
    width: 340,
  },
}
export const Mobile = getMobileStory(MobileStory)
