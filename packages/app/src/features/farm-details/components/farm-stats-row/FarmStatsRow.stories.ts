import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { FarmStatsRow } from './FarmStatsRow'

const meta: Meta<typeof FarmStatsRow> = {
  title: 'Features/FarmDetails/Components/FarmStatsRow',
  component: FarmStatsRow,
  decorators: [WithClassname('max-w-lg'), WithTooltipProvider()],
  args: {
    depositors: 6,
    tvl: NormalizedUnitNumber(57_891),
    apy: Percentage(0.05),
  },
}

export default meta
type Story = StoryObj<typeof FarmStatsRow>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)

export const DesktopWithDeposit: Story = {
  args: {
    deposit: {
      token: tokens.USDS,
      value: NormalizedUnitNumber(10_000),
    },
  },
}
export const MobileWithDeposit: Story = getMobileStory(DesktopWithDeposit)
export const TabletWithDeposit: Story = getTabletStory(DesktopWithDeposit)
