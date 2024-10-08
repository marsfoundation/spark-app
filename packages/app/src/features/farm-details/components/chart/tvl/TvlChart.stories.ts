import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { mockTvlChartData } from '../fixtures/mockTvlChartData'
import { TvlChart } from './TvlChart'

const meta: Meta<typeof TvlChart> = {
  title: 'Features/FarmDetails/Components/Chart/TvlChart',
  component: TvlChart,
  decorators: [WithClassname('max-w-lg')],
  args: {
    height: 320,
    width: 512,
    data: mockTvlChartData,
  },
}

export default meta
type Story = StoryObj<typeof TvlChart>

export const Desktop: Story = {}
export const Tablet = getTabletStory(Desktop)

const MobileStory: Story = {
  args: {
    width: 340,
  },
}
export const Mobile = getMobileStory(MobileStory)
