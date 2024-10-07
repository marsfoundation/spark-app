import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { mockSsrChartData } from '../../fixtures/mockSavingsRateChartData'
import { SsrChart } from './SsrChart'

const meta: Meta<typeof SsrChart> = {
  title: 'Features/Savings/Components/SavingsCharts/Components/SsrChart',
  component: SsrChart,
  decorators: [WithClassname('max-w-lg')],
  args: {
    height: 320,
    width: 512,
    data: mockSsrChartData,
  },
}

export default meta
type Story = StoryObj<typeof SsrChart>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
