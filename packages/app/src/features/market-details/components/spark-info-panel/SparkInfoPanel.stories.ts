import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

import { SparkInfoPanel } from './SparkInfoPanel'

const meta: Meta<typeof SparkInfoPanel> = {
  title: 'Features/MarketDetails/Components/SparkInfoPanel',
  component: SparkInfoPanel,
  args: {
    amount: NormalizedUnitNumber(1234567890),
  },
}

export default meta
type Story = StoryObj<typeof SparkInfoPanel>

export const Supply: Story = {
  args: {
    eligibleToken: TokenSymbol('ETH'),
    variant: 'deposit',
  },
}
export const SupplyMobile = getMobileStory(Supply)
export const SupplyTablet = getTabletStory(Supply)

export const Borrow: Story = {
  args: {
    eligibleToken: TokenSymbol('DAI'),
    variant: 'borrow',
  },
}
export const BorrowMobile = getMobileStory(Borrow)
export const BorrowTablet = getTabletStory(Borrow)
