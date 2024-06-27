import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { SuccessView } from './SuccessView'

const meta: Meta<typeof SuccessView> = {
  title: 'Features/Dialogs/Views/ClaimRewards/Success',
  component: SuccessView,
  decorators: [WithClassname('max-w-xl')],
  args: {
    claimedRewards: [
      {
        token: tokens.wstETH,
        amount: NormalizedUnitNumber(0.00157),
      },
      {
        token: tokens.WBTC,
        amount: NormalizedUnitNumber(0.0003498),
      },
    ],
  },
}

export default meta
type Story = StoryObj<typeof SuccessView>

export const Desktop: Story = {}

export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
