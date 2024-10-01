import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { WithClassname, WithFixedDate } from '@storybook/decorators'
import { MyEarningsChart } from './MyEarningsChart'

const meta: Meta<typeof MyEarningsChart> = {
  title: 'Features/Savings/Components/SavingsGraph/Components/MyEarningsChart',
  component: MyEarningsChart,
  decorators: [WithClassname('max-w-lg'), WithFixedDate()],
  args: {
    height: 320,
    data: [
      { balance: NormalizedUnitNumber('40000'), date: new Date('2024-08-01T00:00:00') },
      { balance: NormalizedUnitNumber('45000'), date: new Date('2024-08-02T00:00:00') },
      { balance: NormalizedUnitNumber('50000'), date: new Date('2024-08-05T00:00:00') },
      { balance: NormalizedUnitNumber('55000'), date: new Date('2024-08-10T00:00:00') },
      { balance: NormalizedUnitNumber('110000'), date: new Date('2024-08-15T00:00:00') },
      { balance: NormalizedUnitNumber('120000'), date: new Date('2024-08-20T00:00:00') },
      { balance: NormalizedUnitNumber('130000'), date: new Date('2024-08-22T00:00:00') },
      { balance: NormalizedUnitNumber('140000'), date: new Date('2024-08-23T00:00:00') },
      { balance: NormalizedUnitNumber('510000'), date: new Date('2024-08-25T00:00:00') },
      { balance: NormalizedUnitNumber('520000'), date: new Date('2024-08-26T00:00:00') },
      { balance: NormalizedUnitNumber('540000'), date: new Date('2024-08-27T00:00:00') },
      { balance: NormalizedUnitNumber('600000'), date: new Date('2024-08-28T00:00:00') },
      { balance: NormalizedUnitNumber('620000'), date: new Date('2024-08-29T00:00:00') },
    ],
    predictions: [
      { balance: NormalizedUnitNumber('620000'), date: new Date('2024-08-29T00:00:00') },
      { balance: NormalizedUnitNumber('670000'), date: new Date('2024-08-31T00:00:00') },
      { balance: NormalizedUnitNumber('680000'), date: new Date('2024-09-02T00:00:00') },
      { balance: NormalizedUnitNumber('690000'), date: new Date('2024-09-05T00:00:00') },
      { balance: NormalizedUnitNumber('700000'), date: new Date('2024-09-07T00:00:00') },
      { balance: NormalizedUnitNumber('1100000'), date: new Date('2024-09-10T00:00:00') },
      { balance: NormalizedUnitNumber('1100000'), date: new Date('2024-09-11T00:00:00') },
    ],
  },
}

export default meta
type Story = StoryObj<typeof MyEarningsChart>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
