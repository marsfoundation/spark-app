import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { Percentage } from '@/domain/types/NumericValues'
import { WithClassname } from '@storybook/decorators'
import { SavingsRateGraph } from './SavingsRateGraph'

const meta: Meta<typeof SavingsRateGraph> = {
  title: 'Features/Savings/Components/SavingsGraph/Components/SavingsRateGraph',
  component: SavingsRateGraph,
  decorators: [WithClassname('max-w-lg')],
  args: {
    height: 320,
  },
}

export default meta
type Story = StoryObj<typeof SavingsRateGraph>

export const SsrDesktop: Story = {
  args: {
    tooltipLabel: 'SSR',
    data: [
      { rate: Percentage('0.0625'), date: new Date('2024-09-30T20:39:13.285423') },
      { rate: Percentage('0.0625'), date: new Date('2024-09-29T23:59:59.999999') },
      { rate: Percentage('0.0625'), date: new Date('2024-09-28T23:59:59.999999') },
      { rate: Percentage('0.0625'), date: new Date('2024-09-27T23:59:59.999999') },
      { rate: Percentage('0.0625'), date: new Date('2024-09-26T23:59:59.999999') },
      { rate: Percentage('0.0625'), date: new Date('2024-09-25T23:59:59.999999') },
      { rate: Percentage('0.0625'), date: new Date('2024-09-24T23:59:59.999999') },
      { rate: Percentage('0.0625'), date: new Date('2024-09-23T23:59:59.999999') },
      { rate: Percentage('0.0625'), date: new Date('2024-09-22T23:59:59.999999') },
      { rate: Percentage('0.0625'), date: new Date('2024-09-21T23:59:59.999999') },
      { rate: Percentage('0.0625'), date: new Date('2024-09-20T23:59:59.999999') },
      { rate: Percentage('0.065'), date: new Date('2024-09-19T23:59:59.999999') },
      { rate: Percentage('0.065'), date: new Date('2024-09-18T23:59:59.999999') },
      { rate: Percentage('0.065'), date: new Date('2024-09-17T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-09-16T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-09-15T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-09-14T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-09-13T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-09-12T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-09-11T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-09-10T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-09-09T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-09-08T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-09-07T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-09-06T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-09-05T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-09-04T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-09-03T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-09-02T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-09-01T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-08-31T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-08-30T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-08-29T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-08-28T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-08-27T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-08-26T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-08-25T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-08-24T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-08-23T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-08-22T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-08-21T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-08-20T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-08-19T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-08-18T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-08-17T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-08-16T23:59:59.999999') },
      { rate: Percentage('0.0600'), date: new Date('2024-08-15T23:59:59.999999') },
      { rate: Percentage('0.0700'), date: new Date('2024-08-14T23:59:59.999999') },
      { rate: Percentage('0.0700'), date: new Date('2024-08-13T23:59:59.999999') },
      { rate: Percentage('0.0700'), date: new Date('2024-08-12T23:59:59.999999') },
    ],
  },
}
export const SsrMobile = getMobileStory(SsrDesktop)
export const SsrTablet = getTabletStory(SsrDesktop)

export const DsrDesktop: Story = {
  args: {
    tooltipLabel: 'DSR',
    data: [
      { rate: Percentage('0.06'), date: new Date('2024-09-30T20:39:13.285423') },
      { rate: Percentage('0.06'), date: new Date('2024-09-29T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-28T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-27T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-26T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-25T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-24T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-23T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-22T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-21T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-20T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-19T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-18T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-17T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-16T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-15T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-14T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-13T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-12T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-11T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-10T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-09T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-08T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-07T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-06T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-05T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-04T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-03T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-02T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-09-01T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-08-31T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-08-30T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-08-29T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-08-28T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-08-27T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-08-26T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-08-25T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-08-24T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-08-23T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-08-22T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-08-21T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-08-20T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-08-19T23:59:59.999999') },
      { rate: Percentage('0.06'), date: new Date('2024-08-18T23:59:59.999999') },
      { rate: Percentage('0.065'), date: new Date('2024-08-17T23:59:59.999999') },
      { rate: Percentage('0.065'), date: new Date('2024-08-16T23:59:59.999999') },
      { rate: Percentage('0.065'), date: new Date('2024-08-15T23:59:59.999999') },
      { rate: Percentage('0.07'), date: new Date('2024-08-14T23:59:59.999999') },
      { rate: Percentage('0.07'), date: new Date('2024-08-13T23:59:59.999999') },
      { rate: Percentage('0.07'), date: new Date('2024-08-12T23:59:59.999999') },
    ],
  },
}
export const DsrMobile = getMobileStory(DsrDesktop)
export const DsrTablet = getTabletStory(DsrDesktop)
