import { WithTooltipProvider } from '@sb/decorators'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { bigNumberify } from '@/utils/bigNumber'

import { HealthFactorPanel } from './HealthFactorPanel'

const meta: Meta<typeof HealthFactorPanel> = {
  title: 'Components/Organisms/HealthFactorPanel',
  decorators: [WithTooltipProvider()],
  component: HealthFactorPanel,
  args: {
    hf: bigNumberify(1.5),
  },
}

export default meta
type Story = StoryObj<typeof HealthFactorPanel>

export const Full: Story = {
  args: {
    hf: bigNumberify(4.13),
    variant: 'full-details',
    liquidationDetails: {
      liquidationPrice: NormalizedUnitNumber(1262.9),
      tokenWithPrice: {
        priceInUSD: NormalizedUnitNumber(1895.81),
        symbol: TokenSymbol('ETH'),
      },
    },
  },
}

export const Mobile = getMobileStory(Full)
export const Tablet = getTabletStory(Full)

export const WithLiquidationPrice: Story = {
  args: {
    hf: bigNumberify(2.5),
    variant: 'with-liquidation-price',
    liquidationDetails: {
      liquidationPrice: NormalizedUnitNumber(1262.9),
      tokenWithPrice: {
        priceInUSD: NormalizedUnitNumber(1895.81),
        symbol: TokenSymbol('ETH'),
      },
    },
  },
}

export const WithLiquidationPriceMobile = getMobileStory(WithLiquidationPrice)
export const WithLiquidationPriceTablet = getTabletStory(WithLiquidationPrice)
