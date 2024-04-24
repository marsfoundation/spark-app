import { WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

import { SummaryTile } from './SummaryTile'

const meta: Meta<typeof SummaryTile> = {
  title: 'Features/Markets/Components/SummaryTile',
  component: SummaryTile,
  decorators: [WithTooltipProvider()],
}

export default meta
type Story = StoryObj<typeof SummaryTile>

export const TotalMarketSize: Story = {
  name: 'Total Market Size',
  args: {
    variant: 'total-market-size',
    USDValue: NormalizedUnitNumber(12_300_000_000),
  },
}
export const TotalMarketSizeMobile = getMobileStory(TotalMarketSize)
export const TotalMarketSizeTablet = getTabletStory(TotalMarketSize)

export const TotalValueLocked: Story = {
  name: 'Total Value Locked',
  args: {
    variant: 'total-value-locked',
    USDValue: NormalizedUnitNumber(8_300_000_000),
  },
}

export const TotalAvailable: Story = {
  name: 'Total Available',
  args: {
    variant: 'total-available',
    USDValue: NormalizedUnitNumber(3_300_000_000),
  },
}

export const TotalBorrows: Story = {
  name: 'Total Borrows',
  args: {
    variant: 'total-borrows',
    USDValue: NormalizedUnitNumber(6_300_000_000),
  },
}
