import { Percentage } from '@/domain/types/NumericValues'
import BigNumber from 'bignumber.js'
import { AssetsTableRow } from '../AssetTable'

export interface AssetsTableRowWithDistribution extends AssetsTableRow {
  distribution: Percentage
}

export function calculateDistribution(assets: AssetsTableRow[]): AssetsTableRowWithDistribution[] {
  const totalCollateralUSD = assets.reduce((acc, curr) => acc.plus(curr.token.toUSD(curr.value)), new BigNumber(0))
  return assets.map((asset) => ({
    ...asset,
    distribution: Percentage(asset.token.toUSD(asset.value).dividedBy(totalCollateralUSD)),
  }))
}
