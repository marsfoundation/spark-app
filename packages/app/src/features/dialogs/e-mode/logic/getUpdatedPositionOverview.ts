import { NativeAssetInfo } from '@/config/chain/types'
import { EModeCategoryId } from '@/domain/e-mode/types'
import { AaveData } from '@/domain/market-info/aave-data-layer/query'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { updatePositionSummary } from '@/domain/market-info/updatePositionSummary'

import { PositionOverview } from '../types'

export interface GetUpdatedPositionOverviewParams {
  marketInfo: MarketInfo
  aaveData: AaveData
  selectedEModeCategoryId: EModeCategoryId
  currentEModeCategoryId: EModeCategoryId
  nativeAssetInfo: NativeAssetInfo
}

export function getUpdatedPositionOverview({
  marketInfo,
  aaveData,
  currentEModeCategoryId,
  selectedEModeCategoryId,
  nativeAssetInfo,
}: GetUpdatedPositionOverviewParams): PositionOverview | undefined {
  if (currentEModeCategoryId === selectedEModeCategoryId) {
    return undefined
  }

  const { healthFactor, maxLoanToValue: maxLTV } = updatePositionSummary({
    marketInfo,
    aaveData,
    eModeCategoryId: selectedEModeCategoryId,
    nativeAssetInfo,
  })

  return {
    healthFactor,
    maxLTV,
  }
}
