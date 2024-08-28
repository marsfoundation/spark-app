import { exampleFarmHistoricData } from '@storybook/consts'
import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { AprOverTime } from './AprOverTime'

const meta: Meta<typeof AprOverTime> = {
  title: 'Features/FarmDetails/Components/AprOverTime',
  component: AprOverTime,
  decorators: [WithClassname('max-w-lg'), WithTooltipProvider()],
  args: {
    data: exampleFarmHistoricData,
  },
}

export default meta
type Story = StoryObj<typeof AprOverTime>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
