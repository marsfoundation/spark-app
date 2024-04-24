import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { withRouter } from 'storybook-addon-react-router-v6'

import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'

import { SupplyStatusPanel } from './SupplyStatusPanel'

const meta: Meta<typeof SupplyStatusPanel> = {
  title: 'Features/MarketDetails/Components/StatusPanel/SupplyStatusPanel',
  component: SupplyStatusPanel,
  decorators: [WithTooltipProvider(), WithClassname('max-w-2xl'), withRouter],
}

export default meta
type Story = StoryObj<typeof SupplyStatusPanel>

export const CanBeSupplied: Story = {
  name: 'Can Be Supplied',
  args: {
    status: 'yes',
    token: tokens['rETH'],
    totalSupplied: NormalizedUnitNumber(72_000),
    supplyCap: NormalizedUnitNumber(112_000),
    apy: Percentage(0.05),
  },
}

export const CanBeSuppliedMobile = getMobileStory(CanBeSupplied)
export const CanBeSuppliedTablet = getTabletStory(CanBeSupplied)

export const SupplyCapReached: Story = {
  name: 'Supply Cap Reached',
  args: {
    status: 'supply-cap-reached',
    token: tokens['rETH'],
    totalSupplied: NormalizedUnitNumber(112_000),
    supplyCap: NormalizedUnitNumber(112_000),
    apy: Percentage(0.05),
  },
}

export const CannotBeSupplied: Story = {
  name: 'Cannot Be Supplied',
  args: {
    status: 'no',
    token: tokens['rETH'],
    totalSupplied: NormalizedUnitNumber(0),
    supplyCap: NormalizedUnitNumber(0),
    apy: Percentage(0),
  },
}
