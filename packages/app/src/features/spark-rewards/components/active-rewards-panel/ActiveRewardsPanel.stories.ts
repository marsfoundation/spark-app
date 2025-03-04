import { NormalizedUnitNumber, raise } from '@marsfoundation/common-universal'
import { WithClassname, WithTooltipProvider } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import { ActiveReward } from '../../logic/useActiveRewards'
import { ActiveRewardsPanel, ActiveRewardsPanelProps } from './ActiveRewardsPanel'

const meta: Meta<typeof ActiveRewardsPanel> = {
  title: 'Features/SparkRewards/Components/ActiveRewardsPanel',
  decorators: [WithTooltipProvider(), WithClassname('max-w-4xl')],
  component: ActiveRewardsPanel,
}

export default meta
type Story = StoryObj<typeof ActiveRewardsPanel>

const data: ActiveReward[] = [
  {
    token: tokens.RED,
    amountPending: NormalizedUnitNumber(123.4323),
    amountToClaim: NormalizedUnitNumber(224_093.23423),
    openClaimDialog: () => {},
  },
  {
    token: tokens.SPK,
    amountPending: NormalizedUnitNumber(44_224.22),
    amountToClaim: NormalizedUnitNumber(12_213.21),
    openClaimDialog: () => {},
  },
  {
    token: tokens.USDS,
    amountPending: NormalizedUnitNumber(11.22),
    amountToClaim: NormalizedUnitNumber(0),
    openClaimDialog: () => {},
  },
]

const args: ActiveRewardsPanelProps = {
  activeRewardsResult: {
    data,
    isPending: false,
    isError: false,
    error: null,
  },
}

export const Desktop: Story = { args }
export const Mobile: Story = {
  ...getMobileStory(Desktop),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body)
    const rows = await canvas.findAllByRole('switch')
    const firstRow = rows[0] ?? raise('No table row found')
    await userEvent.click(firstRow)
  },
}
export const Tablet = getTabletStory(Desktop)

export const NoRewards: Story = {
  args: {
    ...args,
    activeRewardsResult: { data: [], isPending: false, isError: false, error: null },
  },
}
export const NoRewardsMobile = getMobileStory(NoRewards)
export const NoRewardsTablet = getTabletStory(NoRewards)

export const Pending: Story = {
  args: {
    ...args,
    activeRewardsResult: { data: undefined, isPending: true, isError: false, error: null },
  },
}
export const PendingMobile = getMobileStory(Pending)
export const PendingTablet = getTabletStory(Pending)

export const ErrorState: Story = {
  args: {
    ...args,
    activeRewardsResult: {
      data: undefined,
      isPending: false,
      isError: true,
      error: new Error('Could not fetch rewards'),
    },
  },
}
export const ErrorStateMobile = getMobileStory(ErrorState)
export const ErrorStateTablet = getTabletStory(ErrorState)

export const ZeroAmounts: Story = {
  args: {
    activeRewardsResult: {
      data: [
        {
          token: tokens.REDSTONE,
          amountPending: NormalizedUnitNumber(0),
          amountToClaim: NormalizedUnitNumber(0),
          openClaimDialog: () => {},
        },
        {
          token: tokens.SPK,
          amountPending: NormalizedUnitNumber(0),
          amountToClaim: NormalizedUnitNumber(0),
          openClaimDialog: () => {},
        },
        {
          token: tokens.USDS,
          amountPending: NormalizedUnitNumber(0),
          amountToClaim: NormalizedUnitNumber(0),
          openClaimDialog: () => {},
        },
      ],
      isPending: false,
      isError: false,
      error: null,
    },
  },
}
