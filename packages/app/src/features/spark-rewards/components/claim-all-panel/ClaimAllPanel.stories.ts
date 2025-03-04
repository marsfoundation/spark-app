import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { WithClassname, WithTooltipProvider } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { ClaimAllPanel } from './ClaimAllPanel'

const meta: Meta<typeof ClaimAllPanel> = {
  title: 'Features/SparkRewards/Components/ClaimAllPanel',
  component: ClaimAllPanel,
  decorators: [WithTooltipProvider(), WithClassname('max-w-[425px]')],
  args: {
    activeRewardsResult: {
      isPending: false,
      isError: false,
      error: null,
      data: [
        {
          token: tokens.wstETH,
          amountPending: NormalizedUnitNumber(0.01),
          amountToClaim: NormalizedUnitNumber(0.02),
          openClaimDialog: () => {},
        },
        {
          token: tokens.sUSDS,
          amountPending: NormalizedUnitNumber(23),
          amountToClaim: NormalizedUnitNumber(97),
          openClaimDialog: () => {},
        },
        {
          token: tokens.RED,
          amountPending: NormalizedUnitNumber(122),
          amountToClaim: NormalizedUnitNumber(1721),
          openClaimDialog: () => {},
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
    activeRewardsResult: {
      isPending: true,
      isError: false,
      error: null,
      data: undefined,
    },
  },
}

export const ErrorState: Story = {
  args: {
    activeRewardsResult: {
      isPending: false,
      isError: true,
      error: new Error('Failed to load active rewards data'),
      data: undefined,
    },
  },
}

export const OneTokenWithoutPrice: Story = {
  args: {
    activeRewardsResult: {
      isPending: false,
      isError: false,
      error: null,
      data: [
        {
          token: tokens.RED,
          amountPending: NormalizedUnitNumber(1232),
          amountToClaim: NormalizedUnitNumber(1721),
          openClaimDialog: () => {},
        },
      ],
    },
  },
}
export const TwoTokensWithoutPrice: Story = {
  args: {
    activeRewardsResult: {
      isPending: false,
      isError: false,
      error: null,
      data: [
        {
          token: tokens.RED,
          amountPending: NormalizedUnitNumber(1232),
          amountToClaim: NormalizedUnitNumber(1721),
          openClaimDialog: () => {},
        },
        {
          token: tokens.ABC,
          amountPending: NormalizedUnitNumber(12),
          amountToClaim: NormalizedUnitNumber(243),
          openClaimDialog: () => {},
        },
      ],
    },
  },
}
