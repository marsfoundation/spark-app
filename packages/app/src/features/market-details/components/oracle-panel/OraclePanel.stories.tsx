import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { getMockReserve } from '@/test/integration/constants'
import { WithClassname, WithTooltipProvider, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { tokens } from '@storybook/tokens'
import { OraclePanel } from './OraclePanel'

const meta: Meta<typeof OraclePanel> = {
  title: 'Features/MarketDetails/Components/OraclePanel',
  component: OraclePanel,
  decorators: [WithTooltipProvider(), ZeroAllowanceWagmiDecorator(), WithClassname('max-w-2xl')],
  args: {
    isLoading: false,
    error: undefined,
  },
}

export default meta
type Story = StoryObj<typeof OraclePanel>

export const FixedDesktop: Story = {
  args: {
    data: {
      oracle: {
        type: 'fixed',
      },
      token: tokens.DAI,
      price: NormalizedUnitNumber(1),
      chainId: 1,
      priceOracleAddress: '0x1234567890123456789012345678901234567890',
    },
  },
}
export const FixedMobile = getMobileStory(FixedDesktop)
export const FixedTablet = getTabletStory(FixedDesktop)

export const MarketPriceDesktop: Story = {
  args: {
    data: {
      oracle: {
        type: 'market-price',
        providedBy: ['chainlink'],
      },
      token: tokens.WETH,
      price: NormalizedUnitNumber(2235.0672),
      chainId: 1,
      priceOracleAddress: '0x1234567890123456789012345678901234567890',
    },
  },
}
export const MarketPriceRedundantDesktop: Story = {
  args: {
    data: {
      oracle: {
        type: 'market-price',
        providedBy: ['chainlink', 'chronicle'],
      },
      token: tokens.WETH,
      price: NormalizedUnitNumber(2235.0672),
      chainId: 1,
      priceOracleAddress: '0x1234567890123456789012345678901234567890',
    },
  },
}
export const MarketPriceMobile = getMobileStory(MarketPriceDesktop)
export const MarketPriceTablet = getTabletStory(MarketPriceDesktop)

export const UnderlyingAssetDesktop: Story = {
  args: {
    data: {
      oracle: {
        type: 'underlying-asset',
        asset: 'EUR (FIAT)',
      },
      token: tokens.EURe,
      price: NormalizedUnitNumber(1.24),
      chainId: 1,
      priceOracleAddress: '0x1234567890123456789012345678901234567890',
    },
  },
}
export const UnderlyingAssetMobile = getMobileStory(UnderlyingAssetDesktop)
export const UnderlyingAssetTablet = getTabletStory(UnderlyingAssetDesktop)

export const YieldingFixedDesktop: Story = {
  args: {
    data: {
      oracle: {
        type: 'yielding-fixed',
        baseAsset: TokenSymbol('ETH'),
        providedBy: ['chainlink'],
        ratio: async () => NormalizedUnitNumber(2.137),
      },
      ratio: NormalizedUnitNumber(2.137),
      price: NormalizedUnitNumber(4776.34),
      baseTokenReserve: getMockReserve({
        token: tokens.WETH,
      }),
      token: tokens.weETH,
      chainId: 1,
      priceOracleAddress: '0x1234567890123456789012345678901234567890',
    },
  },
}
export const YieldingFixedRedundantDesktop: Story = {
  args: {
    data: {
      oracle: {
        type: 'yielding-fixed',
        baseAsset: TokenSymbol('ETH'),
        providedBy: ['chainlink', 'chronicle'],
        ratio: async () => NormalizedUnitNumber(2.137),
      },
      ratio: NormalizedUnitNumber(2.137),
      price: NormalizedUnitNumber(4776.34),
      baseTokenReserve: getMockReserve({
        token: tokens.WETH,
      }),
      token: tokens.weETH,
      chainId: 1,
      priceOracleAddress: '0x1234567890123456789012345678901234567890',
    },
  },
}
export const YieldingFixedMobile = getMobileStory(YieldingFixedDesktop)
export const YieldingFixedTablet = getTabletStory(YieldingFixedDesktop)

export const UnknownDesktop: Story = {
  args: {
    data: {
      oracle: undefined,
      price: NormalizedUnitNumber(1.06),
      token: tokens.sDAI,
      chainId: 1,
      priceOracleAddress: '0x1234567890123456789012345678901234567890',
    },
  },
}

export const UnknownMobile = getMobileStory(UnknownDesktop)
export const UnknownTablet = getTabletStory(UnknownDesktop)

export const LoadingDesktop: Story = {
  args: {
    data: undefined,
    isLoading: true,
  },
}
