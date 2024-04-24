import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'

import { DaiMarketOverview } from './DaiMarketOverview'

const meta: Meta<typeof DaiMarketOverview> = {
  title: 'Features/MarketDetails/Components/MarketOverview/DaiMarketOverview',
  decorators: [WithClassname('max-w-xs')],
  component: DaiMarketOverview,
}

export default meta
type Story = StoryObj<typeof DaiMarketOverview>

export const Default: Story = {
  name: 'Default',
  args: {
    token: tokens['DAI'],
    borrowed: NormalizedUnitNumber(823_000_000),
    marketSize: NormalizedUnitNumber(1_243_000_000),
    totalAvailable: NormalizedUnitNumber(420_000_000),
    utilizationRate: Percentage(0.66),
    instantlyAvailable: NormalizedUnitNumber(99_000_000),
    makerDaoCapacity: NormalizedUnitNumber(320_000_000),
  },
}

export const Mobile = getMobileStory(Default)
export const Tablet = getTabletStory(Default)
