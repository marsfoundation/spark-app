import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { mockRewardsChartData } from '../fixtures/mockRewardsChartData'
import { RewardsChart } from './RewardsChart'

const meta: Meta<typeof RewardsChart> = {
  title: 'Features/FarmDetails/Components/Chart/RewardsChart',
  component: RewardsChart,
  decorators: [WithClassname('max-w-lg')],
  args: {
    height: 320,
    data: mockRewardsChartData,
  },
}

export default meta
type Story = StoryObj<typeof RewardsChart>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
