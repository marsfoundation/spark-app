import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { WithClassname } from '@storybook/decorators'
import { mockDsrChartData } from '../../fixtures/mockSavingsRateChartData'
import { DsrChart } from './DsrChart'

const meta: Meta<typeof DsrChart> = {
  title: 'Features/Savings/Components/SavingsCharts/Components/DsrChart',
  component: DsrChart,
  decorators: [WithClassname('max-w-lg')],
  args: {
    height: 320,
    width: 512,
    data: mockDsrChartData,
  },
}

export default meta
type Story = StoryObj<typeof DsrChart>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
