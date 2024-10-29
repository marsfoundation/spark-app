import { WithClassname } from '@storybook-config/decorators'
import { getMobileStory, getTabletStory } from '@storybook-config/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { mockRewardsChartData } from '../fixtures/mockRewardsChartData'
import { RewardsChart } from './RewardsChart'

const meta: Meta<typeof RewardsChart> = {
  title: 'Features/FarmDetails/Components/Chart/RewardsChart',
  component: RewardsChart,
  decorators: [WithClassname('max-w-lg')],
  args: {
    height: 320,
    width: 512,
    data: mockRewardsChartData,
  },
}

export default meta
type Story = StoryObj<typeof RewardsChart>

export const Desktop: Story = {}
export const Tablet = getTabletStory(Desktop)

const MobileStory: Story = {
  args: {
    width: 340,
  },
}
export const Mobile = getMobileStory(MobileStory)
