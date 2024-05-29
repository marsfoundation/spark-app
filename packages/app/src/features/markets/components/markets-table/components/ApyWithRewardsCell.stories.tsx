import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { withRouter } from 'storybook-addon-react-router-v6'

import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'

import { ApyWithRewardsCell } from './ApyWithRewardsCell'

const meta: Meta<typeof ApyWithRewardsCell> = {
  title: 'Features/Markets/Components/MarketsTable/Components/ApyWithRewardsCell',
  component: ApyWithRewardsCell,
  decorators: [WithTooltipProvider(), withRouter, WithClassname('w-56')],
  args: {
    apyDetails: {
      apy: Percentage(0.157),
      incentives: [],
      airdrops: [],
    },
    incentivizedReserve: tokens.ETH,
    reserveStatus: 'active',
  },
}

export default meta
type Story = StoryObj<typeof ApyWithRewardsCell>

export const WithoutIncentives: Story = {
  name: 'WithoutIncentives',
}

export const WithAirdrop: Story = {
  name: 'WithAirdrop',
  args: {
    apyDetails: {
      apy: Percentage(0.157),
      incentives: [],
      airdrops: [{ id: 'SPK', amount: NormalizedUnitNumber(24_000_000) }],
    },
  },
}

export const WithRewards: Story = {
  name: 'WithRewards',
  args: {
    apyDetails: {
      apy: Percentage(0.157),
      incentives: [{ token: tokens.stETH, APR: Percentage(0.1) }],
      airdrops: [],
    },
  },
}

export const WithAirdropAndRewards: Story = {
  name: 'WithAirdropAndRewards',
  args: {
    apyDetails: {
      apy: Percentage(0.157),
      airdrops: [{ id: 'SPK', amount: NormalizedUnitNumber(24_000_000) }],
      incentives: [{ token: tokens.stETH, APR: Percentage(0.1) }],
    },
  },
}
