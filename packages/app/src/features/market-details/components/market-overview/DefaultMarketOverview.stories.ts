import { WithClassname } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { NormalizedUnitNumber, Percentage } from '@marsfoundation/common-universal'

import { DefaultMarketOverview } from './DefaultMarketOverview'

const meta: Meta<typeof DefaultMarketOverview> = {
  title: 'Features/MarketDetails/Components/MarketOverview/DefaultMarketOverview',
  decorators: [WithClassname('max-w-xs')],
  component: DefaultMarketOverview,
}

export default meta
type Story = StoryObj<typeof DefaultMarketOverview>

export const Default: Story = {
  name: 'Default',
  args: {
    token: tokens.USDC,
    marketSize: NormalizedUnitNumber(1_243_000_000),
    borrowed: NormalizedUnitNumber(823_000_000),
    available: NormalizedUnitNumber(420_000_000),
    utilizationRate: Percentage(0.66),
  },
}
export const Mobile = getMobileStory(Default)
export const Tablet = getTabletStory(Default)

export const FullUtilization: Story = {
  name: 'Full Utilization',
  args: {
    token: tokens.USDC,
    marketSize: NormalizedUnitNumber(1_000_000_000),
    borrowed: NormalizedUnitNumber(1_000_000_000),
    available: NormalizedUnitNumber(0),
    utilizationRate: Percentage(1),
  },
}
export const FullUtilizationMobile = getMobileStory(FullUtilization)
export const FullUtilizationTablet = getTabletStory(FullUtilization)

export const ZeroUtilization: Story = {
  name: 'Zero Utilization',
  args: {
    token: tokens.USDC,
    marketSize: NormalizedUnitNumber(1_000_000_000),
    borrowed: NormalizedUnitNumber(0),
    available: NormalizedUnitNumber(1_000_000_000),
    utilizationRate: Percentage(0),
  },
}
export const ZeroUtilizationMobile = getMobileStory(ZeroUtilization)
export const ZeroUtilizationTablet = getTabletStory(ZeroUtilization)
