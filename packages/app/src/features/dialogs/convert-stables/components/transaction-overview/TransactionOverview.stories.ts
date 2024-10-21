import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { TransactionOverview } from './TransactionOverview'

const meta: Meta<typeof TransactionOverview> = {
  title: 'Features/Dialogs/ConvertStables/Components/TransactionOverview',
  component: TransactionOverview,
  decorators: [WithClassname('max-w-xl'), WithTooltipProvider()],
  args: {
    from: tokens.DAI,
    to: tokens.USDC,
    txOverview: {
      status: 'success',
      route: [
        { token: tokens.DAI, value: NormalizedUnitNumber(1300.74), usdValue: NormalizedUnitNumber(1300.74) },
        { token: tokens.USDC, value: NormalizedUnitNumber(1300.74), usdValue: NormalizedUnitNumber(1300.74) },
      ],
      outcome: { token: tokens.USDC, value: NormalizedUnitNumber(1300.74), usdValue: NormalizedUnitNumber(1300.74) },
    },
  },
}

export default meta
type Story = StoryObj<typeof TransactionOverview>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
