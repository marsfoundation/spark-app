import { WithClassname, WithTooltipProvider } from '@sb/decorators'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { AssetStatusBadge } from './AssetStatusBadge'

const meta: Meta<typeof AssetStatusBadge> = {
  title: 'Features/Markets/Components/AssetStatusBadge',
  component: AssetStatusBadge,
  decorators: [WithTooltipProvider(), WithClassname('bg-primary flex justify-center p-8 items-end w-46 md:w-96 h-56')],
}

export default meta
type Story = StoryObj<typeof AssetStatusBadge>

export const Default: Story = {
  name: 'All Active',
  args: {
    supplyStatus: 'yes',
    collateralStatus: 'yes',
    borrowStatus: 'yes',
  },
}

export const SupplyCapReached: Story = {
  name: 'Supply Cap Reached',
  args: {
    supplyStatus: 'supply-cap-reached',
    collateralStatus: 'yes',
    borrowStatus: 'yes',
  },
}

export const CollateralOff: Story = {
  name: 'Collateral Off',
  args: {
    supplyStatus: 'yes',
    collateralStatus: 'no',
    borrowStatus: 'yes',
  },
}

export const BorrowOff: Story = {
  name: 'Borrow Off',
  args: {
    supplyStatus: 'yes',
    collateralStatus: 'yes',
    borrowStatus: 'no',
  },
}

export const CollateralIsolationMode: Story = {
  name: 'Collateral Isolation Mode',
  args: {
    supplyStatus: 'yes',
    collateralStatus: 'only-in-isolation-mode',
    borrowStatus: 'yes',
  },
}

export const BorrowCapReached: Story = {
  name: 'Borrow Cap Reached',
  args: {
    supplyStatus: 'yes',
    collateralStatus: 'yes',
    borrowStatus: 'borrow-cap-reached',
  },
}

export const BorrowSiloedMode: Story = {
  name: 'Borrow Siloed Mode',
  args: {
    supplyStatus: 'yes',
    collateralStatus: 'yes',
    borrowStatus: 'only-in-siloed-mode',
  },
}

export const Mobile = getMobileStory(Default)
export const Tablet = getTabletStory(Default)
