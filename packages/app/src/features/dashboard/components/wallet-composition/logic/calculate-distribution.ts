import BigNumber from 'bignumber.js'

import { TokenWithValue } from '@/domain/common/types'
import { Percentage } from '@/domain/types/NumericValues'

export interface TokenWithDistribution extends TokenWithValue {
  distribution: Percentage
}

export function calculateDistribution(assets: TokenWithValue[]): TokenWithDistribution[] {
  const totalCollateralUSD = assets.reduce((acc, curr) => acc.plus(curr.token.toUSD(curr.value)), new BigNumber(0))
  return assets.map((asset) => ({
    ...asset,
    distribution: Percentage(asset.token.toUSD(asset.value).dividedBy(totalCollateralUSD)),
  }))
}
