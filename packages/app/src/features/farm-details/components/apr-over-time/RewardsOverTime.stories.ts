import { exampleFarmHistoricData } from '@storybook/consts'
import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { RewardsOverTime } from './RewardsOverTime'

const meta: Meta<typeof RewardsOverTime> = {
  title: 'Features/FarmDetails/Components/RewardsOverTime',
  component: RewardsOverTime,
  decorators: [WithClassname('max-w-lg'), WithTooltipProvider()],
  args: {
    data: exampleFarmHistoricData,
  },
}

export default meta
type Story = StoryObj<typeof RewardsOverTime>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
