import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { tokens } from '@storybook/tokens'
import { OraclePanel } from './OraclePanel'

const meta: Meta<typeof OraclePanel> = {
  title: 'Features/MarketDetails/Components/OraclePanel',
  component: OraclePanel,
  decorators: [WithTooltipProvider(), ZeroAllowanceWagmiDecorator(), WithClassname('max-w-2xl')],
  args: {
    chainId: 1,
    priceOracleAddress: '0x1234567890123456789012345678901234567890',
  },
}

export default meta
type Story = StoryObj<typeof OraclePanel>

export const FixedDesktop: Story = {
  args: {
    oracle: {
      type: 'fixed',
    },
    token: tokens.DAI,
    price: NormalizedUnitNumber(1),
  },
}
export const FixedMobile = getMobileStory(FixedDesktop)
export const FixedTablet = getTabletStory(FixedDesktop)

export const MarketPriceDesktop: Story = {
  args: {
    oracle: {
      type: 'market-price',
      providedBy: ['chainlink'],
    },
    token: tokens.WETH,
    price: NormalizedUnitNumber(2235.0672),
  },
}
export const MarketPriceRedundantDesktop: Story = {
  args: {
    oracle: {
      type: 'market-price',
      providedBy: ['chainlink', 'chronicle'],
    },
    token: tokens.WETH,
    price: NormalizedUnitNumber(2235.0672),
  },
}
export const MarketPriceMobile = getMobileStory(MarketPriceDesktop)
export const MarketPriceTablet = getTabletStory(MarketPriceDesktop)

export const UnderlyingAssetDesktop: Story = {
  args: {
    oracle: {
      type: 'underlying-asset',
      asset: 'EUR (FIAT)',
    },
    token: tokens.EURe,
    price: NormalizedUnitNumber(1.24),
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
      ratio: async () => NormalizedUnitNumber(2.137),
    },
    ratio: NormalizedUnitNumber(2.137),
    price: NormalizedUnitNumber(4776.34),
    baseToken: tokens.ETH,
    token: tokens.weETH,
  },
}
export const YieldingFixedRedundantDesktop: Story = {
  args: {
    oracle: {
      type: 'yielding-fixed',
      baseAsset: TokenSymbol('ETH'),
      providedBy: ['chainlink', 'chronicle'],
      ratio: async () => NormalizedUnitNumber(2.137),
    },
    ratio: NormalizedUnitNumber(2.137),
    price: NormalizedUnitNumber(4776.34),
    baseToken: tokens.ETH,
    token: tokens.weETH,
  },
}
export const YieldingFixedMobile = getMobileStory(YieldingFixedDesktop)
export const YieldingFixedTablet = getTabletStory(YieldingFixedDesktop)

export const UnknownDesktop: Story = {
  args: {
    price: NormalizedUnitNumber(1.06),
    token: tokens.sDAI,
  },
}

export const UnknownMobile = getMobileStory(UnknownDesktop)
export const UnknownTablet = getTabletStory(UnknownDesktop)
