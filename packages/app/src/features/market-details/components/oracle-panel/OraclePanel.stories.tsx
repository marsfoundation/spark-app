import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { OraclePanel } from './OraclePanel'

const meta: Meta<typeof OraclePanel> = {
  title: 'Features/MarketDetails/Components/OraclePanel',
  component: OraclePanel,
  decorators: [WithTooltipProvider(), ZeroAllowanceWagmiDecorator()],
}

export default meta
type Story = StoryObj<typeof OraclePanel>

export const FixedDesktop: Story = {
  args: {
    oracle: {
      type: 'fixed',
    },
  },
}
export const FixedMobile = getMobileStory(FixedDesktop)
export const FixedTablet = getTabletStory(FixedDesktop)

export const MarketPriceDesktop: Story = {
  args: {
    oracle: {
      type: 'market-price',
      providedBy: ['chainlink', 'chronicle'],
    },
  },
}
export const MarketPriceMobile = getMobileStory(MarketPriceDesktop)
export const MarketPriceTablet = getTabletStory(MarketPriceDesktop)

export const UnderlyingAssetDesktop: Story = {
  args: {
    oracle: {
      type: 'underlying-asset',
      asset: 'USD (FORD)',
    },
  },
}
export const UnderlyingAssetMobile = getMobileStory(UnderlyingAssetDesktop)
export const UnderlyingAssetTablet = getTabletStory(UnderlyingAssetDesktop)

export const YieldingFixedDesktop: Story = {
  args: {
    oracle: {
      type: 'yielding-fixed',
      baseAsset: TokenSymbol('ETH'),
      providedBy: ['chainlink'],
      ratio: async () => NormalizedUnitNumber(2),
    },
  },
}
export const YieldingFixedMobile = getMobileStory(YieldingFixedDesktop)
export const YieldingFixedTablet = getTabletStory(YieldingFixedDesktop)
