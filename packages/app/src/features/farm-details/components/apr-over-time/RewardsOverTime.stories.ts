import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { mockChartData } from '../../fixtures/mockChartData'
import { FarmHistoryQueryResult } from '../../logic/historic/useFarmHistoryQuery'
import { RewardsOverTime } from './RewardsOverTime'

const meta: Meta<typeof RewardsOverTime> = {
  title: 'Features/FarmDetails/Components/RewardsOverTime',
  component: RewardsOverTime,
  decorators: [WithClassname('max-w-lg'), WithTooltipProvider()],
  args: {
    farmHistory: {
      data: mockChartData,
    } as FarmHistoryQueryResult,
  },
}

export default meta
type Story = StoryObj<typeof RewardsOverTime>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const Loading: Story = {
  args: {
    farmHistory: {
      isPending: true,
    } as FarmHistoryQueryResult,
  },
}
export const LoadingMobile = getMobileStory(Loading)
export const LoadingTablet = getTabletStory(Loading)

export const Failed: Story = {
  args: {
    farmHistory: {
      isPending: false,
      error: new Error('Something went wrong'),
    } as FarmHistoryQueryResult,
  },
}
export const FailedMobile = getMobileStory(Failed)
export const FailedTablet = getTabletStory(Failed)
