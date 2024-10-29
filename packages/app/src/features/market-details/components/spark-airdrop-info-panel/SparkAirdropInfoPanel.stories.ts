import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { getMobileStory, getTabletStory } from '@storybook-config/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { SparkAirdropInfoPanel } from './SparkAirdropInfoPanel'

const meta: Meta<typeof SparkAirdropInfoPanel> = {
  title: 'Features/MarketDetails/Components/SparkAirdropInfoPanel',
  component: SparkAirdropInfoPanel,
}

export default meta
type Story = StoryObj<typeof SparkAirdropInfoPanel>

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
