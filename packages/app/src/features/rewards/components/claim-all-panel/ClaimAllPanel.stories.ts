import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { WithClassname, WithTooltipProvider } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { ClaimAllPanel } from './ClaimAllPanel'

const meta: Meta<typeof ClaimAllPanel> = {
  title: 'Features/Rewards/Components/ClaimAllPanel',
  component: ClaimAllPanel,
  decorators: [WithTooltipProvider(), WithClassname('max-w-[425px]')],
  args: {
    tokensToClaim: [
      {
        token: tokens.wstETH,
        value: NormalizedUnitNumber(0.02),
      },
      {
        token: tokens.sUSDS,
        value: NormalizedUnitNumber(97),
      },
      {
        token: tokens.REDSTONE,
        value: NormalizedUnitNumber(1721),
      },
    ],
  },
}

export default meta
type Story = StoryObj<typeof ClaimAllPanel>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const OneTokenWithoutPrice: Story = {
  args: {
    tokensToClaim: [
      {
        token: tokens.REDSTONE,
        value: NormalizedUnitNumber(1721),
      },
    ],
  },
}
export const TwoTokensWithoutPrice: Story = {
  args: {
    tokensToClaim: [
      {
        token: tokens.REDSTONE,
        value: NormalizedUnitNumber(1721),
      },
      {
        token: tokens.ABC,
        value: NormalizedUnitNumber(243),
      },
    ],
  },
}
