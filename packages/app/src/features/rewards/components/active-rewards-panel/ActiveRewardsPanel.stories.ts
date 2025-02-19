import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import type { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-remix-react-router'
import { ActiveRewardsPanel, ActiveRewardsPanelProps } from './ActiveRewardsPanel'

const meta: Meta<typeof ActiveRewardsPanel> = {
  title: 'Features/Rewards/Components/ActiveRewardsPanel',
  decorators: [withRouter()],
  component: ActiveRewardsPanel,
}

export default meta
type Story = StoryObj<typeof ActiveRewardsPanel>

const args = {
  rewards: [
    {
      token: tokens.REDSTONE,
      amountPending: NormalizedUnitNumber(123.4323),
      amountToClaim: NormalizedUnitNumber(24224.23423),
    },
    {
      token: tokens.SPK,
      amountPending: NormalizedUnitNumber(44224.22),
      amountToClaim: NormalizedUnitNumber(121.21),
    },
    {
      token: tokens.USDS,
      amountPending: NormalizedUnitNumber(11.22),
      amountToClaim: NormalizedUnitNumber(0),
    },
  ],
  openClaimDialog: () => {},
} satisfies ActiveRewardsPanelProps

export const Desktop: Story = {
  args,
}

export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
