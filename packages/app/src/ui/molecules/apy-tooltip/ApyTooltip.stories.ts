import { WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { ApyTooltip } from './ApyTooltip'

const meta: Meta<typeof ApyTooltip> = {
  title: 'Components/Molecules/ApyTooltip',
  component: ApyTooltip,
  decorators: [WithTooltipProvider()],
  args: {
    variant: 'supply',
    children: 'Deposit APY',
  },
}

export default meta

type Story = StoryObj<typeof ApyTooltip>

export const SupplyDesktop: Story = {}
export const SupplyMobile = getMobileStory(SupplyDesktop)
export const SupplyTablet = getTabletStory(SupplyDesktop)

export const BorrowDesktop: Story = { args: { variant: 'borrow', children: 'Borrow APY' } }
export const BorrowMobile = getMobileStory(BorrowDesktop)
export const BorrowTablet = getTabletStory(BorrowDesktop)
