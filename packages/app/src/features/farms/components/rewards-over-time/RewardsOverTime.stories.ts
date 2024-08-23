import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { Percentage } from '@/domain/types/NumericValues'
import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { RewardsOverTime } from './RewardsOverTime'

const meta: Meta<typeof RewardsOverTime> = {
  title: 'Features/Farms/Components/RewardsOverTime',
  component: RewardsOverTime,
  decorators: [WithClassname('max-w-lg'), WithTooltipProvider()],
  args: {
    data: [
      { apr: Percentage('0.040'), date: new Date('2023-02-15T00:00:00') },
      { apr: Percentage('0.043'), date: new Date('2023-02-28T00:00:00') },
      { apr: Percentage('0.043'), date: new Date('2023-03-15T00:00:00') },
      { apr: Percentage('0.043'), date: new Date('2023-03-31T00:00:00') },
      { apr: Percentage('0.047'), date: new Date('2023-04-15T00:00:00') },
      { apr: Percentage('0.049'), date: new Date('2023-04-30T00:00:00') },
      { apr: Percentage('0.052'), date: new Date('2023-05-15T00:00:00') },
      { apr: Percentage('0.055'), date: new Date('2023-05-31T00:00:00') },
      { apr: Percentage('0.055'), date: new Date('2023-06-15T00:00:00') },
      { apr: Percentage('0.055'), date: new Date('2023-06-30T00:00:00') },
      { apr: Percentage('0.055'), date: new Date('2023-07-15T00:00:00') },
      { apr: Percentage('0.055'), date: new Date('2023-07-31T00:00:00') },
      { apr: Percentage('0.055'), date: new Date('2023-08-15T00:00:00') },
      { apr: Percentage('0.055'), date: new Date('2023-08-31T00:00:00') },
      { apr: Percentage('0.055'), date: new Date('2023-09-15T00:00:00') },
      { apr: Percentage('0.055'), date: new Date('2023-09-30T00:00:00') },
      { apr: Percentage('0.055'), date: new Date('2023-10-15T00:00:00') },
      { apr: Percentage('0.110'), date: new Date('2023-10-31T00:00:00') },
      { apr: Percentage('0.110'), date: new Date('2023-11-15T00:00:00') },
      { apr: Percentage('0.110'), date: new Date('2023-11-30T00:00:00') },
      { apr: Percentage('0.110'), date: new Date('2023-12-15T00:00:00') },
      { apr: Percentage('0.110'), date: new Date('2023-12-31T00:00:00') },
      { apr: Percentage('0.120'), date: new Date('2024-01-15T00:00:00') },
      { apr: Percentage('0.120'), date: new Date('2024-01-31T00:00:00') },
      { apr: Percentage('0.120'), date: new Date('2024-02-14T00:00:00') },
      { apr: Percentage('0.120'), date: new Date('2024-02-29T00:00:00') },
      { apr: Percentage('0.140'), date: new Date('2024-03-15T00:00:00') },
      { apr: Percentage('0.145'), date: new Date('2024-03-31T00:00:00') },
      { apr: Percentage('0.148'), date: new Date('2024-04-15T00:00:00') },
      { apr: Percentage('0.150'), date: new Date('2024-04-30T00:00:00') },
      { apr: Percentage('0.151'), date: new Date('2024-05-15T00:00:00') },
      { apr: Percentage('0.150'), date: new Date('2024-05-31T00:00:00') },
      { apr: Percentage('0.148'), date: new Date('2024-06-15T00:00:00') },
      { apr: Percentage('0.145'), date: new Date('2024-06-30T00:00:00') },
      { apr: Percentage('0.141'), date: new Date('2024-07-05T00:00:00') },
      { apr: Percentage('0.138'), date: new Date('2024-07-10T00:00:00') },
      { apr: Percentage('0.138'), date: new Date('2024-07-15T00:00:00') },
      { apr: Percentage('0.138'), date: new Date('2024-07-20T00:00:00') },
      { apr: Percentage('0.138'), date: new Date('2024-07-25T00:00:00') },
      { apr: Percentage('0.138'), date: new Date('2024-07-31T00:00:00') },
      { apr: Percentage('0.120'), date: new Date('2024-08-05T00:00:00') },
      { apr: Percentage('0.120'), date: new Date('2024-08-10T00:00:00') },
      { apr: Percentage('0.120'), date: new Date('2024-08-15T00:00:00') },
      { apr: Percentage('0.120'), date: new Date('2024-08-20T00:00:00') },
      { apr: Percentage('0.120'), date: new Date('2024-08-22T00:00:00') },
    ],
  },
}

export default meta
type Story = StoryObj<typeof RewardsOverTime>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
