import { WithTooltipProvider } from '@storybook-config/decorators'
import { getMobileStory, getTabletStory } from '@storybook-config/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { assets } from '@/ui/assets'

import { Tile } from './Tile'

const meta: Meta<typeof Tile> = {
  title: 'Features/Markets/Components/SummaryTile/Components/Tile',
  component: Tile,
  decorators: [WithTooltipProvider()],
  args: {
    icon: assets.markets.lock,
    title: 'Total value locked',
    USDValue: NormalizedUnitNumber(12_300_000_000),
    description: 'Total value locked lengthy description',
  },
}

export default meta
type Story = StoryObj<typeof Tile>

export const Default: Story = {
  name: 'Default',
}

export const Mobile = getMobileStory(Default)
export const Tablet = getTabletStory(Default)
