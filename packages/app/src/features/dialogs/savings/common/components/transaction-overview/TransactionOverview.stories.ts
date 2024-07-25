import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory } from '@storybook/viewports'
import { TransactionOverview } from './TransactionOverview'

const meta: Meta<typeof TransactionOverview> = {
  title: 'Features/Dialogs/Savings/Components/TransactionOverview',
  component: TransactionOverview,
  decorators: [WithClassname('max-w-xl'), WithTooltipProvider()],
  args: {
    txOverview: {
      dai: tokens.DAI,
      status: 'success',
      APY: Percentage(0.05),
      daiEarnRate: NormalizedUnitNumber(542),
      route: [
        { token: tokens.DAI, value: NormalizedUnitNumber(1300.74), usdValue: NormalizedUnitNumber(1300.74) },
        { token: tokens.sDAI, value: NormalizedUnitNumber(925.75), usdValue: NormalizedUnitNumber(1300.74) },
      ],
      makerBadgeToken: tokens.DAI,
      outTokenAmount: NormalizedUnitNumber(925.75),
    },
  },
}

export default meta
type Story = StoryObj<typeof TransactionOverview>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
