import { getMobileStory, getTabletStory } from '@sb/viewports'
import type { Meta, StoryObj } from '@storybook/react'
import { GeneralStatsBar } from './GeneralStatsBar'

const meta: Meta<typeof GeneralStatsBar> = {
  title: 'Features/Savings/Components/GeneralStatsBar',
  component: GeneralStatsBar,
  args: {
    generalStatsResult: {
      data: {
        tvl: 5_000_123_000,
        getLiquidity: () => 1_000_000,
        users: 43_232,
      },
      isPending: false,
      isError: false,
      error: null,
    },
  },
}

export default meta
type Story = StoryObj<typeof GeneralStatsBar>

export const Default: Story = {}
export const Mobile = getMobileStory(Default)
export const Tablet = getTabletStory(Default)

export const HighValues: Story = {
  args: {
    generalStatsResult: {
      data: {
        tvl: 10_000_000_000,
        getLiquidity: () => Number.POSITIVE_INFINITY,
        users: 1_000_000,
      },
      isPending: false,
      isError: false,
      error: null,
    },
  },
}

export const LowValues: Story = {
  args: {
    generalStatsResult: {
      data: {
        tvl: 100_000,
        getLiquidity: () => 50_000,
        users: 100,
      },
      isPending: false,
      isError: false,
      error: null,
    },
  },
}

export const Pending: Story = {
  args: {
    generalStatsResult: {
      isPending: true,
      isError: false,
      error: null,
      data: undefined,
    },
  },
}
