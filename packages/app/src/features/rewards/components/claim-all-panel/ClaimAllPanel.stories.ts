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
    tokensToClaimQueryResult: {
      isPending: false,
      isError: false,
      error: null,
      data: [
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
    onClaimAll: () => {},
  },
}

export default meta
type Story = StoryObj<typeof ClaimAllPanel>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const Pending: Story = {
  args: {
    tokensToClaimQueryResult: {
      isPending: true,
      isError: false,
      error: null,
      data: undefined,
    },
  },
}

export const ErrorState: Story = {
  args: {
    tokensToClaimQueryResult: {
      isPending: false,
      isError: true,
      error: new Error('Failed to load active rewards data'),
      data: undefined,
    },
  },
}

export const OneTokenWithoutPrice: Story = {
  args: {
    tokensToClaimQueryResult: {
      isPending: false,
      isError: false,
      error: null,
      data: [
        {
          token: tokens.REDSTONE,
          value: NormalizedUnitNumber(1721),
        },
      ],
    },
  },
}
export const TwoTokensWithoutPrice: Story = {
  args: {
    tokensToClaimQueryResult: {
      isPending: false,
      isError: false,
      error: null,
      data: [
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
  },
}
