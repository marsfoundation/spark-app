import { getMobileStory, getTabletStory } from '@sb/viewports'
import type { Meta, StoryObj } from '@storybook/react'
import { GeneralStatsBar } from './GeneralStatsBar'

const meta: Meta<typeof GeneralStatsBar> = {
  title: 'Features/Savings/Components/GeneralStatsBar',
  component: GeneralStatsBar,
  args: {
    tvl: 5_000_123_000,
    liquidity: 1_000_000,
    users: 43_232,
  },
}

export default meta
type Story = StoryObj<typeof GeneralStatsBar>

export const Default: Story = {}
export const Mobile = getMobileStory(Default)
export const Tablet = getTabletStory(Default)

export const HighValues: Story = {
  args: {
    tvl: 10_000_000_000,
    liquidity: 5_000_000_000,
    users: 1_000_000,
  },
}

export const LowValues: Story = {
  args: {
    tvl: 100_000,
    liquidity: 50_000,
    users: 100,
  },
}
