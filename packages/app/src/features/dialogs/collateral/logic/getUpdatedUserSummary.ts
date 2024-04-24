import { NativeAssetInfo } from '@/config/chain/types'
import { AaveData } from '@/domain/market-info/aave-data-layer/query'
import { MarketInfo, UserPositionSummary } from '@/domain/market-info/marketInfo'
import { updatePositionSummary } from '@/domain/market-info/updatePositionSummary'
import { Token } from '@/domain/types/Token'

export interface GetUpdatedUserSummaryParams {
  useAsCollateral: boolean
  token: Token
  marketInfo: MarketInfo
  aaveData: AaveData
  nativeAssetInfo: NativeAssetInfo
}

export function getUpdatedUserSummary({
  useAsCollateral,
  token,
  marketInfo,
  aaveData,
  nativeAssetInfo,
}: GetUpdatedUserSummaryParams): UserPositionSummary {
  const reserve = marketInfo.findOneReserveByToken(token)

  return updatePositionSummary({
    reservesWithUseAsCollateralFlag: [
      {
        reserve,
        useAsCollateral,
      },
    ],
    marketInfo,
    aaveData,
    nativeAssetInfo,
  })
}
