import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { WithTooltipProvider } from '@sb/decorators'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { LockIcon } from 'lucide-react'
import { Tile } from './Tile'

const meta: Meta<typeof Tile> = {
  title: 'Features/Markets/Components/SummaryTile/Components/Tile',
  component: Tile,
  decorators: [WithTooltipProvider()],
  args: {
    icon: LockIcon,
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
