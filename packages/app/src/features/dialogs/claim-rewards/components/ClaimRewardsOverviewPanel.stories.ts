import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

import { tokens } from '@storybook/tokens'
import { ClaimRewardsOverviewPanel } from './ClaimRewardsOverviewPanel'

const meta: Meta<typeof ClaimRewardsOverviewPanel> = {
  title: 'Features/Dialogs/Components/ClaimRewardsOverviewPanel',
  component: ClaimRewardsOverviewPanel,
  args: {
    rewards: [
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
type Story = StoryObj<typeof ClaimRewardsOverviewPanel>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)
