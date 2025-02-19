import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { WithClassname, WithTooltipProvider } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import type { Meta, StoryObj } from '@storybook/react'
import { ActiveReward } from '../../types'
import { ActiveRewardsPanel, ActiveRewardsPanelProps } from './ActiveRewardsPanel'

const meta: Meta<typeof ActiveRewardsPanel> = {
  title: 'Features/Rewards/Components/ActiveRewardsPanel',
  decorators: [WithTooltipProvider(), WithClassname('max-w-4xl')],
  component: ActiveRewardsPanel,
}

export default meta
type Story = StoryObj<typeof ActiveRewardsPanel>

const data: ActiveReward[] = [
  {
    token: tokens.REDSTONE,
    amountPending: NormalizedUnitNumber(123.4323),
    amountToClaim: NormalizedUnitNumber(224_093.23423),
  },
  {
    token: tokens.SPK,
    amountPending: NormalizedUnitNumber(44_224.22),
    amountToClaim: NormalizedUnitNumber(12_213.21),
  },
  {
    token: tokens.USDS,
    amountPending: NormalizedUnitNumber(11.22),
    amountToClaim: NormalizedUnitNumber(0),
  },
]

const args: ActiveRewardsPanelProps = {
  activeRewardsQueryResult: {
    data,
    isPending: false,
    isError: false,
    error: null,
  },
  openClaimDialog: () => {},
}

export const Desktop: Story = { args }
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const Pending: Story = {
  args: {
    ...args,
    activeRewardsQueryResult: { data: undefined, isPending: true, isError: false, error: null },
  },
}
export const PendingMobile = getMobileStory(Pending)
export const PendingTablet = getTabletStory(Pending)

export const ErrorState: Story = {
  args: {
    ...args,
    activeRewardsQueryResult: {
      data: undefined,
      isPending: false,
      isError: true,
      error: new Error('Could not fetch rewards'),
    },
  },
}
export const ErrorStateMobile = getMobileStory(ErrorState)
export const ErrorStateTablet = getTabletStory(ErrorState)
