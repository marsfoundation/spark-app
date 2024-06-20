import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory } from '@storybook/viewports'

import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { tokens } from '@storybook/tokens'
import { MakerTransactionOverview } from './MakerTransactionOverview'

const meta: Meta<typeof MakerTransactionOverview> = {
  title: 'Features/Dialogs/Savings/Components/MakerTransactionOverview',
  component: MakerTransactionOverview,
  decorators: [WithClassname('max-w-xl'), WithTooltipProvider()],
  args: {
    txOverview: {
      dai: tokens.DAI,
      type: 'maker',
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
type Story = StoryObj<typeof MakerTransactionOverview>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
